// Cypress test for Southwest Vacations promotions functionality

describe('Southwest Vacations Promotions Flow', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('http://localhost:5173/');
    
    // Ensure the page loads
    cy.contains('Southwest Vacations').should('be.visible');
  });

  it('should allow users to view active promotions', () => {
    // First login as admin user
    cy.log('Logging in as admin user');
    cy.get('a').contains('Login').click();
    cy.url().should('include', '/login');
    
    // Use admin login button
    cy.get('button').contains('Admin Login').click();
    
    // Wait for login to complete and verify
    cy.wait(1000);
    cy.window().its('localStorage.token').should('exist');
    cy.log('Login successful');
    
    // Navigate to promotions page
    cy.log('Navigating to promotions page');
    cy.visit('http://localhost:5173/#/promotions');
    
    // Verify promotions page loads with title
    cy.contains('Promo Codes & Discounts').should('be.visible');
    cy.contains('Current promotional offers').should('be.visible');
    
    // Verify active promotions section exists
    cy.get('button').contains('View Active Promotions').click();
    cy.wait(500);
    
    // At least one promotion should be visible
    cy.get('.promo-card, [data-testid="promo-card"]').should('have.length.at.least', 1);
    
    // Check if SUMMER2023 promotion is displayed
    cy.contains('SUMMER2023').should('be.visible');
    
    cy.log('Active promotions displayed successfully');
  });
  
  it('should allow admin users to create a new promotion', () => {
    // Login as admin
    cy.log('Logging in as admin user');
    cy.get('a').contains('Login').click();
    cy.get('button').contains('Admin Login').click();
    cy.wait(1000);
    
    // Navigate to promotions management
    cy.visit('http://localhost:5173/#/admin/promotions');
    
    // Verify admin promotions page loads
    cy.contains('Promotions Management').should('be.visible');
    
    // Click on create new promotion button
    cy.get('button').contains('Create New Promotion').click();
    
    // Fill out the new promotion form
    const promoCode = `TEST${Date.now().toString().slice(-4)}`;
    
    cy.get('input[name="code"]').type(promoCode);
    cy.get('input[name="description"]').type('Test Promotion');
    cy.get('select[name="discountType"]').select('percentage');
    cy.get('input[name="discountValue"]').type('10');
    
    // Set start and end dates
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    cy.get('input[name="startDate"]').type(formatDate(today));
    cy.get('input[name="endDate"]').type(formatDate(nextMonth));
    
    // Select active status
    cy.get('select[name="status"]').select('active');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.contains('Promotion created successfully').should('be.visible');
    
    // Verify the new promotion appears in the list
    cy.contains(promoCode).should('be.visible');
    
    cy.log('Successfully created new promotion');
  });
  
  it('should allow users to apply a promotion code to a booking', () => {
    // Login as regular user
    cy.log('Logging in as test user');
    cy.get('a').contains('Login').click();
    cy.get('button').contains('Test User Login').click();
    cy.wait(1000);
    
    // Navigate to booking page
    cy.visit('http://localhost:5173/#/book');
    
    // Fill in booking details
    cy.log('Filling booking form');
    
    // Select One Way trip
    cy.get('input[value="One Way"]').check();
    
    // Set departure date (2 weeks from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const formattedDate = futureDate.toISOString().split('T')[0];
    
    cy.get('input[type="date"]').type(formattedDate);
    
    // Expand promo code section if it exists
    cy.get('button, .toggle').contains(/promo|discount|coupon/i).click({ force: true });
    
    // Apply the SUMMER2023 promo code
    cy.get('input[name="promoCode"]').type('SUMMER2023');
    cy.get('button').contains(/apply|submit/i).click();
    
    // Verify the promo code is applied
    cy.contains('Discount applied').should('be.visible');
    cy.contains('15%').should('be.visible');
    
    cy.log('Successfully applied promotion to booking');
  });
}); 