#!/usr/bin/env node

import { execSync } from 'child_process';
import { createSpinner } from 'nanospinner';
import chalk from 'chalk';

console.log(chalk.blue('===== Southwest Vacations System Startup Tests ====='));

const tests = [
  {
    name: 'Backend Connectivity',
    command: 'node scripts/test-system.js',
    spinner: null
  },
  {
    name: 'Admin Login',
    command: 'node scripts/test-admin-login.js',
    spinner: null
  },
  {
    name: 'AI Assistant Functionality',
    command: 'node --loader ts-node/esm scripts/test-ai-assistant.js',
    spinner: null
  }
];

async function runTests() {
  let allPassed = true;
  
  for (const test of tests) {
    test.spinner = createSpinner(`Running ${test.name} test...`).start();
    
    try {
      execSync(test.command, { stdio: 'pipe' });
      test.spinner.success({ text: `${test.name} test passed` });
    } catch (error) {
      test.spinner.error({ text: `${test.name} test failed` });
      console.error(chalk.red(`Error: ${error.message}`));
      
      // Show stdout and stderr for debugging
      if (error.stdout) {
        console.log(chalk.yellow('\nStandard output:'));
        console.log(error.stdout.toString());
      }
      
      if (error.stderr) {
        console.log(chalk.yellow('\nStandard error:'));
        console.log(error.stderr.toString());
      }
      
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log(chalk.green('\n✅ All system tests passed. System ready for use.'));
  } else {
    console.log(chalk.red('\n❌ Some tests failed. Please check the logs above for details.'));
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error(chalk.red(`Unexpected error: ${error.message}`));
  process.exit(1);
}); 