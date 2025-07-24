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
      image: String!
      footerText: String!
      template: String!
      content: String!
      date: String
      author: String
      category: String
      readTime: String
      client: String
      tags: [String]
      results: [String]
    }
  `;
  
  createTypes(typeDefs);
};

// Fetch data from API and create nodes
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions;
  
  try {
    // Fetch markdown files from our API
    const response = await axios.get('http://localhost:3001/api/markdown-files');
    const markdownFiles = response.data.data;
    
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
    console.error('Error fetching markdown files:', error);
    // If API is not running, create some dummy data for development
    console.log('Creating dummy data for development...');
    
    const dummyData = [
      {
        id: 'dummy-1',
        slug: 'dummy-post',
        title: 'Dummy Post',
        description: 'This is a dummy post for development',
        image: '/images/placeholder.jpg',
        footerText: 'Footer text here',
        template: 'template1',
        content: '# Dummy Content\n\nThis is dummy content for development.',
        date: '2024-01-01',
        author: 'Dev Team'
      }
    ];
    
    dummyData.forEach(file => {
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
    const templatePath = post.template === 'template2' 
      ? path.resolve('./src/templates/template2.js')
      : path.resolve('./src/templates/template1.js');
    
    createPage({
      path: `/posts/${post.slug}`,
      component: templatePath,
      context: {
        slug: post.slug,
      },
    });
  });
};