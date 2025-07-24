#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Gatsby build process...\n');

try {
  // Step 1: Clean previous build
  console.log('🧹 Cleaning previous build...');
  execSync('npm run clean', { stdio: 'inherit' });
  
  // Step 2: Start API server in background
  console.log('🔌 Starting API server...');
  const apiProcess = execSync('cd api-server && npm start &', { stdio: 'pipe' });
  
  // Wait a moment for API to start
  console.log('⏳ Waiting for API server to start...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Step 3: Build Gatsby site
  console.log('🏗️  Building Gatsby site...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 4: Generate build summary
  console.log('📊 Generating build summary...');
  const publicDir = path.join(__dirname, 'public');
  const stats = fs.statSync(publicDir);
  const files = getAllFiles(publicDir);
  
  const buildSummary = {
    buildTime: new Date().toISOString(),
    totalFiles: files.length,
    buildSize: calculateDirectorySize(publicDir),
    pages: files.filter(f => f.endsWith('.html')).length,
    assets: files.filter(f => f.endsWith('.js') || f.endsWith('.css')).length
  };
  
  fs.writeFileSync(
    path.join(publicDir, 'build-info.json'), 
    JSON.stringify(buildSummary, null, 2)
  );
  
  console.log('\n✅ Build completed successfully!');
  console.log(`📁 Build output: ${publicDir}`);
  console.log(`📄 Total files: ${buildSummary.totalFiles}`);
  console.log(`📊 Build size: ${formatBytes(buildSummary.buildSize)}`);
  console.log(`🌐 Pages generated: ${buildSummary.pages}`);
  console.log('\n🎯 Ready for deployment!');
  console.log('   Deploy the contents of the public/ directory to your hosting provider.');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function calculateDirectorySize(dir) {
  let size = 0;
  const files = getAllFiles(dir);
  for (const file of files) {
    size += fs.statSync(file).size;
  }
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}