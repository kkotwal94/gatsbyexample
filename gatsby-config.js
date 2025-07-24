module.exports = {
  pathPrefix: `/gatsbyexample`,
  siteMetadata: {
    title: `Gatsby Markdown API Example`,
    description: `A Gatsby site that sources markdown files from an API with multiple templates`,
    author: `@gatsbyjs`,
    siteUrl: `https://kkotwal94.github.io/gatsbyexample`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
  ],
}