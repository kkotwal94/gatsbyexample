const axios = require('axios');
const path = require('path');

// Create schema customization to define our markdown data structure
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  
  const typeDefs = `
    type MarkdownPost implements Node {
      id: String!
      slug: String!
      title: String!
      description: String!
      image: String
      footerText: String
      template: String!
      content: String!
      date: String
      author: String
      category: String
      readTime: String
      client: String
      tags: [String]
      results: [String]
      cta1Text: String
      cta1Link: String
      cta2Text: String
      cta2Link: String
      stats: String
      features: String
      version: String
      lastUpdated: String
    }
  `;
  
  createTypes(typeDefs);
};

// Fetch data from API and create nodes
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  try {
    // Fetch markdown files from our API
    console.log('Attempting to fetch markdown files from API...');
    const response = await axios.get('http://localhost:3001/api/markdown-files', {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Gatsby-Build'
      }
    });
    
    if (!response.data || !response.data.success) {
      throw new Error('API response indicates failure');
    }
    
    const markdownFiles = response.data.data;
    console.log(`Successfully fetched ${markdownFiles.length} markdown files from API`);
    
    // Create nodes for each markdown file
    markdownFiles.forEach(file => {
      const nodeData = {
        ...file,
        id: createNodeId(`markdown-${file.id}`),
        internal: {
          type: 'MarkdownPost',
          contentDigest: createContentDigest(file),
        },
      };
      
      createNode(nodeData);
    });
  } catch (error) {
    console.error('Error fetching markdown files:', error.message);
    console.error('API URL attempted:', 'http://localhost:3001/api/markdown-files');
    // If API is not running, use static fallback data
    console.log('⚠️  API server not accessible, loading static fallback data...');
    
    // Load static fallback data
    const fs = require('fs');
    const path = require('path');
    
    try {
      const fallbackDataPath = path.join(__dirname, 'src', 'data', 'posts.json');
      const fallbackData = JSON.parse(fs.readFileSync(fallbackDataPath, 'utf8'));
      console.log(`✅ Loaded ${fallbackData.length} posts from static fallback data`);
      
      // Use fallback data instead of dummy data
      var markdownFiles = fallbackData;
    } catch (fallbackError) {
      console.error('Error loading fallback data:', fallbackError.message);
      console.log('Creating minimal dummy data as last resort...');
      
      var markdownFiles = [
        {
          id: 'dummy-1',
          slug: 'dummy-post',
          title: 'Site Under Construction',
          description: 'This site is currently being set up. Please check back soon!',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop',
          footerText: 'Thank you for your patience while we set up the site.',
          template: 'template1',
          content: '# Site Under Construction\n\nWe\'re currently setting up this site. Please check back soon for great content!',
          date: '2024-01-01',
          author: 'Site Admin'
        }
      ];
    }
    
    // Create nodes from fallback data
    markdownFiles.forEach(file => {
      const nodeData = {
        ...file,
        id: createNodeId(`markdown-${file.id}`),
        internal: {
          type: 'MarkdownPost',
          contentDigest: createContentDigest(file),
        },
      };
      
      createNode(nodeData);
    });
  }
};

// Create pages from markdown posts
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  
  // Query all markdown posts
  const result = await graphql(`
    query {
      allMarkdownPost {
        nodes {
          slug
          template
        }
      }
    }
  `);
  
  if (result.errors) {
    console.error('Error querying markdown posts:', result.errors);
    return;
  }
  
  // Create a page for each markdown post
  result.data.allMarkdownPost.nodes.forEach(post => {
    let templatePath;
    
    switch(post.template) {
      case 'template2':
        templatePath = path.resolve('./src/templates/template2.js');
        break;
      case 'template3':
        templatePath = path.resolve('./src/templates/template3.js');
        break;
      case 'template4':
        templatePath = path.resolve('./src/templates/template4.js');
        break;
      default:
        templatePath = path.resolve('./src/templates/template1.js');
    }
    
    createPage({
      path: `/posts/${post.slug}`,
      component: templatePath,
      context: {
        slug: post.slug,
      },
    });
  });
};