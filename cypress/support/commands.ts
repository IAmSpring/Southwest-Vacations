// Cypress commands file
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with the test user
     * @example cy.login()
     */
    login(email?: string, password?: string): Chainable<Element>;
  }
}

// Add custom login command
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  // Mock the login API call
  cy.intercept('POST', '/api/users/login', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token',
      user: {
        id: 'test123',
        name: 'Test User',
        email: email,
      },
    },
  }).as('loginUser');

  // Visit the login page
  cy.visit('/login');

  // Fill in the login form and submit
  cy.get('[data-testid="login-email"]').type(email);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-submit"]').click();

  // Wait for the login response
  cy.wait('@loginUser');

  // Store the token in localStorage to simulate authenticated state
  cy.window().then(win => {
    win.localStorage.setItem('token', 'fake-jwt-token');
  });
});
