require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');
const chokidar = require('chokidar');
const axios = require('axios');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Function to commit and push changes
async function commitAndPushChanges(changeType, fileName) {
  const AUTO_COMMIT = process.env.AUTO_COMMIT === 'true';
  
  if (!AUTO_COMMIT) {
    console.log('ℹ️  Auto-commit is disabled. Set AUTO_COMMIT=true to enable.');
    return;
  }
  
  try {
    // Navigate to the parent directory (main repo)
    const repoRoot = path.join(__dirname, '..');
    
    // Check if we're in a git repository
    try {
      await execPromise('git status', { cwd: repoRoot });
    } catch (error) {
      console.log('⚠️  Not in a git repository. Skipping auto-commit.');
      return;
    }
    
    // Stage the changed file
    const filePath = path.join('api-server', 'markdown-files', fileName);
    await execPromise(`git add "${filePath}"`, { cwd: repoRoot });
    
    // Check if there are changes to commit
    const { stdout: statusOutput } = await execPromise('git status --porcelain', { cwd: repoRoot });
    if (!statusOutput.trim()) {
      console.log('ℹ️  No changes to commit.');
      return;
    }
    
    // Create commit message
    const commitMessage = `Auto-update: ${changeType} ${fileName}`;
    await execPromise(`git commit -m "${commitMessage}"`, { cwd: repoRoot });
    console.log(`✅ Committed: ${commitMessage}`);
    
    // Push to remote (set upstream if needed)
    try {
      await execPromise('git push', { cwd: repoRoot });
    } catch (pushError) {
      // If push fails due to no upstream, set it and try again
      if (pushError.message.includes('no upstream branch')) {
        console.log('📌 Setting upstream branch...');
        const { stdout: branchName } = await execPromise('git branch --show-current', { cwd: repoRoot });
        await execPromise(`git push --set-upstream origin ${branchName.trim()}`, { cwd: repoRoot });
      } else {
        throw pushError;
      }
    }
    console.log('✅ Pushed changes to GitHub');
    
  } catch (error) {
    console.error('❌ Failed to commit/push changes:', error.message);
    console.log('💡 Make sure you have git configured and you\'re on a branch that can be pushed.');
  }
}

// Function to trigger build webhooks
async function triggerBuilds(changeType, fileName) {
  console.log(`📁 File change detected: ${changeType} - ${fileName}`);
  
  // First, commit and push changes if auto-commit is enabled
  if (fileName.endsWith('.md')) {
    await commitAndPushChanges(changeType, fileName);
  }
  
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

// Endpoint to update a markdown file
app.put('/api/markdown-files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, frontmatter } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }
    
    const filePath = path.join(__dirname, 'markdown-files', `${id}.md`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Markdown file not found'
      });
    }
    
    // Combine frontmatter and content
    let fileContent = '';
    
    if (frontmatter && Object.keys(frontmatter).length > 0) {
      fileContent = '---\n';
      
      // Convert frontmatter object to YAML format
      Object.entries(frontmatter).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes('\n')) {
          // Multi-line strings
          fileContent += `${key}: |\n  ${value.replace(/\n/g, '\n  ')}\n`;
        } else if (typeof value === 'string' && (value.includes(':') || value.includes('"') || value.includes("'"))) {
          // Strings that need quotes
          fileContent += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
        } else {
          // Simple values
          fileContent += `${key}: ${value}\n`;
        }
      });
      
      fileContent += '---\n\n';
    }
    
    fileContent += content;
    
    // Write the file
    await fs.writeFile(filePath, fileContent, 'utf-8');
    
    // Return the updated file data
    const { data, content: markdownContent } = matter(fileContent);
    
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
    console.error('Error updating markdown file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update markdown file'
    });
  }
});

// Endpoint to create a new markdown file
app.post('/api/markdown-files', async (req, res) => {
  try {
    const { filename, content, frontmatter } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        error: 'Filename and content are required'
      });
    }
    
    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const filePath = path.join(__dirname, 'markdown-files', `${sanitizedFilename}.md`);
    
    // Check if file already exists
    try {
      await fs.access(filePath);
      return res.status(409).json({
        success: false,
        error: 'File already exists'
      });
    } catch {
      // File doesn't exist, which is what we want
    }
    
    // Combine frontmatter and content
    let fileContent = '';
    
    if (frontmatter && Object.keys(frontmatter).length > 0) {
      fileContent = '---\n';
      
      Object.entries(frontmatter).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes('\n')) {
          fileContent += `${key}: |\n  ${value.replace(/\n/g, '\n  ')}\n`;
        } else if (typeof value === 'string' && (value.includes(':') || value.includes('"') || value.includes("'"))) {
          fileContent += `${key}: "${value.replace(/"/g, '\\"')}"\n`;
        } else {
          fileContent += `${key}: ${value}\n`;
        }
      });
      
      fileContent += '---\n\n';
    }
    
    fileContent += content;
    
    // Write the file
    await fs.writeFile(filePath, fileContent, 'utf-8');
    
    // Return the created file data
    const { data, content: markdownContent } = matter(fileContent);
    
    res.json({
      success: true,
      data: {
        id: sanitizedFilename,
        slug: sanitizedFilename,
        ...data,
        content: markdownContent
      }
    });
  } catch (error) {
    console.error('Error creating markdown file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create markdown file'
    });
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
  
  // Show auto-commit status
  if (process.env.AUTO_COMMIT === 'true') {
    console.log('✅ Auto-commit enabled: Changes will be automatically committed and pushed to GitHub');
  } else {
    console.log('ℹ️  Auto-commit disabled: Set AUTO_COMMIT=true to automatically commit and push changes');
  }
});