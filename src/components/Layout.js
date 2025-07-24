import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
`;

const Layout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
      <Footer>
        <p>&copy; 2024 Gatsby Markdown API Example. All rights reserved.</p>
      </Footer>
    </LayoutWrapper>
  );
};

export default Layout;