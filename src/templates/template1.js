import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const BlogContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 3rem;
`;

const HeroImage = styled.div`
  width: 100%;
  height: 400px;
  background-image: url(${props => props.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop'});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #666;
  font-style: italic;
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  code {
    background-color: #f4f4f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
  
  pre {
    background-color: #f4f4f4;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    margin-bottom: 1.5rem;
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  blockquote {
    border-left: 4px solid #ddd;
    padding-left: 1rem;
    margin-left: 0;
    font-style: italic;
    color: #666;
  }
`;

const Footer = styled.footer`
  margin-top: 4rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const Template1 = ({ data }) => {
  const post = data.markdownPost;
  
  return (
    <Layout>
      <SEO title={post.title} description={post.description} />
      <BlogContainer>
        <HeroSection>
          <HeroImage image={post.image} />
          <Title>{post.title}</Title>
          <Description>{post.description}</Description>
          <MetaInfo>
            {post.date && <span>Published on {new Date(post.date).toLocaleDateString()}</span>}
            {post.author && <span>By {post.author}</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </MetaInfo>
        </HeroSection>
        
        <Content>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Content>
        
        {post.footerText && (
          <Footer>
            <FooterText>{post.footerText}</FooterText>
          </Footer>
        )}
      </BlogContainer>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownPost(slug: { eq: $slug }) {
      title
      description
      image
      footerText
      content
      date
      author
      readTime
    }
  }
`;

export default Template1;