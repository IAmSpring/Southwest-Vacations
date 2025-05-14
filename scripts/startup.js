/**
 * Southwest Vacations Startup Script
 * Cross-platform Node.js implementation of the startup process
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Configuration
const config = {
  frontendPort: 5173,
  backendPort: 4000,
  logDir: path.join(process.cwd(), 'logs'),
  dataDir: path.join(process.cwd(), 'data'),
  testResultsDir: path.join(process.cwd(), 'test-results'),
  backendStartupTimeout: 30000, // 30 seconds
  frontendStartupTimeout: 30000, // 30 seconds
  skipTests: process.argv.includes('--skip-tests'),
  runAllTests: process.argv.includes('--all-tests'),
};

// Create timestamp for log files
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFiles = {
  main: path.join(config.logDir, `startup-${timestamp}.log`),
  backend: path.join(config.logDir, `backend-${timestamp}.log`),
  frontend: path.join(config.logDir, `frontend-${timestamp}.log`),
  test: path.join(config.logDir, `test-${timestamp}.log`),
};

// Ensure log directory exists
if (!fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true });
}

// Create log streams
const mainLogStream = fs.createWriteStream(logFiles.main, { flags: 'a' });

// Logging functions
function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substr(0, 19);
}

function log(level, message, color = colors.reset) {
  const timestamp = getTimestamp();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(`${color}${logMessage}${colors.reset}`);
  mainLogStream.write(`${logMessage}\n`);
}

const logger = {
  info: (message) => log('INFO', message, colors.green),
  warn: (message) => log('WARN', message, colors.yellow),
  error: (message) => log('ERROR', message, colors.red),
  debug: (message) => log('DEBUG', message, colors.cyan),
};

// Function to check if a port is in use
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

// Function to kill a process on a port (platform-specific)
async function killProcessOnPort(port) {
  logger.warn(`Attempting to kill process on port ${port}`);
  
  try {
    if (process.platform === 'win32') {
      execSync(`FOR /F "tokens=5" %a in ('netstat -ano ^| find "LISTENING" ^| find ":${port}"') do taskkill /F /PID %a`);
    } else {
      execSync(`lsof -ti :${port} | xargs kill -9 || true`);
    }
    logger.info(`Successfully killed process on port ${port}`);
  } catch (error) {
    logger.warn(`Failed to kill process on port ${port}: ${error.message}`);
  }
}

// Function to check Node.js and npm installation
function checkNodeAndNpm() {
  logger.info('Checking Node.js and npm installation...');
  
  try {
    const nodeVersion = execSync('node -v').toString().trim().replace('v', '');
    const npmVersion = execSync('npm -v').toString().trim();
    
    logger.info(`Node.js version: ${nodeVersion}`);
    logger.info(`npm version: ${npmVersion}`);
    
    const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
    if (majorVersion < 16) {
      logger.warn('Node.js version is less than 16. Some features may not work correctly.');
    } else {
      logger.info('Node.js version is compatible.');
    }
  } catch (error) {
    logger.error(`Failed to check Node.js and npm: ${error.message}`);
    process.exit(1);
  }
}

// Function to check and install dependencies
function checkDependencies() {
  logger.info('Checking npm dependencies...');
  
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
      logger.info('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    } else {
      logger.info('Dependencies already installed. Checking for updates...');
      execSync('npm outdated --depth=0', { stdio: 'inherit' });
    }
    
    // Check mock-backend dependencies
    const mockBackendDir = path.join(process.cwd(), 'mock-backend');
    const mockBackendPackageJson = path.join(mockBackendDir, 'package.json');
    if (fs.existsSync(mockBackendDir) && fs.existsSync(mockBackendPackageJson)) {
      if (!fs.existsSync(path.join(mockBackendDir, 'node_modules'))) {
        logger.info('Installing mock-backend dependencies...');
        execSync('cd mock-backend && npm install', { stdio: 'inherit' });
      }
    }
  } catch (error) {
    logger.error(`Failed to check dependencies: ${error.message}`);
  }
}

// Function to initialize database
function initializeDatabase() {
  logger.info('Initializing database...');
  
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(config.dataDir)) {
      fs.mkdirSync(config.dataDir, { recursive: true });
    }
    
    // Check if database file exists
    const dbFilePath = path.join(config.dataDir, 'db.json');
    if (!fs.existsSync(dbFilePath)) {
      logger.info('Creating new database file...');
      fs.writeFileSync(dbFilePath, '{}', 'utf8');
      
      // Seed the database if seed file exists
      const seedDataPath = path.join(process.cwd(), 'mock-backend', 'seedData.json');
      if (fs.existsSync(seedDataPath)) {
        logger.info('Seeding database with initial data...');
        fs.copyFileSync(seedDataPath, dbFilePath);
      }
    } else {
      logger.info('Database file already exists.');
    }
  } catch (error) {
    logger.error(`Failed to initialize database: ${error.message}`);
  }
}

// Function to run tests
async function runTests() {
  if (config.skipTests) {
    logger.warn('Skipping tests as requested...');
    return true;
  }
  
  logger.info('Running basic tests...');
  
  try {
    // Create test results directory if it doesn't exist
    if (!fs.existsSync(config.testResultsDir)) {
      fs.mkdirSync(config.testResultsDir, { recursive: true });
    }
    
    // Create test log file
    const testLogStream = fs.createWriteStream(logFiles.test, { flags: 'a' });
    
    // Run system check
    logger.info('Running system check...');
    const systemTestProcess = spawn('node', ['scripts/test-system.js', '--check'], {
      stdio: ['ignore', testLogStream, testLogStream]
    });
    
    const systemTestResult = await new Promise((resolve) => {
      systemTestProcess.on('close', (code) => {
        resolve(code === 0);
      });
    });
    
    if (!systemTestResult) {
      logger.error(`System check failed. Check ${logFiles.test} for details.`);
      return false;
    } else {
      logger.info('System check passed.');
    }
    
    // Run all tests if requested
    if (config.runAllTests) {
      logger.info('Running all tests...');
      const allTestsProcess = spawn('npm', ['test'], {
        stdio: ['ignore', testLogStream, testLogStream]
      });
      
      const allTestsResult = await new Promise((resolve) => {
        allTestsProcess.on('close', (code) => {
          resolve(code === 0);
        });
      });
      
      if (!allTestsResult) {
        logger.error(`Tests failed. Check ${logFiles.test} for details.`);
        return false;
      } else {
        logger.info('All tests passed.');
      }
    }
    
    return true;
  } catch (error) {
    logger.error(`Failed to run tests: ${error.message}`);
    return false;
  }
}

// Function to start the backend server
async function startBackend() {
  logger.info('Starting backend server...');
  
  try {
    // Check if port is in use
    if (await isPortInUse(config.backendPort)) {
      logger.warn(`Port ${config.backendPort} is already in use. Attempting to kill existing process...`);
      await killProcessOnPort(config.backendPort);
      // Wait a moment for the port to be released
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Create log file for backend
    const backendLogStream = fs.createWriteStream(logFiles.backend, { flags: 'a' });
    
    // Start the backend process
    const backendProcess = spawn('node', ['--loader', 'ts-node/esm', 'mock-backend/index.ts'], {
      stdio: ['ignore', backendLogStream, backendLogStream]
    });
    
    // Store backend process ID for cleanup
    global.backendPid = backendProcess.pid;
    logger.info(`Backend started with PID: ${backendProcess.pid}`);
    
    // Wait for backend to start
    logger.info('Waiting for backend to start...');
    let attempts = 0;
    const maxAttempts = config.backendStartupTimeout / 1000;
    
    while (attempts < maxAttempts) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.request({
            hostname: 'localhost',
            port: config.backendPort,
            path: '/health',
            method: 'GET',
            timeout: 1000,
          }, (res) => {
            if (res.statusCode === 200) {
              resolve();
            } else {
              reject(new Error(`Unexpected status code: ${res.statusCode}`));
            }
          });
          
          req.on('error', reject);
          req.end();
        });
        
        logger.info('Backend server started successfully and is healthy.');
        return true;
      } catch (error) {
        attempts++;
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    logger.error(`Backend failed to start after ${maxAttempts} attempts`);
    if (backendProcess.pid) {
      try {
        process.kill(backendProcess.pid);
      } catch (e) {
        // Ignore errors
      }
    }
    return false;
  } catch (error) {
    logger.error(`Failed to start backend: ${error.message}`);
    return false;
  }
}

// Function to start the frontend server
async function startFrontend() {
  logger.info('Starting frontend server...');
  
  try {
    // Check if port is in use
    if (await isPortInUse(config.frontendPort)) {
      logger.warn(`Port ${config.frontendPort} is already in use. Attempting to kill existing process...`);
      await killProcessOnPort(config.frontendPort);
      // Wait a moment for the port to be released
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Create log file for frontend
    const frontendLogStream = fs.createWriteStream(logFiles.frontend, { flags: 'a' });
    
    // Start the frontend process
    const frontendProcess = spawn('npm', ['run', 'dev:frontend'], {
      stdio: ['ignore', frontendLogStream, frontendLogStream]
    });
    
    // Store frontend process ID for cleanup
    global.frontendPid = frontendProcess.pid;
    logger.info(`Frontend started with PID: ${frontendProcess.pid}`);
    
    // Wait for frontend to start
    logger.info('Waiting for frontend to start...');
    let attempts = 0;
    const maxAttempts = config.frontendStartupTimeout / 1000;
    
    while (attempts < maxAttempts) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.request({
            hostname: 'localhost',
            port: config.frontendPort,
            path: '/',
            method: 'GET',
            timeout: 1000,
          }, (res) => {
            if (res.statusCode === 200) {
              resolve();
            } else {
              reject(new Error(`Unexpected status code: ${res.statusCode}`));
            }
          });
          
          req.on('error', reject);
          req.end();
        });
        
        logger.info('Frontend server started successfully.');
        return true;
      } catch (error) {
        attempts++;
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    logger.error(`Frontend failed to start after ${maxAttempts} attempts`);
    if (frontendProcess.pid) {
      try {
        process.kill(frontendProcess.pid);
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Also kill backend if frontend fails
    if (global.backendPid) {
      try {
        process.kill(global.backendPid);
      } catch (e) {
        // Ignore errors
      }
    }
    
    return false;
  } catch (error) {
    logger.error(`Failed to start frontend: ${error.message}`);
    return false;
  }
}

// Function to show application information
function showApplicationInfo() {
  console.log('');
  console.log(`${colors.blue}=============================================`);
  console.log(`    Southwest Vacations Started Successfully`);
  console.log(`==============================================${colors.reset}`);
  console.log(`${colors.green}Frontend:${colors.reset} http://localhost:${config.frontendPort}`);
  console.log(`${colors.green}Backend API:${colors.reset} http://localhost:${config.backendPort}`);
  console.log(`${colors.green}Log files:${colors.reset}`);
  console.log(`  - Main log: ${logFiles.main}`);
  console.log(`  - Backend log: ${logFiles.backend}`);
  console.log(`  - Frontend log: ${logFiles.frontend}`);
  console.log(`  - Test log: ${logFiles.test}`);
  console.log(`${colors.yellow}Press Ctrl+C to stop all servers${colors.reset}`);
  console.log(`${colors.blue}==============================================${colors.reset}`);
  console.log('');
}

// Function for graceful shutdown
function setupGracefulShutdown() {
  process.on('SIGINT', () => {
    console.log('');
    logger.info('Shutting down servers...');
    
    // Kill frontend process
    if (global.frontendPid) {
      try {
        process.kill(global.frontendPid, 'SIGKILL');
      } catch (e) {
        // Ignore errors
      }
    }
    
    // Kill backend process
    if (global.backendPid) {
      try {
        process.kill(global.backendPid, 'SIGKILL');
      } catch (e) {
        // Ignore errors
      }
    }
    
    logger.info('Servers stopped successfully.');
    process.exit(0);
  });
}

// Main function to start the application
async function main() {
  logger.info('Starting Southwest Vacations application...');
  logger.info(`Environment: ${process.env.NODE_ENV || 'Development'}`);
  
  // Setup graceful shutdown
  setupGracefulShutdown();
  
  // Run initialization steps
  checkNodeAndNpm();
  checkDependencies();
  initializeDatabase();
  
  // Run tests
  const testsSucceeded = await runTests();
  if (!testsSucceeded && !config.skipTests) {
    logger.error('Tests failed. Exiting...');
    process.exit(1);
  }
  
  // Start servers
  const backendStarted = await startBackend();
  if (!backendStarted) {
    logger.error('Failed to start backend. Exiting...');
    process.exit(1);
  }
  
  const frontendStarted = await startFrontend();
  if (!frontendStarted) {
    logger.error('Failed to start frontend. Exiting...');
    process.exit(1);
  }
  
  // Show application information
  showApplicationInfo();
  
  // Keep the script running
  process.stdin.resume();
}

// Start the application
main().catch((error) => {
  logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
}); 