// Simple login test for Southwest Vacations
describe('Southwest Vacations Login', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should allow user to login with credentials', () => {
    // Visit the home page
    cy.visit('/');

    // Navigate to login page
    cy.contains('a', 'Login').click();

    // Confirm we're on the login page
    cy.url().should('include', '/login');

    // Fill in the login form
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('Password123');

    // Submit the form
    cy.contains('button', 'Login').click();

    // Verify login was successful by checking localStorage
    cy.window().its('localStorage.token').should('exist');

    // Navigate back to home page
    cy.visit('/');

    // Verify we see the main content
    cy.contains('Southwest Vacations').should('be.visible');

    // Look for some element that's only visible when logged in
    cy.contains('a', 'Book a Trip').should('be.visible');
  });

  it('should allow login with Test User button', () => {
    // Visit the login page directly
    cy.visit('/#/login');

    // Use the Test User login button if it exists
    cy.contains('button', 'Test User Login').click();

    // Verify login was successful
    cy.window().its('localStorage.token').should('exist');

    // Navigate to home page
    cy.visit('/');

    // Verify we see the main content
    cy.contains('Southwest Vacations').should('be.visible');
  });
});
