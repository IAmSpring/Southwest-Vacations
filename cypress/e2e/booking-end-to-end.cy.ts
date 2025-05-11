/// <reference types="cypress" />

describe('Complete Booking End-to-End Flow', () => {
  const TEST_USER = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  beforeEach(() => {
    // Reset cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Mock API endpoints
    cy.intercept('GET', '/api/trips', { fixture: 'trips.json' }).as('getTrips');
    cy.intercept('GET', '/api/trips/*', { fixture: 'tripDetails.json' }).as('getTripDetails');

    // Mock booking creation
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking123',
        status: 'confirmed',
        confirmationCode: 'SWV12345',
        totalPrice: 1499.99,
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Mock user bookings endpoint
    cy.intercept('GET', '/api/users/*/bookings', {
      statusCode: 200,
      body: [
        {
          id: 'booking123',
          status: 'confirmed',
          confirmationCode: 'SWV12345',
          tripId: 'trip1',
          destination: 'Maui, Hawaii',
          departureDate: '2025-08-15',
          returnDate: '2025-08-22',
          totalPrice: 1499.99,
          createdAt: new Date().toISOString(),
        },
      ],
    }).as('getUserBookings');

    // Set up authentication
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 'test123',
          name: TEST_USER.name,
          email: TEST_USER.email,
        },
      },
    }).as('loginUser');
  });

  it('simulates booking flow with mocked responses', () => {
    // Visit the homepage
    cy.visit('/');

    // Simulate finding a trip (we'll go directly to trip details with ID)
    cy.visit('/trips/trip1');

    // Select a date (using the first date option)
    cy.get('[data-testid="date-option-0"]').click({ force: true });

    // Book the trip
    cy.contains('Book Now').click({ force: true });

    // At this point we would be on the booking page
    // Mock the login action
    window.localStorage.setItem('token', 'fake-jwt-token');

    // Fill in the booking form
    cy.visit('/book?trip=trip1&date=2025-08-15');

    // Enter number of travelers
    cy.get('input[name="travelers"]').clear().type('2', { force: true });

    // Add special requests
    cy.get('textarea[name="specialRequests"]').type('Please arrange airport transfer', {
      force: true,
    });

    // Complete booking
    cy.contains('Complete Booking').click({ force: true });

    // Verify we're on the confirmation page
    cy.url().should('include', '/confirmation');

    // Navigate to manage vacations
    cy.contains('Manage Vacations').click({ force: true });

    // Verify booking appears in manage vacations
    cy.url().should('include', '/manage-vacations');
    cy.contains('SWV12345').should('exist');
  });
});
