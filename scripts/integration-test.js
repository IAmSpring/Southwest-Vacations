#!/usr/bin/env node

/**
 * Integration test script that:
 * 1. Ensures the backend is running
 * 2. Sets up test data (users and booking scenarios)
 * 3. Runs Cypress tests to verify the end-to-end user journey
 */

import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Ensure data directory exists
const dataDir = path.join(rootDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to run a command and return a promise
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command} ${args.join(' ')}`);
    
    const childProcess = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
      ...options
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

// Main function
async function main() {
  console.log('🚀 Starting integration tests...');
  
  try {
    // Step 1: Ensure we have all necessary images
    console.log('\n📷 Ensuring all images are downloaded...');
    await runCommand('npm', ['run', 'download-images']);
    
    // Step 2: Create test users
    console.log('\n👤 Creating test users...');
    await runCommand('npm', ['run', 'create-test-users']);
    
    // Step 3: Create test booking scenarios
    console.log('\n🏨 Setting up test booking scenarios...');
    await runCommand('npm', ['run', 'create-test-scenarios']);
    
    // Step 4: Start the backend server in the background
    console.log('\n🖥️ Starting backend server...');
    const backendProcess = spawn('npm', ['run', 'dev:backend'], {
      cwd: rootDir,
      shell: true,
      stdio: 'inherit',
      detached: true
    });
    
    // Give the backend time to start
    console.log('⏳ Waiting for backend to initialize...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 5: Run the Cypress tests
    console.log('\n🧪 Running end-to-end tests...');
    try {
      await runCommand('npm', ['run', 'cypress:run']);
      console.log('\n✅ All tests passed successfully!');
    } catch (error) {
      console.error('\n❌ Some tests failed:', error.message);
      process.exit(1);
    } finally {
      // Cleanup: Kill the backend process
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${backendProcess.pid} /F /T`);
      } else {
        process.kill(-backendProcess.pid);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Integration test setup failed:', error.message);
    process.exit(1);
  }
}

main(); 