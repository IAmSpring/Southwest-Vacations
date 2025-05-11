/* eslint-env node */
// This script runs Playwright tests for the key features
// - Multi-passenger booking flow
// - Employee training certification process
// - Multi-location trip creation
// - Search filters functionality

import { spawn } from 'child_process';
import path from 'path';

console.log('Starting Southwest Vacations test suite...');

// Define the specific tests to run
const specificTests = [
  'tests/login.spec.ts',
  'tests/multi-passenger-booking.spec.ts',
  'tests/training-certification.spec.ts',
  'tests/multi-location-booking.spec.ts',
  'tests/search-filters.spec.ts'
];

// Start the development server
console.log('Starting the development server...');
const serverProcess = spawn('npm', ['run', 'dev'], {
  stdio: ['ignore', 'pipe', 'inherit'],
  shell: true,
  windowsHide: true
});

// Flag to track if server is ready
let serverReady = false;

// Listen for server output to detect when it's ready
serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[SERVER] ${output}`);
  
  if (output.includes('Local:') && output.includes('http://localhost')) {
    serverReady = true;
    console.log('Development server is ready!');
    
    // Run the Playwright tests when server is ready
    runTests();
  }
});

// Function to run the tests
function runTests() {
  console.log('Running Playwright tests...');
  
  // Run Playwright tests on the specific test files
  const playwrightProcess = spawn('npx', ['playwright', 'test', ...specificTests], {
    stdio: 'inherit',
    shell: true,
    windowsHide: true
  });
  
  playwrightProcess.on('close', (code) => {
    // After tests are complete, shutdown the server
    console.log(`Playwright tests completed with exit code: ${code}`);
    serverProcess.kill();
    process.exit(code);
  });
}

// Set a timeout if server never becomes ready
setTimeout(() => {
  if (!serverReady) {
    console.error('Server failed to start within timeout period');
    serverProcess.kill();
    process.exit(1);
  }
}, 60000); // 60 second timeout

// Handle termination
process.on('SIGINT', () => {
  console.log('Shutting down tests and server...');
  serverProcess.kill();
  process.exit(0);
}); 