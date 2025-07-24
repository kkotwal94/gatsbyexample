# Deployment Guide

This guide covers how to build and deploy your Gatsby Markdown API Example.

## Build Commands

### Quick Build
```bash
npm run build:full    # Clean + build
```

### Build with API Running
```bash
npm run build:with-api    # Ensures API is running during build
```

### Complete Deployment Build
```bash
npm run build:deploy     # Custom build script with summary
```

## Build Output

After running any build command, you'll find the production files in the `public/` directory:

```
public/
├── index.html           # Homepage
├── posts/               # Generated post pages
│   ├── post-1/
│   ├── post-2/
│   └── ...
├── about/               # About page
├── 404.html            # 404 error page
├── *.js                # JavaScript bundles
├── *.css               # Stylesheets
└── page-data/          # Gatsby page data (JSON)
```

## Deployment Options

### 1. Static Hosting (Recommended)

Deploy the `public/` directory to any static hosting service:

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build:full`
3. Set publish directory: `public`
4. Deploy!

#### Vercel
1. Import your repository
2. Framework: Gatsby
3. Build command: `npm run build:full`
4. Output directory: `public`

#### GitHub Pages
```bash
npm run build:full
# Copy contents of public/ to gh-pages branch
```

### 2. CDN Deployment

Upload the `public/` directory contents to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage

### 3. Traditional Web Server

Upload `public/` directory contents to your web server's document root.

## Important Notes

### API Server Dependency
- The build process fetches data from the local API server
- For production, you may want to:
  1. Replace the API with a headless CMS
  2. Use static markdown files
  3. Deploy the API server separately

### Environment Variables
Create production environment variables if needed:
```bash
# .env.production
GATSBY_API_URL=https://your-api-domain.com
```

### Performance Optimization
The build automatically includes:
- ✅ Code splitting
- ✅ Image optimization
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ HTML optimization

## Testing Production Build

Before deploying, test your production build locally:

```bash
npm run preview        # Build + serve
# or
npm run build:full     # Build
npm run serve          # Serve at http://localhost:9000
```

## Build Troubleshooting

### Common Issues

1. **API Connection Failed**
   ```bash
   # Ensure API server is running
   npm run start-api
   # Then build
   npm run build
   ```

2. **Out of Memory**
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 node_modules/.bin/gatsby build
   ```

3. **Build Cache Issues**
   ```bash
   npm run clean        # Clear cache
   npm run build:full   # Clean build
   ```

## Deployment Checklist

- [ ] API server is running during build
- [ ] All images load correctly
- [ ] Build completes without errors
- [ ] Test production build locally
- [ ] Check all pages render correctly
- [ ] Verify responsive design
- [ ] Test on multiple browsers
- [ ] Set up monitoring/analytics
- [ ] Configure domain/SSL (if applicable)

## Post-Deployment

After deployment, verify:
- All pages load correctly
- Images display properly
- Navigation works
- Responsive design functions
- SEO meta tags are present