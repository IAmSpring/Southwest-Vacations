/**
 * Script to prepare the project for GitHub Pages deployment
 * This script copies necessary backend files into the dist directory
 * to enable the static demo to work with mock data
 */

const fs = require('fs');
const path = require('path');

console.log('Preparing project for GitHub Pages deployment...');

// Paths
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const mockBackendDir = path.join(rootDir, 'mock-backend');
const mockBackendDataDir = path.join(mockBackendDir, 'data');
const distDataDir = path.join(distDir, 'mock-data');

// Get repository name from environment or use default
const repositoryName = process.env.REPOSITORY_NAME || 'Southwest-Vacations';
const basePath = `/${repositoryName}/`;

// Create necessary directories if they don't exist
if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

if (!fs.existsSync(distDataDir)) {
  fs.mkdirSync(distDataDir, { recursive: true });
  console.log('Created mock-data directory in dist');
}

// Helper function to copy a file
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.basename(src)} -> ${dest}`);
  } catch (error) {
    console.error(`Error copying ${src}: ${error.message}`);
  }
}

// Helper function to copy a directory recursively
function copyDirectory(src, dest) {
  try {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory ${src}: ${error.message}`);
  }
}

// Copy mock-backend data files
if (fs.existsSync(mockBackendDataDir)) {
  copyDirectory(mockBackendDataDir, distDataDir);
} else {
  console.warn('Warning: mock-backend/data directory not found');
}

// Copy seed data
const seedDataFile = path.join(mockBackendDir, 'seedData.json');
if (fs.existsSync(seedDataFile)) {
  copyFile(seedDataFile, path.join(distDataDir, 'seedData.json'));
} else {
  console.warn('Warning: seedData.json not found');
}

// Create a simple API endpoint info file
const apiInfoFile = {
  name: 'Southwest Vacations API (GitHub Pages Static Version)',
  version: '1.0.0',
  description: 'This is a static version of the API for demonstration purposes',
  basePath: basePath,
  endpoints: [
    `${basePath}mock-data/flights.json`,
    `${basePath}mock-data/hotels.json`,
    `${basePath}mock-data/vehicles.json`,
    `${basePath}mock-data/trips.json`,
    `${basePath}mock-data/seedData.json`
  ],
  note: 'This is a static mock API. In a real environment, these would be dynamic endpoints.'
};

fs.writeFileSync(
  path.join(distDir, 'api-info.json'),
  JSON.stringify(apiInfoFile, null, 2),
  'utf8'
);
console.log('Created api-info.json in dist directory');

// Create or update the frontend configuration to use static data
const staticConfigContent = `
// Static config for GitHub Pages deployment
window.API_CONFIG = {
  USE_STATIC_DATA: true,
  BASE_PATH: '${basePath}',
  API_BASE_URL: '${basePath}',
  MOCK_DATA_PATH: '${basePath}mock-data'
};
`;

fs.writeFileSync(
  path.join(distDir, 'static-config.js'),
  staticConfigContent,
  'utf8'
);
console.log('Created static-config.js in dist directory');

// Update index.html to include static config
const indexHtmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Check if the static-config script is already included
  if (!indexHtml.includes('static-config.js')) {
    // Insert the script tag before the closing head tag
    indexHtml = indexHtml.replace(
      '</head>',
      `  <script src="${basePath}static-config.js"></script>\n</head>`
    );
    
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log('Updated index.html to include static-config.js');
  }
} else {
  console.warn('Warning: index.html not found in dist directory');
}

// Create .nojekyll file to disable Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');
console.log('Created .nojekyll file to disable Jekyll processing');

console.log('GitHub Pages preparation complete!'); 