// Cypress commands file
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with the test user
     * @example cy.login()
     */
    login(email?: string, password?: string): Chainable<Element>;

    /**
     * Robust login command that handles UI login
     * @example cy.robustLogin()
     */
    robustLogin(email?: string, password?: string): Chainable<Element>;

    /**
     * Quick login using the Test User button
     * @example cy.quickLogin()
     */
    quickLogin(): Chainable<Element>;
  }
}

// Add custom login command that mocks the API call
Cypress.Commands.add('login', (email = 'test@example.com', password = 'Password123') => {
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
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.contains('button', 'Login').click();

  // Wait for the login response
  cy.wait('@loginUser');

  // Store the token in localStorage to simulate authenticated state
  cy.window().then(win => {
    win.localStorage.setItem('token', 'fake-jwt-token');
  });
});

// Robust UI login command that handles potential detached elements
Cypress.Commands.add('robustLogin', (email = 'test@example.com', password = 'Password123') => {
  // Start from home page
  cy.visit('/');

  // Wait for page to load completely
  cy.contains('Southwest Vacations', { timeout: 10000 }).should('be.visible');

  // Navigate to login page with retry
  cy.contains('a', 'Login').should('be.visible').as('loginLink');
  cy.get('@loginLink').click({ force: true });

  // Ensure we're on the login page
  cy.url().should('include', '/login');
  cy.wait(1000); // Wait for page transition

  // Fill login form
  cy.get('#email').should('be.visible').as('emailField');
  cy.get('@emailField').type(email, { force: true });

  cy.get('#password').should('be.visible').as('passwordField');
  cy.get('@passwordField').type(password, { force: true });

  // Submit form
  cy.contains('button', 'Login').should('be.visible').as('loginButton');
  cy.get('@loginButton').click({ force: true });

  // Verify login was successful by checking local storage
  cy.wait(2000); // Wait for login to complete
  cy.window().its('localStorage.token').should('exist');

  // Force navigation to the home page after login
  cy.visit('/');

  // Wait for navigation back to main page and verify we're not on login page
  cy.contains('Southwest Vacations', { timeout: 10000 }).should('be.visible');
});

// Quick login using the Test User button
Cypress.Commands.add('quickLogin', () => {
  // Start from home page
  cy.visit('/');

  // Wait for page to load completely
  cy.contains('Southwest Vacations', { timeout: 10000 }).should('be.visible');

  // Navigate to login page
  cy.contains('a', 'Login').should('be.visible').as('loginLink');
  cy.get('@loginLink').click({ force: true });

  // Ensure we're on the login page
  cy.url().should('include', '/login');
  cy.wait(1000); // Wait for page transition

  // Use test user login button
  cy.contains('button', 'Test User Login').should('be.visible').as('testUserButton');
  cy.get('@testUserButton').click({ force: true });

  // Verify login was successful by checking local storage
  cy.wait(2000); // Wait for login to complete
  cy.window().its('localStorage.token').should('exist');

  // Force navigation to the home page after login
  cy.visit('/');

  // Wait for navigation back to main page and verify we're not on login page
  cy.contains('Southwest Vacations', { timeout: 10000 }).should('be.visible');
});
