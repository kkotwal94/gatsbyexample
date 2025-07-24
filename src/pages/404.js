import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 6rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #777;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1.1rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: #0056b3;
  }
`;

const NotFoundPage = () => {
  return (
    <Layout>
      <SEO title="404 - Page Not Found" />
      <Container>
        <Title>404</Title>
        <Subtitle>Page Not Found</Subtitle>
        <Description>
          Oops! The page you're looking for doesn't exist.
          It might have been moved or deleted.
        </Description>
        <BackLink to="/">Go Back Home</BackLink>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;