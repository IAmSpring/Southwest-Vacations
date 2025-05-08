/// <reference types="cypress" />

describe('End-to-End User Journey', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
    
    // Wait for trips to load
    cy.intercept('/trips').as('getTrips');
    cy.wait('@getTrips');
  });

  it('should allow a user to browse trips, select one, and complete a booking', () => {
    // Step 1: User browses trips on the homepage
    cy.contains('h1', 'Book Your Dream Vacation');
    cy.get('[data-testid="trip-card"]').should('have.length.at.least', 1);
    
    // Step 2: User clicks on a trip
    cy.get('[data-testid="trip-card"]').first().click();
    
    // Step 3: User views trip details
    cy.url().should('include', '/trip/');
    cy.contains('Book Now').should('be.visible');
    
    // Step 4: User clicks Book Now
    cy.contains('Book Now').click();
    
    // Step 5: User should be redirected to booking page
    cy.url().should('include', '/booking');
    cy.contains('Booking Details').should('be.visible');

    // Step 6: Fill out booking form
    
    // Select round trip
    cy.contains('Round Trip').click();
    
    // Fill in personal details
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="travelers"]').clear().type('2');

    // Select dates
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const returnDate = new Date(futureDate);
    returnDate.setDate(returnDate.getDate() + 7);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    cy.get('input[name="startDate"]').type(formatDate(futureDate));
    cy.get('input[name="returnDate"]').type(formatDate(returnDate));
    
    // Select departure and return times
    cy.get('select[id="departureTime"]').select('morning');
    cy.get('select[id="returnTime"]').select('evening');
    
    // Add special requests
    cy.get('textarea[name="specialRequests"]').type('Please arrange for a window seat');
    
    // Choose to include a hotel
    cy.get('input[id="includeHotel"]').check();
    
    // Wait for hotels to appear and select the first one
    cy.get('div').contains('Select a hotel from the available options:').should('be.visible');
    cy.wait(500); // Short wait to ensure hotels have loaded
    cy.get('div').contains('Select a hotel from the available options:')
      .parent().find('div.grid > div').first().click();
    
    // Choose to include a car rental
    cy.get('input[id="includeCar"]').check();
    
    // Wait for cars to appear and select the first one
    cy.get('div').contains('Select a vehicle from the available options:').should('be.visible');
    cy.wait(500); // Short wait to ensure cars have loaded
    cy.get('div').contains('Select a vehicle from the available options:')
      .parent().find('div.grid > div').first().click();
    
    // Step 7: Submit booking form
    // Mock the booking API response for testing purposes
    cy.intercept('POST', '**/bookings', {
      statusCode: 200,
      body: {
        bookingId: 'test-booking-123',
        confirmed: true
      }
    }).as('bookTrip');
    
    cy.contains('button', 'Complete Booking').click();
    
    // Step 8: Wait for booking submission and verify redirect to confirmation
    cy.wait('@bookTrip');
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('be.visible');
    cy.contains('test-booking-123').should('be.visible');
  });

  it('should handle login before booking if required', () => {
    // Step 1: User views a trip and tries to book 
    cy.get('[data-testid="trip-card"]').first().click();
    cy.contains('Book Now').click();
    
    // Step 2: If login is required, the login form should appear
    cy.get('body').then(($body) => {
      if ($body.find('form').filter(':contains("Login")').length > 0) {
        // Login form exists, complete login
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('Password123');
        cy.contains('button', 'Login').click();
        
        // After login, we should be redirected to booking page
        cy.url().should('include', '/booking');
        cy.contains('Booking Details').should('be.visible');
      } else {
        // We're already on the booking page
        cy.log('Already on booking page - no login required');
      }
    });
  });
}); 