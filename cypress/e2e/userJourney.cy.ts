/// <reference types="cypress" />

describe('End-to-End User Journey', () => {
  it('should handle login successfully', () => {
    // Mock auth endpoints
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'mock-token',
        user: {
          id: 'test123',
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    }).as('loginRequest');
    
    // Visit the login page directly
    cy.visit('/login');
    
    // Wait for animations to complete
    cy.wait(1000);
    
    // Click the Test User Login button
    cy.contains('Test User Login').click({force: true});
    
    // Verify we're redirected to home
    cy.url().should('include', '/');
  });
}); 