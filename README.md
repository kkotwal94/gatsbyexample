# Gatsby Markdown API Examples

This project demonstrates how to build a Gatsby site that sources markdown content from an external API and displays it using multiple template styles.

## Features

- 🚀 **API Integration**: Sources markdown files from a custom Express API
- 📝 **Multiple Templates**: Two distinct template styles for different content types
- 💅 **Styled Components**: Modern CSS-in-JS styling
- 📱 **Responsive Design**: Mobile-friendly layouts
- 🖼️ **Real Images**: Uses Unsplash images with fallback support
- 🔄 **Auto-Deployment**: Automatic rebuilds when markdown files change
- ⚡ **Fast Performance**: Gatsby's static generation for optimal speed
- 🔍 **SEO Ready**: Built-in SEO optimization

## Project Structure

```
/GatsbyExample
├── api-server/                 # Express API server
│   ├── markdown-files/        # Markdown content files
│   ├── server.js             # API server code
│   └── package.json          # API dependencies
├── src/                       # Gatsby source files
│   ├── components/           # React components
│   ├── templates/            # Page templates
│   ├── pages/               # Static pages
│   ├── styles/              # Global styles
│   └── images/              # Image assets
├── gatsby-config.js          # Gatsby configuration
├── gatsby-node.js           # Dynamic page creation
└── package.json             # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GatsbyExample
```

2. Install dependencies:
```bash
# Install Gatsby dependencies
npm install

# Install API server dependencies
cd api-server
npm install
cd ..
```

### Running the Project

1. Start the API server (in one terminal):
```bash
npm run start-api
```
The API will run on http://localhost:3001

2. Start Gatsby development server (in another terminal):
```bash
npm run develop
```
The site will run on http://localhost:8000

Alternatively, run both with one command:
```bash
npm run dev
```

### Building for Production

#### Basic Build
```bash
npm run build              # Build the site
npm run serve              # Serve production build locally
```

#### Complete Build Options
```bash
npm run build:full         # Clean cache + build
npm run build:with-api     # Start API + build (ensures API is running)
npm run preview            # Build + serve in one command
npm run serve:host         # Serve on all network interfaces (0.0.0.0)
```

#### Build Output
- Production files are generated in the `public/` directory
- Deploy the contents of `public/` to your hosting provider
- The build includes optimized HTML, CSS, and JavaScript files

## Template Types

### Template 1 - Blog Style
- Hero image section
- Single column layout
- Ideal for articles, tutorials, and news posts
- Clean, readable design

### Template 2 - Card Style
- Split layout with image and content
- Feature highlights
- Perfect for product showcases and case studies
- Call-to-action focused

## Markdown File Structure

Each markdown file should include the following frontmatter:

```markdown
---
title: "Post Title"
description: "Brief description"
image: "https://images.unsplash.com/photo-example?w=1200&h=800&fit=crop"
footerText: "Call to action text"
template: "template1" # or "template2"
date: "2024-01-15" # optional
author: "Author Name" # optional
category: "Category" # optional
---

# Markdown content here
```

**Note**: Images use Unsplash URLs for demonstration. Each template has fallback images if the URL fails to load.

## API Endpoints

- `GET /api/markdown-files` - Get all markdown files
- `GET /api/markdown-files/:id` - Get a specific markdown file

## Technologies Used

- **Gatsby 5** - Static site generator
- **React 18** - UI library
- **Styled Components** - CSS-in-JS styling
- **Express** - API server
- **Gray Matter** - Markdown frontmatter parsing
- **React Markdown** - Markdown rendering

## Development

### Adding New Content

1. Create a new markdown file in `api-server/markdown-files/`
2. Include all required frontmatter fields
3. Choose a template type
4. Restart the API server if needed
5. The new content will appear automatically

### Creating New Templates

1. Create a new template file in `src/templates/`
2. Update `gatsby-node.js` to handle the new template
3. Add template selection logic in markdown frontmatter

## Troubleshooting

- **API Connection Issues**: Ensure the API server is running on port 3001
- **Build Errors**: Run `gatsby clean` to clear cache
- **Missing Content**: Check that markdown files have all required fields
- **Port Conflicts**: Change ports in configuration files if needed

## Automatic Deployment

The API server can automatically trigger rebuilds when markdown files change:

1. **File Watching**: Detects when markdown files are added, modified, or deleted
2. **Webhook Integration**: Supports Netlify, Vercel, GitHub Actions, and custom webhooks
3. **Automatic Rebuilds**: Your site updates automatically when content changes

### Quick Setup for Netlify
```bash
# 1. Get your Netlify build hook URL from site settings
# 2. Add to api-server/.env file:
echo "NETLIFY_BUILD_HOOK_URL=your_webhook_url" > api-server/.env

# 3. Install dependencies and restart API
cd api-server && npm install && npm start
```

See [AUTO-DEPLOYMENT.md](AUTO-DEPLOYMENT.md) for complete setup instructions.

## License

MIT License - feel free to use this project for learning and development!

https://kkotwal94.github.io/gatsbyexample/