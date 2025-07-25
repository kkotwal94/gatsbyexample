import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';

const PortfolioContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const HeroContent = styled.div``;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CTAButton = styled.a`
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  }
  
  &.secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
    }
  }
`;

const HeroImage = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    pointer-events: none;
  }
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 20px;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const MarkdownContent = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 3rem 0 1.5rem;
    color: #1a1a1a;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 1rem;
    color: #1a1a1a;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  blockquote {
    margin: 2rem 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    font-style: italic;
  }
  
  code {
    background: #f1f3f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
  }
  
  pre {
    background: #1a1a1a;
    color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
  }
`;

const FooterSection = styled.footer`
  text-align: center;
  padding: 3rem 0;
  border-top: 1px solid #e9ecef;
  margin-top: 4rem;
`;

const FooterText = styled.p`
  color: #666;
  font-size: 1.1rem;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Template3 = ({ data }) => {
  const { markdownPost } = data;
  const { 
    title, 
    description, 
    image, 
    content, 
    footerText,
    cta1Text,
    cta1Link,
    cta2Text,
    cta2Link,
    stats,
    features 
  } = markdownPost;

  const parsedStats = stats ? JSON.parse(stats) : [];
  const parsedFeatures = features ? JSON.parse(features) : [];

  return (
    <Layout>
      <SEO title={title} description={description} />
      <PortfolioContainer>
        <HeroSection>
          <HeroContent>
            <HeroTitle>{title}</HeroTitle>
            <HeroDescription>{description}</HeroDescription>
            <CTAGroup>
              {cta1Text && cta1Link && (
                <CTAButton href={cta1Link} className="primary">
                  {cta1Text}
                </CTAButton>
              )}
              {cta2Text && cta2Link && (
                <CTAButton href={cta2Link} className="secondary">
                  {cta2Text}
                </CTAButton>
              )}
            </CTAGroup>
          </HeroContent>
          {image && (
            <HeroImage>
              <img src={image} alt={title} />
            </HeroImage>
          )}
        </HeroSection>

        {parsedStats.length > 0 && (
          <StatsSection>
            {parsedStats.map((stat, index) => (
              <StatCard key={index}>
                <StatNumber>{stat.value}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsSection>
        )}

        {parsedFeatures.length > 0 && (
          <ContentSection>
            <SectionTitle>Key Features</SectionTitle>
            <FeaturesGrid>
              {parsedFeatures.map((feature, index) => (
                <FeatureCard key={index}>
                  <FeatureIcon>{feature.icon || '✨'}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </ContentSection>
        )}

        <ContentSection>
          <MarkdownContent>
            <ReactMarkdown>{content}</ReactMarkdown>
          </MarkdownContent>
        </ContentSection>

        {footerText && (
          <FooterSection>
            <FooterText dangerouslySetInnerHTML={{ __html: footerText }} />
          </FooterSection>
        )}
      </PortfolioContainer>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownPost(slug: { eq: $slug }) {
      slug
      title
      description
      image
      content
      footerText
      cta1Text
      cta1Link
      cta2Text
      cta2Link
      stats
      features
    }
  }
`;

export default Template3;