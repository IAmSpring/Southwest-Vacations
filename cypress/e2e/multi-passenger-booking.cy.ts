/// <reference types="cypress" />

describe('Multi-Passenger Booking Flow', () => {
  const TEST_EMPLOYEE = {
    email: 'employee@southwest.com',
    password: 'password123',
    name: 'Employee User',
    employeeId: 'EMP12345',
  };

  beforeEach(() => {
    // Reset cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();

    // Mock API endpoints
    cy.intercept('GET', '/api/trips', { fixture: 'trips.json' }).as('getTrips');
    cy.intercept('GET', '/api/trips/*', { fixture: 'tripDetails.json' }).as('getTripDetails');

    // Mock booking creation with multiple passengers
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking123',
        status: 'confirmed',
        confirmationCode: 'SWV12345',
        totalPrice: 2999.98,
        passengerCount: 3,
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Set up employee authentication
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          id: 'emp123',
          name: TEST_EMPLOYEE.name,
          email: TEST_EMPLOYEE.email,
          isEmployee: true,
          employeeId: TEST_EMPLOYEE.employeeId,
        },
      },
    }).as('loginEmployee');
  });

  it('allows employee to create a multi-passenger booking', () => {
    // Visit the employee portal
    cy.visit('/employee-portal');

    // Login as employee
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to booking creation
    cy.contains('Create Booking').click();

    // Select trip
    cy.get('[data-testid="destination-select"]').click();
    cy.contains('Maui, Hawaii').click();

    // Select dates
    cy.get('input[name="departureDate"]').type('2025-08-15');
    cy.get('input[name="returnDate"]').type('2025-08-22');

    // Toggle multi-passenger booking
    cy.contains('Add Multiple Passengers').click();

    // Add passenger details
    cy.get('[data-testid="passenger-form-0"]').within(() => {
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="phone"]').type('555-123-4567');
    });

    // Add second passenger
    cy.contains('Add Passenger').click();
    cy.get('[data-testid="passenger-form-1"]').within(() => {
      cy.get('input[name="firstName"]').type('Jane');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('jane@example.com');
      cy.get('input[name="phone"]').type('555-765-4321');
    });

    // Add third passenger
    cy.contains('Add Passenger').click();
    cy.get('[data-testid="passenger-form-2"]').within(() => {
      cy.get('input[name="firstName"]').type('Jimmy');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('jimmy@example.com');
      cy.get('input[name="phone"]').type('555-999-8888');
    });

    // Choose business booking
    cy.contains('Business Booking').click();
    cy.get('input[name="companyName"]').type('Southwest Airlines');
    cy.get('input[name="departmentCode"]').type('MKT-001');

    // Add special requests
    cy.get('textarea[name="specialRequests"]').type(
      'Please arrange airport transfer for all passengers'
    );

    // Complete booking
    cy.contains('Complete Booking').click();
    cy.wait('@createBooking');

    // Verify we're on the confirmation page
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWV12345').should('exist');
    cy.contains('3 Passengers').should('exist');

    // Navigate to manage bookings
    cy.contains('Manage Bookings').click();

    // Verify booking appears in manage bookings
    cy.url().should('include', '/bookings-management');
    cy.contains('SWV12345').should('exist');
    cy.contains('3 Passengers').should('exist');
  });

  it('allows removing passengers from a multi-passenger booking', () => {
    // Visit the employee portal and login
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to booking creation
    cy.contains('Create Booking').click();

    // Select destination and dates
    cy.get('[data-testid="destination-select"]').click();
    cy.contains('Maui, Hawaii').click();
    cy.get('input[name="departureDate"]').type('2025-08-15');
    cy.get('input[name="returnDate"]').type('2025-08-22');

    // Toggle multi-passenger booking
    cy.contains('Add Multiple Passengers').click();

    // Add passenger details for 3 passengers
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        cy.contains('Add Passenger').click();
      }
      cy.get(`[data-testid="passenger-form-${i}"]`).within(() => {
        cy.get('input[name="firstName"]').type(`Passenger ${i + 1}`);
        cy.get('input[name="lastName"]').type('Smith');
        cy.get('input[name="email"]').type(`passenger${i + 1}@example.com`);
        cy.get('input[name="phone"]').type(`555-111-${i + 1}${i + 1}${i + 1}${i + 1}`);
      });
    }

    // Remove the second passenger
    cy.get('[data-testid="passenger-form-1"]').within(() => {
      cy.contains('Remove').click();
    });

    // Verify there are now 2 passengers and they are numbered correctly
    cy.get('[data-testid="passenger-form-0"]').should('exist');
    cy.get('[data-testid="passenger-form-1"]').should('exist');
    cy.get('[data-testid="passenger-form-2"]').should('not.exist');

    // Verify the third passenger is now in position 1
    cy.get('[data-testid="passenger-form-1"]').within(() => {
      cy.get('input[name="firstName"]').should('have.value', 'Passenger 3');
    });
  });
});
