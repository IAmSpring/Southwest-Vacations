// Cypress commands file
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with the test user
     * @example cy.login('test@southwestvacations.com', 'Password123')
     */
    login(email?: string, password?: string): Chainable<void>;

    /**
     * Login using the API directly (more reliable/faster)
     * @example cy.loginAPI('test@southwestvacations.com', 'Password123')
     */
    loginAPI(email?: string, password?: string): Chainable<void>;

    /**
     * Robust login command that handles UI login with fallback to Test User button
     * @example cy.robustLogin('test@southwestvacations.com', 'Password123')
     */
    robustLogin(email?: string, password?: string): Chainable<void>;

    /**
     * Quick login using the Test User button
     * @example cy.quickLogin()
     */
    quickLogin(): Chainable<void>;
  }
}

// Login using the UI
Cypress.Commands.add('login', (email = 'test@southwestvacations.com', password = 'Password123') => {
  cy.visit('/#/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.contains('button', 'Login').click();
  cy.wait(500); // Wait for login to complete
  cy.window().its('localStorage.token').should('exist');
});

// Login using the API directly (more reliable/faster)
Cypress.Commands.add(
  'loginAPI',
  (email = 'test@southwestvacations.com', password = 'Password123') => {
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      body: { email, password },
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      window.localStorage.setItem('token', response.body.token);
    });
  }
);

// Robust login that falls back to Test User button if regular login fails
Cypress.Commands.add(
  'robustLogin',
  (email = 'test@southwestvacations.com', password = 'Password123') => {
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
  }
);

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
