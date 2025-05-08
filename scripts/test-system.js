#!/usr/bin/env node

// This script runs the system tests from the command line
// It can be used to verify the application is properly set up

const { exec } = require('child_process');
const http = require('http');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Configuration
const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:5174'; // Adjusted for the port conflict mentioned

// Text formatting helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper to print formatted messages
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}=== ${msg} ===${colors.reset}\n`)
};

// Check if a URL is reachable
async function isUrlReachable(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve(true);
      } else {
        resolve(false);
      }
      res.resume(); // Consume response data to free up memory
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Check if processes are running on specific ports
async function checkServices() {
  log.title('Checking Services');

  // Check backend
  const backendRunning = await isUrlReachable(`${BACKEND_URL}/health`);
  if (backendRunning) {
    log.success(`Backend is running at ${BACKEND_URL}`);
  } else {
    log.error(`Backend is not running at ${BACKEND_URL}`);
    log.info(`Try starting the backend with: npm run backend`);
    return false;
  }

  // Check frontend 
  const frontendRunning = await isUrlReachable(FRONTEND_URL);
  if (frontendRunning) {
    log.success(`Frontend is running at ${FRONTEND_URL}`);
  } else {
    log.error(`Frontend is not running at ${FRONTEND_URL}`);
    log.info(`Try starting the frontend with: npm run dev`);
    return false;
  }

  return true;
}

// Run system test using Puppeteer or similar tool
async function runSystemTests() {
  log.title('Running System Tests');
  log.info('Open your browser and navigate to:');
  log.info(`${FRONTEND_URL}/system-check`);
  log.info('to run the system tests in the UI');
  
  // In a real implementation, we would use Puppeteer or similar
  // to automate these tests from the command line
  log.warning('Automated command-line testing needs additional libraries.');
  log.info('For now, please use the web interface to run tests.');
  
  return true;
}

// Show help instructions
function showHelp() {
  console.log(`
${colors.bright}Southwest Vacations System Test${colors.reset}

This script checks if the application is properly set up and working.

Usage:
  node ${path.basename(__filename)} [options]

Options:
  --help, -h       Show this help
  --check, -c      Only check if services are running
  --view, -v       View the system check in browser
  
  `);
}

// Open the system check in browser
function openInBrowser() {
  const url = `${FRONTEND_URL}/system-check`;
  let command;
  
  switch (process.platform) {
    case 'darwin': // macOS
      command = `open "${url}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${url}"`;
      break;
    default: // Linux and others
      command = `xdg-open "${url}"`;
      break;
  }
  
  exec(command, (error) => {
    if (error) {
      log.error(`Failed to open browser: ${error}`);
      log.info(`Please manually navigate to: ${url}`);
    } else {
      log.success(`Opened system check in browser: ${url}`);
    }
  });
}

// Main function
async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--view') || args.includes('-v')) {
    openInBrowser();
    return;
  }
  
  console.log(`
${colors.bright}${colors.cyan}Southwest Vacations System Test${colors.reset}
This script will check if your application is properly set up and working.
  `);
  
  // Check if services are running
  const servicesRunning = await checkServices();
  
  if (!servicesRunning) {
    log.error('Some services are not running. Please start them first.');
    return;
  }
  
  // If only checking services
  if (args.includes('--check') || args.includes('-c')) {
    log.success('All services are running!');
    return;
  }
  
  // Ask if the user wants to run system tests
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question(`\nDo you want to run system tests? (y/n) `, async (answer) => {
    if (answer.toLowerCase() === 'y') {
      await runSystemTests();
      
      rl.question(`\nDo you want to open the system check in browser? (y/n) `, (browserAnswer) => {
        if (browserAnswer.toLowerCase() === 'y') {
          openInBrowser();
        }
        rl.close();
      });
    } else {
      rl.close();
    }
  });
}

// Run the script
main().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
}); 