# Quick Start Guide

Get your Gatsby Markdown API Example running and deployed to GitHub Pages in minutes!

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
cd api-server && npm install && cd ..
```

### 2. Start Development
```bash
# Run both API server and Gatsby development server
npm run dev
```

Visit:
- **Gatsby site**: http://localhost:8000
- **API server**: http://localhost:3001/api/status

### 3. Test Production Build
```bash
# Test the complete build process
npm run test:build

# Or build and serve manually
npm run build:full
npm run serve  # Visit http://localhost:9000
```

## 📝 Adding Content

### Add New Markdown Files
1. Create a new file in `api-server/markdown-files/`
2. Use this template:
```markdown
---
title: "Your Post Title"
description: "Brief description of your post"
image: "https://images.unsplash.com/photo-example?w=1200&h=800&fit=crop"
footerText: "Call to action or footer message"
template: "template1"  # or "template2"
date: "2024-01-01"
author: "Your Name"
---

# Your Content Here

Write your markdown content...
```

3. The API server will detect the change automatically
4. Refresh your browser to see the new content

### Choose Templates
- **template1**: Blog-style layout with hero image
- **template2**: Card-style layout for products/case studies

## 🌐 Deploy to GitHub Pages

### One-Time Setup

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Set source to **"GitHub Actions"**
   - Save

3. **First Deployment**
   ```bash
   # Push to trigger automatic deployment
   git push origin main
   ```

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO`

### Automatic Rebuilds (Optional)

To enable automatic rebuilds when you add/edit markdown files:

1. **Create Personal Access Token**
   - GitHub Settings → Developer settings → Personal access tokens
   - Generate token with `repo` scope

2. **Add Repository Secret**
   - Repository Settings → Secrets → Actions
   - Add `GITHUB_TOKEN` with your token

3. **Configure API Server**
   ```bash
   # Create api-server/.env file
   echo "GITHUB_BUILD_HOOK_URL=https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches" >> api-server/.env
   echo "GITHUB_TOKEN=your_personal_access_token" >> api-server/.env
   
   # Deploy your API server to Railway, Render, or similar service
   ```

## 🛠️ Development Commands

```bash
# Start development with both servers
npm run dev

# Start API server only
npm run start-api

# Start Gatsby development only
npm run develop

# Build for production
npm run build:full          # Clean + build
npm run build:with-api      # Start API + build
npm run preview             # Build + serve

# Testing
npm run test:build          # Test build process
npm run test:deployment     # Full deployment test (requires bash)

# Utilities
npm run clean               # Clear Gatsby cache
```

## 📊 Monitoring

### GitHub Actions
- Check **Actions** tab for deployment status
- View build logs and error details
- Manually trigger deployments

### API Server Status
```bash
# Check if API is running
curl http://localhost:3001/api/status

# View all posts
curl http://localhost:3001/api/markdown-files

# Manually trigger build (if webhooks configured)
curl -X POST http://localhost:3001/api/trigger-build
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
npm run clean
npm run build:full

# Check API server is running
npm run start-api
```

### GitHub Pages Not Updating
1. Check Actions tab for build errors
2. Verify GitHub Pages is enabled
3. Ensure you're pushing to the main branch

### API Server Issues
```bash
# Kill any running servers
pkill -f "node server.js"

# Restart fresh
npm run start-api
```

### Port Conflicts
- API server: Change port in `api-server/server.js`
- Gatsby dev: Run `npm run develop -- -p 8001`

## 🎯 Next Steps

1. **Customize Styling**: Edit components in `src/templates/` and `src/components/`
2. **Add More Templates**: Create new template files and update `gatsby-node.js`
3. **Custom Domain**: Add `CNAME` file to `static/` directory
4. **Analytics**: Add Google Analytics or similar tracking
5. **SEO**: Enhance meta tags in `src/components/SEO.js`

## 📚 Learn More

- [Complete GitHub Pages Setup](GITHUB-PAGES-SETUP.md)
- [Auto-Deployment Guide](AUTO-DEPLOYMENT.md)
- [Deployment Options](DEPLOYMENT.md)
- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)

---

**Happy coding! 🎉** Your Gatsby site with automatic rebuilds is ready to go!