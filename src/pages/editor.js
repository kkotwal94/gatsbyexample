import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const EditorContainer = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #2a2a2a;
  border-bottom: 1px solid #444;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileSelector = styled.select`
  padding: 0.5rem 1rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: #444;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  background: ${props => props.primary ? '#667eea' : '#444'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? '#5a67d8' : '#555'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.span`
  font-size: 0.9rem;
  color: ${props => props.error ? '#ff6b6b' : '#4ecdc4'};
`;

const PaneContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const EditorPane = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const PaneHeader = styled.div`
  padding: 0.75rem 1.5rem;
  background: #2a2a2a;
  border-bottom: 1px solid #444;
  font-size: 0.875rem;
  color: #ccc;
  font-weight: 500;
`;

const PreviewPane = styled.div`
  height: 100%;
  background: white;
  overflow-y: auto;
  padding: 2rem;
`;

const PreviewContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 2rem;
    margin: 2rem 0 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 1.5rem 0 0.75rem;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  code {
    background: #f4f4f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
  }
  
  pre {
    background: #1a1a1a;
    color: #f8f8f2;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
  }
  
  blockquote {
    border-left: 4px solid #667eea;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #666;
  }
`;

const NewFileModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const EditorPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState('');
  const [frontmatter, setFrontmatter] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [Editor, setEditor] = useState(null);
  const [Allotment, setAllotment] = useState(null);
  useEffect(() => {
    // Dynamically import client-side only modules
    const loadClientModules = async () => {
      const [editorModule, allotmentModule] = await Promise.all([
        import('@monaco-editor/react'),
        import('allotment')
      ]);
      
      // Import the CSS for allotment
      await import('allotment/dist/style.css');
      
      setEditor(() => editorModule.default);
      setAllotment(() => allotmentModule.Allotment);
      setIsClient(true);
    };
    
    loadClientModules();
    fetchFiles();
  }, []);

  // Browser-compatible frontmatter parser
  const parseFrontmatter = (content) => {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return { data: {}, content };
    }
    
    const [, frontmatterString, markdownContent] = match;
    const data = {};
    
    // Simple YAML parser for basic key-value pairs
    const lines = frontmatterString.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;
      
      let key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      data[key] = value;
    }
    
    return { data, content: markdownContent };
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/markdown-files');
      if (response.data.success) {
        setFiles(response.data.data);
        if (response.data.data.length > 0 && !selectedFile) {
          selectFile(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setStatus('Error loading files');
    }
  };

  const selectFile = (file) => {
    setSelectedFile(file);
    
    // Parse frontmatter and content
    const fullContent = `---
${Object.entries(file)
  .filter(([key]) => !['id', 'slug', 'content'].includes(key))
  .map(([key, value]) => `${key}: ${typeof value === 'string' && (value.includes('\n') || value.includes(':')) ? `"${value.replace(/"/g, '\\"')}"` : value}`)
  .join('\n')}
---

${file.content}`;
    
    setContent(fullContent);
    
    // Extract frontmatter for separate tracking
    const parsed = parseFrontmatter(fullContent);
    setFrontmatter(parsed.data);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    setSaving(true);
    setStatus('');
    
    try {
      // Parse the current content to separate frontmatter and markdown
      const parsed = parseFrontmatter(content);
      
      const response = await axios.put(
        `http://localhost:3001/api/markdown-files/${selectedFile.id}`,
        {
          content: parsed.content,
          frontmatter: parsed.data
        }
      );
      
      if (response.data.success) {
        setStatus('Saved successfully!');
        // Update the file in the list
        setFiles(files.map(f => 
          f.id === selectedFile.id ? response.data.data : f
        ));
        setSelectedFile(response.data.data);
        
        // Clear status after 3 seconds
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setStatus('Error saving file');
    } finally {
      setSaving(false);
    }
  };

  const handleNewFile = async () => {
    if (!newFileName) return;
    
    try {
      const response = await axios.post('http://localhost:3001/api/markdown-files', {
        filename: newFileName,
        content: '# New Post\n\nStart writing your content here...',
        frontmatter: {
          title: 'New Post',
          description: 'Description here',
          template: 'template1',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
          footerText: 'Footer text here'
        }
      });
      
      if (response.data.success) {
        setShowNewFileModal(false);
        setNewFileName('');
        await fetchFiles();
        selectFile(response.data.data);
      }
    } catch (error) {
      console.error('Error creating file:', error);
      setStatus('Error creating file');
    }
  };

  const getPreviewContent = () => {
    try {
      const parsed = parseFrontmatter(content);
      return parsed.content;
    } catch {
      return content;
    }
  };

  if (!isClient || !Editor || !Allotment) {
    return (
      <Layout>
        <SEO title="Markdown Editor" />
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading editor...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Markdown Editor" />
      <EditorContainer>
        <Toolbar>
          <ToolbarSection>
            <FileSelector 
              value={selectedFile?.id || ''} 
              onChange={(e) => {
                const file = files.find(f => f.id === e.target.value);
                if (file) selectFile(file);
              }}
            >
              {files.map(file => (
                <option key={file.id} value={file.id}>
                  {file.title || file.id}
                </option>
              ))}
            </FileSelector>
            <Button onClick={() => setShowNewFileModal(true)}>
              New File
            </Button>
          </ToolbarSection>
          
          <StatusMessage error={status.includes('Error')}>
            {status}
          </StatusMessage>
          
          <ToolbarSection>
            <Button 
              primary 
              onClick={handleSave} 
              disabled={!selectedFile || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </ToolbarSection>
        </Toolbar>
        
        <PaneContainer>
          <Allotment>
            <Allotment.Pane minSize={300}>
              <EditorPane>
                <PaneHeader>Editor - {selectedFile?.id || 'No file selected'}</PaneHeader>
                <Editor
                  height="100%"
                  language="markdown"
                  theme="vs-dark"
                  value={content}
                  onChange={setContent}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </EditorPane>
            </Allotment.Pane>
            
            <Allotment.Pane minSize={300}>
              <EditorPane>
                <PaneHeader>Preview</PaneHeader>
                <PreviewPane>
                  <PreviewContent>
                    <ReactMarkdown>{getPreviewContent()}</ReactMarkdown>
                  </PreviewContent>
                </PreviewPane>
              </EditorPane>
            </Allotment.Pane>
          </Allotment>
        </PaneContainer>
        
        {showNewFileModal && (
          <>
            <ModalOverlay onClick={() => setShowNewFileModal(false)} />
            <NewFileModal>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Create New File</h3>
              <ModalInput
                type="text"
                placeholder="Enter filename (e.g., my-new-post)"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewFile()}
              />
              <ModalButtons>
                <Button onClick={() => setShowNewFileModal(false)}>Cancel</Button>
                <Button primary onClick={handleNewFile}>Create</Button>
              </ModalButtons>
            </NewFileModal>
          </>
        )}
      </EditorContainer>
    </Layout>
  );
};

export default EditorPage;