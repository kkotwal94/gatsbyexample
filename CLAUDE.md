# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Gatsby example project that demonstrates sourcing markdown content from an external API and rendering it with multiple template styles. The project includes:
- An Express API server that serves markdown files
- Two distinct UI templates for displaying content
- Dynamic page generation based on API data
- Responsive design with styled-components

## Architecture

The project consists of two main parts:
1. **API Server** (`/api-server`) - Express server serving markdown files with frontmatter
2. **Gatsby Site** (root) - Sources data from API and renders pages dynamically

### Key Technologies
- Gatsby 5 with React 18
- Express.js for API
- Styled Components for styling
- React Markdown for content rendering
- Gray Matter for markdown frontmatter parsing

## Project Structure

```
/GatsbyExample
├── api-server/              # Express API server
│   ├── markdown-files/      # 5 example markdown files
│   ├── server.js           # API endpoints
│   └── package.json        # API dependencies
├── src/
│   ├── components/         # Layout, Header, SEO components
│   ├── templates/          # template1.js (blog), template2.js (card)
│   ├── pages/             # index.js, about.js, 404.js
│   ├── styles/            # global.css
│   └── images/            # Image assets
├── gatsby-config.js        # Plugins and site metadata
├── gatsby-node.js         # API sourcing and page creation
├── gatsby-browser.js      # Global styles import
└── package.json           # Project dependencies
```

## Key Commands

```bash
# Install all dependencies (run from project root)
npm install
cd api-server && npm install && cd ..

# Development (runs both API and Gatsby)
npm run dev

# Or run separately:
npm run start-api    # Start API server (port 3001)
npm run develop      # Start Gatsby dev server (port 8000)

# Production build
npm run build         # Basic build
npm run build:full    # Clean cache + build
npm run build:with-api # Start API + build (recommended)
npm run preview       # Build + serve in one command

# Serving production build
npm run serve         # Serve on localhost:9000
npm run serve:host    # Serve on all network interfaces

# Utilities
npm run clean         # Clear Gatsby cache
```

## Data Flow

1. **API Server** (`api-server/server.js`):
   - Serves markdown files from `/api/markdown-files` endpoint
   - Parses frontmatter using gray-matter
   - Returns JSON with metadata and content

2. **Gatsby Source** (`gatsby-node.js`):
   - Fetches data from API during build
   - Creates GraphQL nodes for each markdown file
   - Dynamically creates pages using appropriate template

3. **Templates** (`src/templates/`):
   - `template1.js`: Blog-style layout with hero image
   - `template2.js`: Card-style layout with split design
   - Both use GraphQL to query post data

## Development Workflow

### Adding New Content
1. Create markdown file in `api-server/markdown-files/`
2. Include required frontmatter fields:
   - `title`, `description`, `image`, `footerText`, `template`
   - Optional: `date`, `author`, `category`, `tags`, `results`
3. Restart API server if needed
4. Content appears automatically on next build

### Template Selection
- Set `template: "template1"` for blog-style layout
- Set `template: "template2"` for card-style layout
- Templates are assigned in `gatsby-node.js` during page creation

## Important Files

### gatsby-node.js
- Sources markdown from API using axios
- Creates GraphQL schema for MarkdownPost type
- Generates pages dynamically based on template field
- Falls back to dummy data if API is unavailable

### API Endpoints
- `GET /api/markdown-files` - Returns all markdown files
- `GET /api/markdown-files/:id` - Returns specific file

### Styling
- Uses styled-components for CSS-in-JS
- Global styles in `src/styles/global.css`
- Responsive breakpoints at 768px and 968px

## Common Issues

1. **API Connection Failed**: 
   - Ensure API server is running on port 3001
   - Check `gatsby-node.js` falls back to dummy data

2. **Build Errors**:
   - Run `gatsby clean` to clear cache
   - Check all markdown files have required frontmatter

3. **Port Conflicts**:
   - API runs on 3001, Gatsby on 8000
   - Change in respective config files if needed

## Testing

To verify everything works:
1. Start API server: `npm run start-api`
2. In new terminal: `npm run develop`
3. Visit http://localhost:8000
4. Click on posts to see different templates
5. Check responsive design on mobile sizes