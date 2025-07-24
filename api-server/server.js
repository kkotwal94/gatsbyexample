const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const chokidar = require('chokidar');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuration for build triggers
const BUILD_WEBHOOKS = {
  netlify: process.env.NETLIFY_BUILD_HOOK_URL,
  vercel: process.env.VERCEL_BUILD_HOOK_URL,
  github: process.env.GITHUB_BUILD_HOOK_URL,
  custom: process.env.CUSTOM_BUILD_HOOK_URL
};

// Store for caching markdown files
let markdownCache = new Map();
let cacheLastUpdated = null;

// Endpoint to get all markdown files
app.get('/api/markdown-files', async (req, res) => {
  try {
    const markdownDir = path.join(__dirname, 'markdown-files');
    const files = await fs.readdir(markdownDir);
    
    const markdownFiles = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(markdownDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const { data, content: markdownContent } = matter(content);
          
          return {
            id: file.replace('.md', ''),
            slug: file.replace('.md', ''),
            ...data,
            content: markdownContent
          };
        })
    );
    
    res.json({
      success: true,
      data: markdownFiles
    });
  } catch (error) {
    console.error('Error reading markdown files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to read markdown files'
    });
  }
});

// Endpoint to get a single markdown file
app.get('/api/markdown-files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(__dirname, 'markdown-files', `${id}.md`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    
    res.json({
      success: true,
      data: {
        id,
        slug: id,
        ...data,
        content: markdownContent
      }
    });
  } catch (error) {
    console.error('Error reading markdown file:', error);
    res.status(404).json({
      success: false,
      error: 'Markdown file not found'
    });
  }
});

// Function to trigger build webhooks
async function triggerBuilds(changeType, fileName) {
  console.log(`📁 File change detected: ${changeType} - ${fileName}`);
  
  const promises = [];
  
  // Trigger all configured webhooks
  Object.entries(BUILD_WEBHOOKS).forEach(([service, url]) => {
    if (url) {
      console.log(`🚀 Triggering ${service} build...`);
      
      let promise;
      if (service === 'github') {
        // GitHub repository dispatch requires special formatting
        promise = axios.post(url, {
          event_type: 'markdown_file_change',
          client_payload: {
            changeType,
            fileName,
            timestamp: new Date().toISOString(),
            trigger: 'api_file_change'
          }
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          }
        }).catch(error => {
          console.error(`❌ Failed to trigger ${service} build:`, error.message);
          if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Response: ${JSON.stringify(error.response.data)}`);
          }
        });
      } else {
        // Standard webhook format for other services
        promise = axios.post(url, {
          trigger: 'markdown_file_change',
          changeType,
          fileName,
          timestamp: new Date().toISOString()
        }).catch(error => {
          console.error(`❌ Failed to trigger ${service} build:`, error.message);
        });
      }
      
      promises.push(promise);
    }
  });
  
  if (promises.length > 0) {
    await Promise.allSettled(promises);
    console.log('✅ Build triggers sent');
  } else {
    console.log('⚠️  No build webhooks configured');
    console.log('💡 To enable auto-deployment, configure environment variables:');
    console.log('   - NETLIFY_BUILD_HOOK_URL for Netlify');
    console.log('   - VERCEL_BUILD_HOOK_URL for Vercel');
    console.log('   - GITHUB_BUILD_HOOK_URL + GITHUB_TOKEN for GitHub Pages');
  }
}

// Function to invalidate cache and trigger builds
function invalidateCache(changeType, fileName) {
  markdownCache.clear();
  cacheLastUpdated = null;
  
  // Debounce build triggers to avoid multiple rapid builds
  clearTimeout(buildTriggerTimeout);
  buildTriggerTimeout = setTimeout(() => {
    triggerBuilds(changeType, fileName);
  }, 2000); // Wait 2 seconds before triggering
}

let buildTriggerTimeout;

// Watch for changes in markdown files
const markdownDir = path.join(__dirname, 'markdown-files');
const watcher = chokidar.watch(markdownDir, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100
  }
});

watcher
  .on('add', (filePath) => {
    const fileName = path.basename(filePath);
    if (fileName.endsWith('.md')) {
      console.log(`➕ New markdown file added: ${fileName}`);
      invalidateCache('add', fileName);
    }
  })
  .on('change', (filePath) => {
    const fileName = path.basename(filePath);
    if (fileName.endsWith('.md')) {
      console.log(`📝 Markdown file changed: ${fileName}`);
      invalidateCache('change', fileName);
    }
  })
  .on('unlink', (filePath) => {
    const fileName = path.basename(filePath);
    if (fileName.endsWith('.md')) {
      console.log(`🗑️  Markdown file deleted: ${fileName}`);
      invalidateCache('delete', fileName);
    }
  });

// Webhook endpoint for manual build triggers
app.post('/api/trigger-build', async (req, res) => {
  try {
    const { service } = req.body;
    
    if (service && BUILD_WEBHOOKS[service]) {
      await triggerBuilds('manual', 'manual trigger');
      res.json({ success: true, message: `Build triggered for ${service}` });
    } else {
      await triggerBuilds('manual', 'manual trigger');
      res.json({ success: true, message: 'Build triggered for all configured services' });
    }
  } catch (error) {
    console.error('Error triggering build:', error);
    res.status(500).json({ success: false, error: 'Failed to trigger build' });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  const configuredWebhooks = Object.entries(BUILD_WEBHOOKS)
    .filter(([, url]) => url)
    .map(([service]) => service);
  
  res.json({
    status: 'running',
    cacheLastUpdated,
    configuredWebhooks,
    watchingDirectory: markdownDir,
    cachedFiles: markdownCache.size
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Markdown files endpoint: http://localhost:${PORT}/api/markdown-files`);
  console.log(`Manual build trigger: http://localhost:${PORT}/api/trigger-build`);
  console.log(`Server status: http://localhost:${PORT}/api/status`);
  console.log(`👀 Watching for markdown file changes in: ${markdownDir}`);
  
  const configuredServices = Object.entries(BUILD_WEBHOOKS)
    .filter(([, url]) => url)
    .map(([service]) => service);
  
  if (configuredServices.length > 0) {
    console.log(`🔗 Build webhooks configured for: ${configuredServices.join(', ')}`);
  } else {
    console.log('⚠️  No build webhooks configured. Set environment variables to enable auto-deployment.');
  }
});