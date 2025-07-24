import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const CardContainer = styled.article`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  background-image: url(${props => props.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'});
  background-size: cover;
  background-position: center;
  min-height: 500px;
  position: relative;
  
  @media (max-width: 968px) {
    min-height: 300px;
  }
`;

const ContentSection = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Badge = styled.span`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 2rem;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  flex-grow: 1;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #333;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  h3 {
    font-size: 1.4rem;
  }
  
  p {
    margin-bottom: 1.25rem;
  }
  
  ul, ol {
    margin-bottom: 1.25rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const ResultsSection = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    
    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }
  }
`;

const CallToAction = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin-top: 2rem;
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  margin: 0;
  font-weight: 500;
`;

const Template2 = ({ data }) => {
  const post = data.markdownPost;
  
  return (
    <Layout>
      <SEO title={post.title} description={post.description} />
      <CardContainer>
        <CardLayout>
          <ImageSection image={post.image} />
          
          <ContentSection>
            <div>
              <Header>
                {post.category && <Badge>{post.category}</Badge>}
                <Title>{post.title}</Title>
                <Description>{post.description}</Description>
                <MetaInfo>
                  {post.date && <span>📅 {new Date(post.date).toLocaleDateString()}</span>}
                  {post.author && <span>✍️ {post.author}</span>}
                  {post.client && <span>🏢 {post.client}</span>}
                </MetaInfo>
              </Header>
              
              <Content>
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </Content>
              
              {post.results && post.results.length > 0 && (
                <ResultsSection>
                  <h3>Key Results</h3>
                  <ResultsList>
                    {post.results.map((result, index) => (
                      <li key={index}>{result}</li>
                    ))}
                  </ResultsList>
                </ResultsSection>
              )}
            </div>
            
            {post.footerText && (
              <CallToAction>
                <CTAText>{post.footerText}</CTAText>
              </CallToAction>
            )}
          </ContentSection>
        </CardLayout>
      </CardContainer>
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
      category
      client
      results
    }
  }
`;

export default Template2;