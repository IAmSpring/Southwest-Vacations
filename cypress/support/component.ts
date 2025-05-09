// ***********************************************************
// This is a support file for Cypress component testing
// See: https://on.cypress.io/component-testing
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react';

// Add the mount command
Cypress.Commands.add('mount', mount);

// This handles uncaught exceptions from the application
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
}); 