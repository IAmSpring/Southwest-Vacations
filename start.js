#!/usr/bin/env node

/**
 * Southwest Vacations Test Environment Launcher
 * 
 * This script starts all the necessary services for the test visualization environment:
 * 1. Frontend dev server
 * 2. Backend API server
 * 3. Test visualization server
 */

const { spawn } = require('child_process');
const readline = require('readline');

console.log('\n🚀 Southwest Vacations Test Environment');
console.log('========================================\n');

// Process management
const processes = [];
let shutdownInProgress = false;

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Clear terminal and move cursor to position
function clearTerminal() {
  process.stdout.write('\x1Bc');
}

// Log with timestamp and service name
function log(service, message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  let color;
  
  switch (type) {
    case 'error':
      color = colors.red;
      break;
    case 'warning':
      color = colors.yellow;
      break;
    case 'success':
      color = colors.green;
      break;
    default:
      color = colors.reset;
  }
  
  let serviceColor;
  switch (service) {
    case 'FRONTEND':
      serviceColor = colors.blue;
      break;
    case 'BACKEND':
      serviceColor = colors.green;
      break;
    case 'TEST-VIZ':
      serviceColor = colors.yellow;
      break;
    case 'SYSTEM':
      serviceColor = colors.magenta;
      break;
    default:
      serviceColor = colors.reset;
  }
  
  console.log(`[${timestamp}] ${serviceColor}${service}${colors.reset}: ${color}${message}${colors.reset}`);
}

// Start all services
function startServices() {
  clearTerminal();
  log('SYSTEM', 'Starting all services...', 'info');
  
  // Start the combined dev server (frontend + backend + test-viz)
  const devProcess = spawn('npm', ['run', 'dev:all'], { stdio: 'pipe', shell: true });
  processes.push(devProcess);
  
  // Handle frontend process output
  devProcess.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.includes('FRONTEND')) {
        log('FRONTEND', line.replace(/^\[FRONTEND\]\s*/, ''));
      } else if (line.includes('BACKEND')) {
        log('BACKEND', line.replace(/^\[BACKEND\]\s*/, ''));
      } else if (line.includes('TEST-VIZ')) {
        log('TEST-VIZ', line.replace(/^\[TEST-VIZ\]\s*/, ''));
      } else {
        // Default to SYSTEM for untagged lines
        log('SYSTEM', line);
      }
    });
  });
  
  // Handle errors
  devProcess.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.includes('FRONTEND')) {
        log('FRONTEND', line.replace(/^\[FRONTEND\]\s*/, ''), 'error');
      } else if (line.includes('BACKEND')) {
        log('BACKEND', line.replace(/^\[BACKEND\]\s*/, ''), 'error');
      } else if (line.includes('TEST-VIZ')) {
        log('TEST-VIZ', line.replace(/^\[TEST-VIZ\]\s*/, ''), 'error');
      } else {
        // Default to SYSTEM for untagged errors
        log('SYSTEM', line, 'error');
      }
    });
  });
  
  // Handle process exit
  devProcess.on('close', (code) => {
    if (!shutdownInProgress) {
      log('SYSTEM', `Process exited with code ${code}`, code === 0 ? 'success' : 'error');
      shutdownServices();
    }
  });
  
  log('SYSTEM', 'All services started', 'success');
  log('SYSTEM', 'Open http://localhost:5173 in your browser to view the application', 'info');
  log('SYSTEM', 'Press Ctrl+C to stop all services', 'info');
}

// Shutdown all services gracefully
function shutdownServices() {
  if (shutdownInProgress) return;
  shutdownInProgress = true;
  
  log('SYSTEM', 'Shutting down all services...', 'warning');
  
  // Kill all spawned processes
  processes.forEach(process => {
    try {
      process.kill();
    } catch (e) {
      // Ignore errors during shutdown
    }
  });
  
  log('SYSTEM', 'All services stopped', 'success');
  process.exit(0);
}

// Handle user interrupt
process.on('SIGINT', () => {
  log('SYSTEM', 'Received interrupt signal', 'warning');
  shutdownServices();
});

// Start everything
startServices(); 