/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Cypress.Commands.add('login', (email, password) => { ... })

// Cypress.Commands.add('dragAndDrop', (source, destination) => { ... })

// Add custom command to check if button exists and is visible
Cypress.Commands.add('assertButtonVisible', (selector) => {
  cy.get(selector)
    .should('be.visible')
    .and('not.be.disabled');
});

export {}; 