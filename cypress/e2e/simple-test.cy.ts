/// <reference types="cypress" />

describe('Basic App Test', () => {
  it('should load the homepage', () => {
    // Visit the homepage
    cy.visit('/', { timeout: 30000 });

    // Verify basic elements are present
    cy.get('body').should('be.visible');
    cy.log('Homepage loaded successfully');
  });
});
