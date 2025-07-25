import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';

const DocumentationContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  
  @media (max-width: 968px) {
    position: static;
    max-height: none;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SidebarTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #666;
  margin-bottom: 1rem;
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled.li`
  margin-bottom: 0.5rem;
  
  a {
    display: block;
    padding: 0.5rem 1rem;
    color: #666;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    
    &:hover {
      color: #333;
      background: #f8f9fa;
    }
    
    &.active {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      font-weight: 600;
    }
  }
  
  &.depth-2 {
    margin-left: 1rem;
    font-size: 0.9rem;
  }
  
  &.depth-3 {
    margin-left: 2rem;
    font-size: 0.85rem;
  }
`;

const MainContent = styled.main`
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const DocHeader = styled.header`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f1f3f5;
`;

const DocTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const DocMeta = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  color: #666;
  font-size: 0.9rem;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const VersionBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const DocContent = styled.div`
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin: 3rem 0 1.5rem;
    color: #1a1a1a;
    position: relative;
    
    &:before {
      content: '#';
      position: absolute;
      left: -1.5rem;
      color: #667eea;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    &:hover:before {
      opacity: 1;
    }
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
    margin-bottom: 0.75rem;
  }
  
  blockquote {
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    background: #f8f9fa;
    border-left: 4px solid #667eea;
    
    p {
      margin-bottom: 0;
    }
  }
  
  code {
    background: #f1f3f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: #1a1a1a;
    color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2rem 0;
    
    code {
      background: none;
      padding: 0;
      font-size: 0.875rem;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    
    th {
      font-weight: 600;
      background: #f8f9fa;
    }
  }
  
  .note {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    
    &::before {
      content: '💡 Note: ';
      font-weight: 600;
    }
  }
  
  .warning {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    
    &::before {
      content: '⚠️ Warning: ';
      font-weight: 600;
    }
  }
`;

const FooterNav = styled.nav`
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
`;

const NavButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
  
  &.prev {
    flex-direction: row-reverse;
  }
`;

const Template4 = ({ data }) => {
  const { markdownPost } = data;
  const { title, description, content, version, lastUpdated, author, readTime } = markdownPost;
  const [tableOfContents, setTableOfContents] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Extract headings for table of contents
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const toc = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const depth = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      
      toc.push({
        id,
        text,
        depth
      });
    }
    
    setTableOfContents(toc);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const processedContent = content.replace(
    /^(#{2,3})\s+(.+)$/gm,
    (match, hashes, text) => {
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `${hashes} <span id="${id}">${text}</span>`;
    }
  );

  return (
    <Layout>
      <SEO title={title} description={description} />
      <DocumentationContainer>
        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Table of Contents</SidebarTitle>
            <TOCList>
              {tableOfContents.map((item) => (
                <TOCItem key={item.id} className={`depth-${item.depth}`}>
                  <a 
                    href={`#${item.id}`}
                    className={activeSection === item.id ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                  >
                    {item.text}
                  </a>
                </TOCItem>
              ))}
            </TOCList>
          </SidebarSection>
        </Sidebar>

        <MainContent>
          <DocHeader>
            <DocTitle>{title}</DocTitle>
            <DocMeta>
              {version && <VersionBadge>v{version}</VersionBadge>}
              {author && (
                <MetaItem>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {author}
                </MetaItem>
              )}
              {readTime && (
                <MetaItem>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readTime} read
                </MetaItem>
              )}
              {lastUpdated && (
                <MetaItem>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Updated: {new Date(lastUpdated).toLocaleDateString()}
                </MetaItem>
              )}
            </DocMeta>
          </DocHeader>

          <DocContent>
            <ReactMarkdown 
              components={{
                h2: ({ children }) => {
                  const id = children.toString().toLowerCase().replace(/[^\w]+/g, '-');
                  return <h2 id={id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const id = children.toString().toLowerCase().replace(/[^\w]+/g, '-');
                  return <h3 id={id}>{children}</h3>;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </DocContent>

          <FooterNav>
            <NavButton href="#" className="prev">
              ← Previous
            </NavButton>
            <NavButton href="#">
              Next →
            </NavButton>
          </FooterNav>
        </MainContent>
      </DocumentationContainer>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownPost(slug: { eq: $slug }) {
      slug
      title
      description
      content
      version
      lastUpdated
      author
      readTime
    }
  }
`;

export default Template4;