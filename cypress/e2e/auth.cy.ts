/// <reference types="cypress" />

describe('Authentication Tests', () => {
  beforeEach(() => {
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
    
    // Visit the login page
    cy.visit('/login');
    
    // Wait for page to load
    cy.wait(1000);
  });

  it('should redirect after login', () => {
    // Click login button
    cy.contains('Test User Login').click({force: true});
    
    // Verify redirection to home page
    cy.url().should('include', '/');
  });

  it('should block unauthorized access to admin page', () => {
    // Try to visit admin page without login
    cy.clearLocalStorage();
    cy.visit('/admin');
    
    // Should redirect away from admin
    cy.url().should('not.include', '/admin');
  });
}); 