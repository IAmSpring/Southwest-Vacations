// Simple script to run Cypress tests
import { execSync, spawn } from 'child_process';

try {
  console.log('Starting development server...');
  
  // Start the development server
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe', // Capture output
    detached: true // Run in background
  });
  
  // Give the server time to start
  console.log('Waiting for server to start...');
  execSync('sleep 10'); // Wait 10 seconds
  
  console.log('Running Southwest Vacations Cypress tests...');
  
  try {
    // Run the Cypress tests in headless mode with electron (doesn't open UI)
    execSync('npx cypress run --spec "cypress/e2e/booking-end-to-end.cy.ts" --headless --browser electron', {
      stdio: 'inherit' // This will show the output in real-time
    });
    
    console.log('Tests completed successfully!');
  } catch (error) {
    console.error('Error running tests:', error.message);
  } finally {
    // Cleanup: kill the development server
    console.log('Shutting down development server...');
    if (server.pid) {
      process.kill(-server.pid, 'SIGINT');
    }
  }
} catch (error) {
  console.error('Setup error:', error.message);
  process.exit(1);
} 