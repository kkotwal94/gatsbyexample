import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const PostCard = styled(Link)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PostImage = styled.div`
  height: 200px;
  background-image: url(${props => props.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop'});
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0;
  position: relative;
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostCategory = styled.span`
  display: inline-block;
  background: ${props => props.template === 'template2' ? '#007bff' : '#28a745'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const PostTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const PostDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #999;
`;

const PostDate = styled.span``;

const PostAuthor = styled.span``;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownPost.nodes;
  
  return (
    <Layout>
      <SEO title="Home" />
      <Container>
        <HeroSection>
          <HeroTitle>Welcome to Gatsby Markdown Example</HeroTitle>
          <HeroDescription>
            Explore our collection of articles showcasing different template styles
            and content types, all sourced from our markdown API.
          </HeroDescription>
        </HeroSection>
        
        {posts.length > 0 ? (
          <PostGrid>
            {posts.map(post => (
              <PostCard key={post.slug} to={`/posts/${post.slug}`}>
                <PostImage image={post.image} />
                <PostContent>
                  <PostCategory template={post.template}>
                    {post.category || (post.template === 'template2' ? 'Feature' : 'Article')}
                  </PostCategory>
                  <PostTitle>{post.title}</PostTitle>
                  <PostDescription>{post.description}</PostDescription>
                  <PostMeta>
                    <PostDate>
                      {post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}
                    </PostDate>
                    <PostAuthor>{post.author || 'Team'}</PostAuthor>
                  </PostMeta>
                </PostContent>
              </PostCard>
            ))}
          </PostGrid>
        ) : (
          <NoPostsMessage>
            <h2>No posts available</h2>
            <p>Make sure your API server is running on port 3001</p>
          </NoPostsMessage>
        )}
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query {
    allMarkdownPost {
      nodes {
        slug
        title
        description
        image
        template
        date
        author
        category
      }
    }
  }
`;

export default IndexPage;