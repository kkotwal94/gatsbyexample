# GitHub Pages Deployment Setup

This guide will help you deploy your Gatsby Markdown API Example to GitHub Pages with automatic rebuilds when markdown files change.

## Overview

The setup includes:
- 🚀 **Automatic deployment** to GitHub Pages via GitHub Actions
- 🔄 **Auto-rebuild** when markdown files are added/modified
- 📊 **Build monitoring** and detailed logging
- 🎯 **Manual deployment** trigger from GitHub UI

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. Click **Save**

### 2. Configure Repository Settings

#### Required Repository Secrets (if using API webhooks)

Go to **Settings** → **Secrets and variables** → **Actions**:

```bash
# For automatic webhook triggers from your API server
GITHUB_TOKEN = your_personal_access_token_with_repo_scope
```

**To create a Personal Access Token:**
1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token**
3. Select scopes: `repo` (full repository access)
4. Copy the token and add it as a repository secret

### 3. Configure Your API Server for GitHub Integration

#### Option A: Deploy API Server (Recommended for Production)

Deploy your API server to a hosting service:

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Render:**
1. Connect your GitHub repository
2. Select "Web Service"
3. Build Command: `cd api-server && npm install`
4. Start Command: `cd api-server && npm start`

**Environment Variables for Deployed API:**
```bash
GITHUB_BUILD_HOOK_URL=https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches
GITHUB_TOKEN=your_personal_access_token
```

#### Option B: Local Development Setup

For testing locally:

```bash
# Create api-server/.env file
echo "GITHUB_BUILD_HOOK_URL=https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches" >> api-server/.env
echo "GITHUB_TOKEN=your_personal_access_token" >> api-server/.env

# Install dependencies and start
cd api-server
npm install
npm start
```

### 4. Test the Setup

#### Automatic Triggers

1. **File Change Trigger:**
   ```bash
   # Add new markdown file
   cp api-server/markdown-files/post-1.md api-server/markdown-files/new-post.md
   git add api-server/markdown-files/new-post.md
   git commit -m "Add new post"
   git push origin main
   ```

2. **API Webhook Trigger (if API server is deployed):**
   ```bash
   # Edit existing file
   echo "## New Section" >> api-server/markdown-files/post-1.md
   # API server will automatically trigger GitHub Actions
   ```

#### Manual Triggers

1. **From GitHub UI:**
   - Go to **Actions** tab
   - Select "Deploy to GitHub Pages" workflow
   - Click **Run workflow**
   - Add optional reason and click **Run workflow**

2. **Via API:**
   ```bash
   # Manual trigger via your API server
   curl -X POST http://localhost:3001/api/trigger-build \
     -H "Content-Type: application/json" \
     -d '{"service": "github"}'
   ```

### 5. Monitor Deployments

#### GitHub Actions Dashboard
- Go to **Actions** tab in your repository
- View real-time build logs and deployment status
- See trigger reasons (push, webhook, manual)

#### Build Information
Each deployment logs:
- Trigger type and reason
- Changed files (if applicable)
- Build statistics (file counts)
- Deployment URL
- Timing information

#### API Server Status
Check your API server status:
```bash
curl http://your-api-server.com/api/status
# or locally: curl http://localhost:3001/api/status
```

## GitHub Actions Workflow Features

### Smart Triggering
The workflow triggers on:
- **Push to main**: When code or markdown files change
- **Repository dispatch**: When API server detects file changes
- **Manual dispatch**: From GitHub UI or API

### Path-Based Filtering
Only triggers when relevant files change:
```yaml
paths:
  - 'api-server/markdown-files/**'  # Markdown content
  - 'src/**'                       # React components
  - 'gatsby-*.js'                  # Gatsby config
  - 'package*.json'                # Dependencies
```

### Comprehensive Logging
Each step provides detailed output:
- Dependency installation progress
- API server startup validation
- Build statistics and file counts
- Deployment verification

### Error Handling
- API server timeout protection (30 seconds)
- Proper cleanup of background processes
- Detailed error reporting

## Troubleshooting

### Common Issues

#### 1. Workflow Not Triggering
```bash
# Check if GitHub Pages is enabled
# Verify workflow file is in .github/workflows/
# Ensure you're pushing to the main branch
```

#### 2. API Server Connection Failed
```bash
# Check if API server is deployed and accessible
# Verify environment variables are set
# Test API endpoint: curl YOUR_API_URL/api/status
```

#### 3. Repository Dispatch Not Working
```bash
# Verify GitHub token has repo scope
# Check repository URL format in GITHUB_BUILD_HOOK_URL
# Test webhook manually:
curl -X POST https://api.github.com/repos/USER/REPO/dispatches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"event_type": "markdown_file_change"}'
```

#### 4. Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Ensure API server starts successfully
- Review build logs in Actions tab

### Debug Commands

```bash
# Test API locally
npm run start-api &
curl http://localhost:3001/api/status
curl http://localhost:3001/api/markdown-files

# Test build locally
npm run build:full

# Test manual webhook
curl -X POST http://localhost:3001/api/trigger-build
```

## Advanced Configuration

### Custom Domain
1. Add CNAME file to `static/` directory:
   ```bash
   echo "your-domain.com" > static/CNAME
   ```
2. Configure DNS to point to your GitHub Pages URL

### Environment-Specific Builds
```javascript
// gatsby-node.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.GATSBY_API_URL || 'http://localhost:3001'
  : 'http://localhost:3001';
```

### Scheduled Rebuilds
Add to workflow file:
```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
```

## Performance Optimization

### Caching Strategy
- GitHub Actions caches node_modules
- API responses are cached with timestamps
- Build artifacts use incremental builds when possible

### Build Time Optimization
- Dependencies are cached between runs
- API server validation prevents unnecessary builds
- Path-based triggering reduces false deployments

## Security Best Practices

- Use repository secrets for sensitive data
- Limit GitHub token permissions to minimum required
- Validate webhook payloads in production
- Use HTTPS for all API communications

## Monitoring and Analytics

### GitHub Actions Insights
- View workflow run history
- Monitor success/failure rates
- Track deployment times

### API Server Monitoring
- Check `/api/status` endpoint regularly
- Monitor file change detection logs
- Track webhook success rates

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review GitHub Actions logs
3. Test API server connectivity
4. Verify repository settings and secrets