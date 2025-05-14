/// <reference types="cypress" />

describe('Employee Training and Certification Process', () => {
  const TEST_EMPLOYEE = {
    email: 'employee@southwestvacations.com',
    password: 'password123',
    name: 'Employee User',
    employeeId: 'EMP12345',
  };

  beforeEach(() => {
    // Reset cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Set up employee authentication via localStorage directly instead of API mocking
    cy.window().then(win => {
      win.localStorage.setItem('auth_token', 'test-token');
      win.localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'emp123',
          name: TEST_EMPLOYEE.name,
          email: TEST_EMPLOYEE.email,
          role: 'admin', // Set role to admin to access all features
          employeeId: TEST_EMPLOYEE.employeeId,
        })
      );
    });

    // Visit the training portal page directly
    cy.visit('/#/training');
  });

  it('allows employee to view available training modules', () => {
    // Verify the training portal title is displayed
    cy.get('h1').should('contain', 'Employee Training Portal');

    // Verify the module list is visible
    cy.get('.module-list').should('be.visible');

    // Verify that all expected modules are displayed
    cy.get('[data-testid="training-module-module-1"]').should('be.visible');
    cy.get('[data-testid="training-module-module-2"]').should('be.visible');
    cy.get('[data-testid="training-module-module-3"]').should('be.visible');
    cy.get('[data-testid="training-module-module-4"]').should('be.visible');
    cy.get('[data-testid="training-module-module-5"]').should('be.visible');

    // Check content of first module
    cy.get('[data-testid="training-module-module-1"]').should('contain', 'Customer Service Basics');
    cy.get('[data-testid="training-module-module-1"]').should('contain', 'Learn the fundamentals');

    // Check that completed module shows correct status
    cy.get('[data-testid="training-module-module-1"]').should('contain', '100% Complete');
    cy.get('[data-testid="training-module-module-1"]').should('contain', 'Completed');

    // Check that in-progress module shows correct status
    cy.get('[data-testid="training-module-module-2"]').should('contain', '60% Complete');
    cy.get('[data-testid="training-module-module-2"]').should('contain', 'In Progress');
  });

  it('allows employee to complete a training module', () => {
    // Start a module that hasn't been started yet
    cy.get('[data-testid="start-module-module-3"]').click();

    // Verify we're in the module content view
    cy.get('h2').should('contain', 'Travel Package Upselling');

    // Complete the module
    cy.get('[data-testid="complete-module-module-3"]').click();

    // Verify we're back to the module list
    cy.get('.module-list').should('be.visible');

    // Check that the module now shows completed status
    cy.get('[data-testid="training-module-module-3"]').should('contain', '100% Complete');
    cy.get('[data-testid="training-module-module-3"]').should('contain', 'Certified on');
  });

  it('allows employee to continue an in-progress module', () => {
    // Continue an in-progress module
    cy.get('[data-testid="continue-module-module-2"]').click();

    // Verify we're in the module content view
    cy.get('h2').should('contain', 'Booking System Training');

    // Complete the module
    cy.get('[data-testid="complete-module-module-2"]').click();

    // Verify the module now shows completed status
    cy.get('[data-testid="training-module-module-2"]').should('contain', '100% Complete');
    cy.get('[data-testid="training-module-module-2"]').should('contain', 'Certified on');
  });

  it('allows admin to assign training to employees', () => {
    // Verify admin controls are visible
    cy.get('.admin-controls').should('be.visible');

    // Click the assign training button
    cy.get('[data-testid="assign-training-btn"]').click();

    // Verify the assignment modal is displayed
    cy.contains('Assign Training Modules').should('be.visible');

    // Select employees
    cy.get('[data-testid="employee-checkbox-1"]').check();
    cy.get('[data-testid="employee-checkbox-2"]').check();

    // Select modules
    cy.get('[data-testid="module-checkbox-module-1"]').check();
    cy.get('[data-testid="module-checkbox-module-2"]').check();

    // Confirm assignment
    cy.get('[data-testid="confirm-assign-btn"]').click();

    // Verify modal is closed
    cy.contains('Assign Training Modules').should('not.be.visible');
  });

  it('allows admin to generate certification reports', () => {
    // Click the generate report button
    cy.window().then(win => {
      // Stub the alert function to prevent it from blocking the test
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('[data-testid="generate-report-btn"]').click();

    // Verify alert was called with correct message
    cy.get('@alertStub').should(
      'have.been.calledWith',
      'Certification report generated successfully.'
    );
  });
});
