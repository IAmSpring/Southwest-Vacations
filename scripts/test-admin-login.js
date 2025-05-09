#!/usr/bin/env node

/**
 * Test script for admin login functionality:
 * 1. Starts the backend server
 * 2. Starts the frontend server
 * 3. Runs Cypress tests specifically for admin login and dashboard
 */

import { spawn, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
  console.log('🚀 Starting admin login tests...');
  
  // Store processes to be killed at the end
  const processes = [];
  
  try {
    // Step 1: Ensure we have an admin user
    console.log('\n👤 Creating test users...');
    await runCommand('npm', ['run', 'create-test-users']);
    
    // Step 2: Start the backend server in the background
    console.log('\n🖥️ Starting backend server...');
    const backendProcess = spawn('npm', ['run', 'dev:backend'], {
      cwd: rootDir,
      shell: true,
      stdio: 'inherit',
      detached: true
    });
    processes.push(backendProcess);
    
    // Step 3: Start the frontend server in the background
    console.log('\n🌐 Starting frontend server...');
    const frontendProcess = spawn('npm', ['run', 'dev:frontend'], {
      cwd: rootDir,
      shell: true,
      stdio: 'inherit',
      detached: true
    });
    processes.push(frontendProcess);
    
    // Give the servers time to start
    console.log('⏳ Waiting for servers to initialize...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 4: Run the Cypress tests for auth functionality
    console.log('\n🧪 Running admin login tests...');
    try {
      await runCommand('npx', ['cypress', 'run', '--spec', 'cypress/e2e/auth.cy.ts']);
      console.log('\n✅ All admin login tests passed successfully!');
    } catch (error) {
      console.error('\n❌ Some tests failed:', error.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Test setup failed:', error.message);
    process.exit(1);
  } finally {
    // Cleanup: Kill all processes
    console.log('\n🧹 Cleaning up processes...');
    processes.forEach(process => {
      try {
        if (process.pid) {
          if (process.platform === 'win32') {
            execSync(`taskkill /pid ${process.pid} /F /T`);
          } else {
            process.kill(-process.pid);
          }
        }
      } catch (error) {
        console.log(`Warning: Could not kill process ${process.pid}: ${error.message}`);
      }
    });
  }
}

main(); 