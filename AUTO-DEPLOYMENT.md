# Automatic Deployment Setup

This guide explains how to set up automatic rebuilds and deployments when markdown files are added or modified in your API.

## How It Works

1. **File Watching**: The API server watches the `api-server/markdown-files/` directory for changes
2. **Change Detection**: When files are added, modified, or deleted, the server detects the change
3. **Webhook Trigger**: The server automatically calls configured build webhooks
4. **Automatic Rebuild**: Your hosting provider rebuilds and deploys the site

## Setup Options

### Option 1: Netlify (Recommended)

#### 1. Get Your Build Hook URL
1. Go to your Netlify site dashboard
2. Navigate to Site settings → Build & deploy → Build hooks
3. Click "Add build hook"
4. Name it "Markdown Auto Deploy" and select your branch
5. Copy the generated webhook URL

#### 2. Configure Environment Variables
Create a `.env` file in your `api-server/` directory:
```bash
# api-server/.env
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
```

#### 3. Install Dependencies and Restart API
```bash
cd api-server
npm install  # Install new dependencies (chokidar, axios)
npm start    # Restart API server
```

#### 4. Deploy Configuration
Your `netlify.toml` is already configured. Just push to deploy!

### Option 2: Vercel

#### 1. Get Your Build Hook URL
1. Go to your Vercel project dashboard
2. Navigate to Settings → Git → Deploy Hooks
3. Create a new hook with your branch name
4. Copy the webhook URL

#### 2. Configure Environment Variables
```bash
# api-server/.env
VERCEL_BUILD_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/YOUR_HOOK_ID
```

#### 3. Deploy Configuration
Your `vercel.json` is already configured. Deploy via Git integration!

### Option 3: GitHub Pages with Actions

#### 1. Enable GitHub Pages
1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"

#### 2. Set Up Repository Dispatch
Create a Personal Access Token:
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Add to repository secrets as `GITHUB_TOKEN`

#### 3. Configure Environment Variables
```bash
# api-server/.env
GITHUB_BUILD_HOOK_URL=https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches
```

Your `.github/workflows/deploy.yml` is already configured!

### Option 4: Custom Webhook

For any other hosting provider:

```bash
# api-server/.env
CUSTOM_BUILD_HOOK_URL=https://your-hosting-provider.com/webhook-endpoint
```

## Testing the Setup

### 1. Check API Status
```bash
curl http://localhost:3001/api/status
```

Should show configured webhooks and watching status.

### 2. Test File Changes
```bash
# Add a new markdown file
cp api-server/markdown-files/post-1.md api-server/markdown-files/test-post.md

# Edit an existing file
echo "## New Section" >> api-server/markdown-files/post-1.md
```

Watch the API server logs for change detection and webhook triggers.

### 3. Manual Build Trigger
```bash
# Trigger build for all configured services
curl -X POST http://localhost:3001/api/trigger-build

# Trigger build for specific service
curl -X POST http://localhost:3001/api/trigger-build \
  -H "Content-Type: application/json" \
  -d '{"service": "netlify"}'
```

## Advanced Configuration

### Multiple Services
You can configure multiple build hooks simultaneously:
```bash
# api-server/.env
NETLIFY_BUILD_HOOK_URL=https://api.netlify.com/build_hooks/netlify_hook
VERCEL_BUILD_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/vercel_hook
GITHUB_BUILD_HOOK_URL=https://api.github.com/repos/user/repo/dispatches
```

### Debounce Settings
The system waits 2 seconds after a file change before triggering builds to avoid multiple rapid builds. You can modify this in `server.js`:
```javascript
buildTriggerTimeout = setTimeout(() => {
  triggerBuilds(changeType, fileName);
}, 2000); // Adjust timeout here
```

### Production Deployment

For production, you'll need to:

1. **Deploy Your API Server** to a service like:
   - Railway
   - Render
   - Heroku
   - DigitalOcean App Platform

2. **Update Gatsby Configuration** to point to your deployed API:
```javascript
// gatsby-node.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-server.com'
  : 'http://localhost:3001';
```

3. **Set Environment Variables** on your API server host

## Workflow Examples

### Content Creator Workflow
1. Content creator adds new markdown file to `api-server/markdown-files/`
2. API server detects the change
3. Webhooks trigger automatic rebuild
4. New content appears on live site within minutes

### Development Workflow
1. Developer modifies markdown files locally
2. Changes are immediately detected
3. Staging/preview deployments are triggered
4. Changes can be reviewed before going live

## Troubleshooting

### Webhooks Not Triggering
```bash
# Check API status
curl http://localhost:3001/api/status

# Check logs for errors
# Look for webhook configuration messages on server start
```

### Build Failures
- Ensure API server is accessible during build
- Check that all dependencies are properly installed
- Verify environment variables are set correctly

### File Changes Not Detected
- Ensure the API server has proper file permissions
- Check that `chokidar` is properly installed
- Verify the markdown files directory path

## Security Considerations

- Keep webhook URLs secret (use environment variables)
- Consider rate limiting for the manual trigger endpoint
- Use HTTPS for all webhook communications
- Validate webhook payloads in production

## Monitoring

The API provides a status endpoint for monitoring:
```bash
GET /api/status
```

Returns:
```json
{
  "status": "running",
  "cacheLastUpdated": "2024-01-15T10:30:00.000Z",
  "configuredWebhooks": ["netlify", "vercel"],
  "watchingDirectory": "/path/to/markdown-files",
  "cachedFiles": 5
}
```