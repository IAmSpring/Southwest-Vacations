import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDocsDir = path.join(rootDir, 'public');

// List of documentation files to copy
const docFiles = [
  'README.md',
  'README-testing.md',
  'IMPLEMENTATION_PLAN.md',
  'RECOMMENDATIONS.md',
  'PLAYWRIGHT_TESTS.md',
  'TESTING.md'
];

console.log('Copying documentation files to public directory...');

// Create docs directory if it doesn't exist
if (!fs.existsSync(publicDocsDir)) {
  fs.mkdirSync(publicDocsDir, { recursive: true });
}

// Copy each file
docFiles.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const destPath = path.join(publicDocsDir, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied ${file} to public directory`);
    } else {
      console.error(`❌ Source file not found: ${sourcePath}`);
    }
  } catch (error) {
    console.error(`❌ Error copying ${file}:`, error.message);
  }
});

console.log('Documentation files copied successfully!'); 