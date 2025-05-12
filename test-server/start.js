#!/usr/bin/env node

/**
 * This script starts the test visualization server which integrates
 * Cypress and Playwright tests with the web interface.
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SERVER_SCRIPT = path.join(__dirname, 'server.js');
const SERVER_PORT = process.env.PORT || 3001;

console.log('Starting Test Visualization Server...');
console.log(`Server Port: ${SERVER_PORT}`);
console.log('----------------------------------');

// Start the server
const serverProcess = exec(`node "${SERVER_SCRIPT}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting server: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Server errors: ${stderr}`);
  }
});

// Forward server output to console
serverProcess.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

serverProcess.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  serverProcess.kill();
  process.exit(0);
});

// Show startup message
console.log('\n🚀 Test server is starting...');
console.log(`👉 Once running, navigate to http://localhost:${SERVER_PORT} in your browser to verify it's working`);
console.log('💻 While the server is running, you can view test results in the Test Visualization page in the app');
console.log('📝 Press Ctrl+C to stop the server\n'); 