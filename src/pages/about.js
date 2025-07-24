import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const AboutPage = () => {
  return (
    <Layout>
      <SEO title="About" description="Learn about our Gatsby Markdown API example" />
      <Container>
        <Title>About This Project</Title>
        <Content>
          <p>
            This is a demonstration of Gatsby's powerful data sourcing capabilities,
            showcasing how to build a modern static site that sources content from
            an external API.
          </p>
          <p>
            The project features:
          </p>
          <ul>
            <li>Custom API integration for markdown content</li>
            <li>Multiple template designs for different content types</li>
            <li>Responsive, modern UI built with styled-components</li>
            <li>Dynamic page generation based on API data</li>
            <li>SEO optimization and performance best practices</li>
          </ul>
          <p>
            Each post demonstrates a different template style, showing how flexible
            Gatsby can be when it comes to presenting content in various formats.
          </p>
        </Content>
      </Container>
    </Layout>
  );
};

export default AboutPage;