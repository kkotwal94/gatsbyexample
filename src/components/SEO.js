import React from 'react';

const SEO = ({ title, description }) => {
  const siteTitle = 'Gatsby Markdown API Example';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'A Gatsby site that sources markdown files from an API with multiple templates';
  
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </>
  );
};

export default SEO;