import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background-color: #333;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  
  &:hover {
    color: #ccc;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  
  &:hover {
    color: #ccc;
  }
  
  &.active {
    color: #007bff;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Nav>
        <Logo to="/">Gatsby Markdown Example</Logo>
        <NavLinks>
          <NavLink to="/" activeClassName="active">
            Home
          </NavLink>
          <NavLink to="/about" activeClassName="active">
            About
          </NavLink>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;