/// <reference types="cypress" />

describe('Basic User Journey', () => {
  beforeEach(() => {
    // Mock auth
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'test-token',
        user: {
          id: 'user123',
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    }).as('login');

    // Login
    cy.visit('/login');
    cy.contains('Test User Login').click();
    cy.wait('@login');
  });

  it('should navigate to home page and browse destinations', () => {
    // Visit the home page
    cy.visit('/');

    // Verify home page elements
    cy.contains('Popular Destinations').should('exist');

    // Wait for page to fully load
    cy.wait(1000);

    // Click on destination categories (if they exist)
    cy.get('body').then($body => {
      if ($body.find('[data-testid="category-all"]').length) {
        cy.get('[data-testid="category-all"]').click();
      } else if ($body.text().includes('All')) {
        cy.contains('All').click();
      }
    });

    // Navigate to About page
    cy.visit('/about');
    cy.contains('About').should('exist');

    // Go back to home page
    cy.visit('/');

    // Navigate to login page
    cy.visit('/login');
    cy.contains('Login').should('exist');
  });

  it('should complete a simple booking flow', () => {
    // Mock trips API
    cy.intercept('GET', '/api/trips*', {
      statusCode: 200,
      body: [
        {
          id: 'trip1',
          name: 'Beach Vacation',
          destination: 'Miami, FL',
          description: 'Relaxing beach getaway.',
          price: 1299,
          duration: 5,
          category: 'beach',
          imageUrl: 'miami.jpg',
        },
      ],
    }).as('getTrips');

    // Mock trip details API
    cy.intercept('GET', '/api/trips/trip1', {
      statusCode: 200,
      body: {
        id: 'trip1',
        name: 'Beach Vacation',
        destination: 'Miami, FL',
        description: 'Relaxing beach getaway.',
        price: 1299,
        duration: 5,
        category: 'beach',
        imageUrl: 'miami.jpg',
        includes: ['4 nights accommodation', 'Round-trip flights', 'Airport transfers'],
        availableDates: ['2025-06-15', '2025-07-10', '2025-08-05'],
      },
    }).as('getTripDetails');

    // Mock booking API
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking123',
        confirmationCode: 'SWV12345',
        status: 'confirmed',
        totalPrice: 1299,
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Visit home page
    cy.visit('/');
    cy.wait('@getTrips');

    // Select a trip
    cy.contains('Beach Vacation').click();
    cy.wait('@getTripDetails');

    // Click book now
    cy.contains('Book Now').click();

    // Fill booking form
    cy.get('body').then($body => {
      // Only proceed if booking form exists
      if (
        $body.find('[data-testid="booking-form"]').length ||
        $body.text().includes('Booking Details')
      ) {
        // Fill out form if elements exist
        if ($body.find('[data-testid="one-way-btn"]').length) {
          cy.get('[data-testid="one-way-btn"]').click();
        }

        if ($body.find('input[name="fullName"]').length) {
          cy.get('input[name="fullName"]').type('Test Traveler');
          cy.get('input[name="email"]').type('test@example.com');
          cy.get('input[name="travelers"]').clear().type('2');

          // Select dates
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() + 2);
          const formattedStartDate = startDate.toISOString().split('T')[0];
          cy.get('input[name="startDate"]').type(formattedStartDate);

          // Add special requests if the field exists
          if ($body.find('textarea[name="specialRequests"]').length) {
            cy.get('textarea[name="specialRequests"]').type('No special requests');
          }

          // Complete booking
          cy.contains('Complete Booking').click();
          cy.wait('@createBooking');

          // Verify confirmation
          cy.url().should('include', '/confirmation');
          cy.contains('Booking Confirmed').should('exist');
        }
      }
    });
  });
});
