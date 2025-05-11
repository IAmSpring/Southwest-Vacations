/// <reference types="cypress" />

describe('Multi-Location Trip Creation', () => {
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

    // Mock destination search API
    cy.intercept('GET', '/api/destinations/search*', {
      statusCode: 200,
      body: [
        { id: 'lax', name: 'Los Angeles, CA', code: 'LAX' },
        { id: 'sfo', name: 'San Francisco, CA', code: 'SFO' },
        { id: 'den', name: 'Denver, CO', code: 'DEN' },
        { id: 'jfk', name: 'New York, NY', code: 'JFK' },
        { id: 'mia', name: 'Miami, FL', code: 'MIA' },
        { id: 'las', name: 'Las Vegas, NV', code: 'LAS' },
        { id: 'hnl', name: 'Honolulu, HI', code: 'HNL' },
      ],
    }).as('searchDestinations');

    // Mock flight availability API
    cy.intercept('GET', '/api/flights/availability*', {
      statusCode: 200,
      body: {
        flights: [
          {
            id: 'flight1',
            departureAirport: 'LAX',
            arrivalAirport: 'SFO',
            departureTime: '2025-06-10T08:00:00Z',
            arrivalTime: '2025-06-10T09:30:00Z',
            flightNumber: 'SWA123',
            price: 149.99,
            availableSeats: 12,
          },
          {
            id: 'flight2',
            departureAirport: 'LAX',
            arrivalAirport: 'SFO',
            departureTime: '2025-06-10T12:00:00Z',
            arrivalTime: '2025-06-10T13:30:00Z',
            flightNumber: 'SWA456',
            price: 179.99,
            availableSeats: 8,
          },
          {
            id: 'flight3',
            departureAirport: 'SFO',
            arrivalAirport: 'DEN',
            departureTime: '2025-06-15T10:00:00Z',
            arrivalTime: '2025-06-15T13:15:00Z',
            flightNumber: 'SWA789',
            price: 219.99,
            availableSeats: 15,
          },
          {
            id: 'flight4',
            departureAirport: 'DEN',
            arrivalAirport: 'LAX',
            departureTime: '2025-06-20T14:00:00Z',
            arrivalTime: '2025-06-20T15:30:00Z',
            flightNumber: 'SWA321',
            price: 199.99,
            availableSeats: 10,
          },
        ],
      },
    }).as('getFlightAvailability');

    // Mock hotel availability API
    cy.intercept('GET', '/api/hotels/availability*', {
      statusCode: 200,
      body: {
        hotels: [
          {
            id: 'hotel1',
            name: 'Grand Hotel San Francisco',
            location: 'San Francisco, CA',
            stars: 4,
            pricePerNight: 199.99,
            availableRooms: 5,
            amenities: ['Pool', 'Spa', 'Restaurant', 'Gym'],
          },
          {
            id: 'hotel2',
            name: 'Mountainview Lodge',
            location: 'Denver, CO',
            stars: 3.5,
            pricePerNight: 149.99,
            availableRooms: 8,
            amenities: ['Restaurant', 'Gym', 'Business Center'],
          },
        ],
      },
    }).as('getHotelAvailability');

    // Mock multi-segment booking creation
    cy.intercept('POST', '/api/bookings/multi-segment', {
      statusCode: 200,
      body: {
        id: 'booking123',
        status: 'confirmed',
        confirmationCode: 'SWV12345',
        totalPrice: 2999.98,
        passengerCount: 2,
        segments: [
          {
            id: 'segment1',
            departureLocation: 'Los Angeles, CA',
            arrivalLocation: 'San Francisco, CA',
            departureDate: '2025-06-10',
            returnDate: '2025-06-15',
            flight: {
              outbound: 'SWA123',
              inbound: 'SWA456',
            },
            hotel: 'hotel1',
          },
          {
            id: 'segment2',
            departureLocation: 'San Francisco, CA',
            arrivalLocation: 'Denver, CO',
            departureDate: '2025-06-15',
            returnDate: '2025-06-20',
            flight: {
              outbound: 'SWA789',
              inbound: 'SWA321',
            },
            hotel: 'hotel2',
          },
        ],
        createdAt: new Date().toISOString(),
      },
    }).as('createMultiSegmentBooking');
  });

  it('allows creation of a multi-segment trip', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to booking creation
    cy.contains('Create Booking').click();

    // Enable multi-destination booking
    cy.contains('Multi-Destination Trip').click();

    // Configure first segment
    cy.get('[data-testid="segment-0"]').within(() => {
      // Select departure location
      cy.get('[data-testid="departure-location"]').type('Los Ang');
      cy.wait('@searchDestinations');
      cy.contains('Los Angeles, CA').click();

      // Select destination
      cy.get('[data-testid="arrival-location"]').type('San Fra');
      cy.wait('@searchDestinations');
      cy.contains('San Francisco, CA').click();

      // Select dates
      cy.get('input[name="departureDate"]').type('2025-06-10');
      cy.get('input[name="returnDate"]').type('2025-06-15');
    });

    // Add second segment
    cy.contains('Add Segment').click();

    // Configure second segment
    cy.get('[data-testid="segment-1"]').within(() => {
      // Departure should automatically be set to the previous destination
      cy.get('[data-testid="departure-location"]').should('have.value', 'San Francisco, CA');

      // Select destination
      cy.get('[data-testid="arrival-location"]').type('Denver');
      cy.wait('@searchDestinations');
      cy.contains('Denver, CO').click();

      // Select dates
      cy.get('input[name="departureDate"]').type('2025-06-15');
      cy.get('input[name="returnDate"]').type('2025-06-20');
    });

    // Add passenger information
    cy.contains('Passenger Information').click();
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
      cy.get('input[name="phone"]').type('555-987-6543');
    });

    // Search for flights and hotels
    cy.contains('Search').click();
    cy.wait('@getFlightAvailability');
    cy.wait('@getHotelAvailability');

    // Select flights for first segment
    cy.get('[data-testid="segment-0"]').within(() => {
      cy.contains('SWA123').click();
    });

    // Select flights for second segment
    cy.get('[data-testid="segment-1"]').within(() => {
      cy.contains('SWA789').click();
    });

    // Select hotels
    cy.get('[data-testid="hotel-selection-0"]').within(() => {
      cy.contains('Grand Hotel San Francisco').click();
    });
    cy.get('[data-testid="hotel-selection-1"]').within(() => {
      cy.contains('Mountainview Lodge').click();
    });

    // Review and complete booking
    cy.contains('Review Booking').click();

    // Verify booking details are displayed correctly
    cy.contains('Los Angeles, CA to San Francisco, CA').should('exist');
    cy.contains('San Francisco, CA to Denver, CO').should('exist');
    cy.contains('2 Passengers').should('exist');
    cy.contains('$2,999.98').should('exist');

    // Complete booking
    cy.contains('Complete Booking').click();
    cy.wait('@createMultiSegmentBooking');

    // Verify booking confirmation
    cy.url().should('include', '/confirmation');
    cy.contains('SWV12345').should('exist');
    cy.contains('Multi-Destination Itinerary').should('exist');
    cy.contains('Los Angeles, CA to San Francisco, CA').should('exist');
    cy.contains('San Francisco, CA to Denver, CO').should('exist');
  });

  it('validates segments in a multi-destination trip', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to booking creation
    cy.contains('Create Booking').click();

    // Enable multi-destination booking
    cy.contains('Multi-Destination Trip').click();

    // Configure first segment incompletely
    cy.get('[data-testid="segment-0"]').within(() => {
      // Only select departure location
      cy.get('[data-testid="departure-location"]').type('Los Ang');
      cy.wait('@searchDestinations');
      cy.contains('Los Angeles, CA').click();
    });

    // Try to add a new segment
    cy.contains('Add Segment').click();

    // Verify validation error
    cy.contains('Please complete all fields in the current segment before adding a new one').should(
      'exist'
    );

    // Complete the first segment
    cy.get('[data-testid="segment-0"]').within(() => {
      // Select destination
      cy.get('[data-testid="arrival-location"]').type('San Fra');
      cy.wait('@searchDestinations');
      cy.contains('San Francisco, CA').click();

      // Select dates
      cy.get('input[name="departureDate"]').type('2025-06-10');
      cy.get('input[name="returnDate"]').type('2025-06-15');
    });

    // Now should be able to add a new segment
    cy.contains('Add Segment').click();
    cy.get('[data-testid="segment-1"]').should('exist');

    // Try to enter an invalid date (departure before previous return)
    cy.get('[data-testid="segment-1"]').within(() => {
      cy.get('[data-testid="arrival-location"]').type('Denver');
      cy.wait('@searchDestinations');
      cy.contains('Denver, CO').click();

      // Enter invalid date (before previous segment's return)
      cy.get('input[name="departureDate"]').type('2025-06-14');
    });

    // Verify validation error
    cy.contains("Departure date must be on or after the previous segment's return date").should(
      'exist'
    );

    // Fix the date
    cy.get('[data-testid="segment-1"]').within(() => {
      cy.get('input[name="departureDate"]').clear().type('2025-06-15');
      cy.get('input[name="returnDate"]').type('2025-06-20');
    });

    // Error should disappear
    cy.contains("Departure date must be on or after the previous segment's return date").should(
      'not.exist'
    );
  });
});
