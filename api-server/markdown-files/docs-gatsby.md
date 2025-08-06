---
title: "Getting Started with Gatsby"
description: "A comprehensive guide to building blazing fast websites with Gatsby"
template: "template4"
version: "5.13.0"
lastUpdated: "2024-01-15"
author: "Documentation Team"
readTime: "15 min"
---





























## Introduction122

Gatsby is a free and open source framework based on React that helps developers build blazing fast websites and apps. It combines the best of React, GraphQL, and modern JavaScript to create incredibly performant websites.

## Prerequisites!

Before you begin, make sure you have the following installed:

- Node.js (v18.0.0 or newer)
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)

## Installation

### Quick Start

The fastest way to get started with Gatsby is using the Gatsby CLI:

```bash
npm install -g gatsby-cli
gatsby new my-gatsby-site
cd my-gatsby-site
gatsby develop
```

### Manual Installation

If you prefer to set up your project manually:

```bash
mkdir my-gatsby-site
cd my-gatsby-site
npm init -y
npm install gatsby react react-dom
```

## Project Structure

A typical Gatsby project has the following structure:

```
my-gatsby-site/
├── src/
│   ├── pages/
│   ├── components/
│   ├── templates/
│   └── images/
├── static/
├── gatsby-config.js
├── gatsby-node.js
├── gatsby-browser.js
└── gatsby-ssr.js
```

### Key Directories

- **src/pages**: Contains your site's pages. Each file becomes a route automatically
- **src/components**: Reusable React components
- **src/templates**: Page templates for programmatically created pages
- **static**: Files that are copied directly to the public folder

## Core Concepts

### Pages and Routing

Gatsby automatically creates pages from React components in `src/pages/`:

```javascript
// src/pages/about.js
import React from 'react'

export default function About() {
  return <h1>About Page</h1>
}
```

This creates a page at `/about`.

### GraphQL Data Layer

Gatsby uses GraphQL to manage data. You can query data in your pages:

```javascript
import { graphql } from 'gatsby'

export const query = graphql\`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
\`
```

### Plugins

Gatsby's plugin ecosystem is one of its greatest strengths. Common plugins include:

- `gatsby-plugin-image`: Optimized image loading
- `gatsby-source-filesystem`: Source data from your filesystem
- `gatsby-transformer-remark`: Transform markdown files

## Building Your First Page

Let's create a simple blog post page:

```javascript
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  
  return (
    <Layout>
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  )
}

export const query = graphql\`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
\`
```

## Performance Optimization

Gatsby includes many performance optimizations out of the box:

- **Code Splitting**: Automatically splits your code into smaller bundles
- **Prefetching**: Prefetches resources for faster navigation
- **Image Optimization**: Lazy loads and optimizes images
- **Static Generation**: Pre-builds pages at compile time

### Best Practices

1. Use `gatsby-plugin-image` for all images
2. Implement proper SEO with `gatsby-plugin-react-helmet`
3. Add a manifest file for PWA support
4. Use environment variables for sensitive data

## Deployment

Gatsby sites can be deployed to many platforms:

### Netlify

```bash
gatsby build
netlify deploy --dir=public
```

### GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "gatsby build && gh-pages -d public"
  }
}
```

## Troubleshooting

### Common Issues

**Build fails with "window is not defined"**
- Wrap browser-specific code in a check:
```javascript
if (typeof window !== 'undefined') {
  // Browser code here
}
```

**GraphQL query errors**
- Use GraphiQL at `http://localhost:8000/___graphql` to test queries

**Slow build times**
- Enable incremental builds
- Use `gatsby-plugin-netlify-cache` for CI/CD

## Next Steps

Now that you understand the basics, explore:

- [Advanced GraphQL queries](https://www.gatsbyjs.com/docs/graphql/)
- [Creating custom plugins](https://www.gatsbyjs.com/docs/creating-plugins/)
- [Gatsby Theme development](https://www.gatsbyjs.com/docs/themes/)
- [Server-side rendering options](https://www.gatsbyjs.com/docs/ssr/)

Happy building with Gatsby! 🚀