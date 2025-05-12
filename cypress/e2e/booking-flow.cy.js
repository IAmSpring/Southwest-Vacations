// Cypress test for Southwest Vacations booking flow

describe('Southwest Vacations Booking Flow', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('http://localhost:5173/');
    
    // Ensure the backend is running by checking the page loads
    cy.contains('Southwest Vacations').should('be.visible');
  });

  it('should allow a logged-in user to complete the booking process', () => {
    // First login
    cy.log('Logging in as test user');
    cy.get('a').contains('Login').click();
    cy.url().should('include', '/login');
    
    // Use quick login button for test user
    cy.get('button').contains('Test User Login').click();
    
    // Wait for login to complete and verify
    cy.wait(1000);
    cy.window().its('localStorage.token').should('exist');
    cy.log('Login successful');
    
    // Navigate to booking page
    cy.log('Navigating to booking page');
    cy.get('a[href="#/book"]').click();
    cy.url().should('include', '/book');
    
    // Fill the booking form
    cy.log('Filling booking form');
    
    // Select One Way trip
    cy.get('input[value="One Way"]').check();
    
    // Set departure date (1 month from now)
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    const formattedDate = futureDate.toISOString().split('T')[0];
    
    cy.get('input[type="date"]').type(formattedDate);
    
    // Submit the booking
    cy.log('Submitting booking');
    cy.get('button').contains('Book Now').click();
    
    // Verify booking was successful
    cy.wait(3000); // Wait for potential redirects/loading
    
    // Check for success indicators
    cy.log('Verifying booking success');
    cy.get('body').then(($body) => {
      const text = $body.text().toLowerCase();
      const hasSuccessIndicator = [
        'booking confirmed',
        'confirmation',
        'thank you',
        'successful',
        'booked',
        'reservation',
        'itinerary'
      ].some(indicator => text.includes(indicator.toLowerCase()));
      
      expect(hasSuccessIndicator).to.be.true;
    });
    
    // Additional verification - depending on app behavior
    // Could be a confirmation number, URL check, etc.
    cy.log('Booking flow test completed successfully');
  });

  it('should validate required fields in the booking form', () => {
    // Login first
    cy.log('Logging in as test user');
    cy.get('a').contains('Login').click();
    cy.get('button').contains('Test User Login').click();
    cy.wait(1000);
    
    // Navigate to booking page
    cy.get('a[href="#/book"]').click();
    cy.url().should('include', '/book');
    
    // Attempt to submit without filling required fields
    cy.get('button').contains('Book Now').click();
    
    // Check for validation messages
    cy.log('Verifying form validation');
    cy.get('input:invalid').should('exist');
    
    // Form should not be submitted successfully
    cy.url().should('include', '/book');
  });
}); 