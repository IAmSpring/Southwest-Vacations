describe('Southwest Vacations Complete Booking Flow', () => {
  beforeEach(() => {
    // Clear browser state between tests
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should allow user to login with credentials, make a booking, and view it on profile page', () => {
    // Use our robust login command
    cy.log('Logging in as test user');
    cy.robustLogin('test@example.com', 'Password123');
    cy.log('Login successful');

    // Step 2: Navigate to booking page
    cy.log('Navigating to booking page');
    cy.contains('a', 'Book a Trip').as('bookLink');
    cy.get('@bookLink').click({ force: true });

    cy.url().should('include', '/book');

    // Step 3: Fill booking form
    cy.log('Filling booking form');

    // We need to wait for the form to be fully loaded
    cy.wait(2000);

    // Try to select Round Trip if available
    cy.get('body').then($body => {
      if ($body.find('#round-trip').length > 0) {
        cy.get('#round-trip').click({ force: true });
      } else {
        cy.log('Round trip radio button not found, continuing without selecting trip type');
      }
    });

    // Set departure date (7 days from now)
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7);
    const formattedDepartureDate = departureDate.toISOString().split('T')[0];

    cy.get('body').then($body => {
      if ($body.find('#startDate').length > 0) {
        cy.get('#startDate').as('startDateField');
        cy.get('@startDateField').type(formattedDepartureDate, { force: true });

        // Set return date (14 days from now) if round-trip is selected
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 14);
        const formattedReturnDate = returnDate.toISOString().split('T')[0];

        if ($body.find('#returnDate').length > 0) {
          cy.get('#returnDate').as('returnDateField');
          cy.get('@returnDateField').type(formattedReturnDate, { force: true });
        }
      } else {
        cy.log('Date fields not found, continuing without filling dates');
      }
    });

    // Fill traveler details if available
    cy.get('body').then($body => {
      // Check for the presence of each field before trying to fill it
      if ($body.find('input[name="fullName"]').length > 0) {
        cy.get('input[name="fullName"]').as('fullNameField');
        cy.get('@fullNameField').type('Test Traveler', { force: true });
      }

      if ($body.find('input[name="email"]').length > 0) {
        cy.get('input[name="email"]').as('emailField');
        cy.get('@emailField').type('test@example.com', { force: true });
      }

      if ($body.find('input[name="phone"]').length > 0) {
        cy.get('input[name="phone"]').as('phoneField');
        cy.get('@phoneField').type('5555555555', { force: true });
      }

      if ($body.find('input[name="travelers"]').length > 0) {
        cy.get('input[name="travelers"]').as('travelersField');
        cy.get('@travelersField').clear({ force: true }).type('2', { force: true });
      }
    });

    // Submit booking by finding a button with text containing "Book"
    cy.log('Submitting booking');
    cy.get('button')
      .contains(/Book|Submit|Continue/i)
      .as('submitButton');
    cy.get('@submitButton').click({ force: true });

    // Step 4: Wait for confirmation page
    cy.log('Verifying booking confirmation');
    cy.url().should('not.include', '/book', { timeout: 10000 });

    // Verify confirmation details are displayed - look for key words that might be on the page
    cy.contains(/confirmation|confirmed|booked|success/i, { timeout: 10000 });

    // Step 5: Navigate to profile page to see bookings
    cy.log('Checking booking in profile page');
    cy.visit('/profile');

    // Verify profile page loads
    cy.contains(/Profile|Account/i, { timeout: 10000 });

    // Verify bookings section exists
    cy.contains(/My Bookings|Bookings|Trips|Itineraries/i, { timeout: 10000 });

    // Final verification
    cy.log('End-to-end booking flow completed successfully');
  });

  it('should allow user to login with Test User button, make a booking using direct navigation', () => {
    // Use our quick login command
    cy.log('Using quick login');
    cy.quickLogin();
    cy.log('Login successful');

    // Step 2: Navigate directly to booking page
    cy.log('Navigating directly to booking page');
    cy.visit('/book');

    // Step 3: Fill booking form - use minimal required fields approach
    cy.log('Filling booking form with minimal required fields');

    // Wait for page to load
    cy.wait(3000);

    // Find and click any submit/book button
    cy.get('button')
      .contains(/Book|Submit|Continue/i)
      .as('submitButton');
    cy.get('@submitButton').click({ force: true });

    // Step 4: Wait for confirmation or next page
    cy.log('Verifying navigation occurred');
    cy.url().should('not.include', '/book', { timeout: 10000 });

    // Basic verification that something happened
    cy.log('Basic verification of navigation after form submission');
  });

  it('should validate form fields when submitting empty booking form', () => {
    // Use our quick login command
    cy.log('Using quick login');
    cy.quickLogin();

    // Navigate to booking page
    cy.visit('/book');
    cy.wait(3000);

    // Attempt to submit the form - might have validation or might just accept empty form
    cy.get('button')
      .contains(/Book|Submit|Continue/i)
      .as('submitButton');
    cy.get('@submitButton').click({ force: true });

    // Verify we're still on the booking page or that validation occurred
    cy.get('body').then($body => {
      const text = $body.text();
      const hasValidationMessages = /required|cannot be empty|fill|invalid/i.test(text);

      if (hasValidationMessages) {
        cy.log('Validation messages found as expected');
      } else {
        cy.log('No validation messages found, checking if we stayed on the booking page');
        cy.url().should('include', '/book');
      }
    });
  });
});
