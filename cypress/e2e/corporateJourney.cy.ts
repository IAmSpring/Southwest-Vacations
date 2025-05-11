/// <reference types="cypress" />

describe('Corporate Travel Booking Journey', () => {
  beforeEach(() => {
    // Mock auth with admin credentials
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'admin-token',
        user: {
          id: 'admin123',
          username: 'admin',
          email: 'admin@example.com',
          isAdmin: true,
        },
      },
    }).as('adminLogin');

    // Mock trips API for business trips (using existing trips endpoint)
    cy.intercept('GET', '/api/trips*', {
      statusCode: 200,
      body: [
        {
          id: 'trip1',
          name: 'Business Conference Package',
          destination: 'Chicago, IL',
          description: 'All-inclusive business conference package with meeting rooms.',
          price: 2499,
          duration: 4,
          category: 'city',
          highlights: ['Meeting Rooms', 'Airport Transfers', 'Business Center'],
          imageUrl: 'chicago.jpg',
        },
        {
          id: 'trip2',
          name: 'Corporate Retreat',
          destination: 'Denver, CO',
          description: 'Team building and retreat package with activities.',
          price: 3299,
          duration: 3,
          category: 'mountain',
          highlights: ['Team Building', 'Luxury Accommodation', 'Catering'],
          imageUrl: 'denver.jpg',
        },
      ],
    }).as('getTrips');

    // Mock trip details
    cy.intercept('GET', '/api/trips/trip1', {
      statusCode: 200,
      body: {
        id: 'trip1',
        name: 'Business Conference Package',
        destination: 'Chicago, IL',
        description: 'All-inclusive business conference package with meeting rooms.',
        price: 2499,
        duration: 4,
        category: 'city',
        highlights: ['Meeting Rooms', 'Airport Transfers', 'Business Center'],
        imageUrl: 'chicago.jpg',
        includes: [
          'Luxury hotel accommodations',
          'Airport transfers',
          'Meeting room access',
          'Business center services',
        ],
        availableDates: ['2025-06-15', '2025-07-10', '2025-08-05'],
      },
    }).as('getTripDetails');

    // Mock booking endpoint (using existing endpoint)
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking123',
        status: 'confirmed',
        confirmationCode: 'SWC54321',
        totalPrice: 29988,
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Login as admin
    cy.visit('/login');
    cy.contains('Test User Login').click();
    cy.wait('@adminLogin');
  });

  it('should view business trips and book a trip for a corporate group', () => {
    // Navigate to home page with business trips
    cy.visit('/');
    cy.wait('@getTrips');

    // Filter to city destinations (for business trips)
    cy.contains('City').click();

    // Verify business trips are displayed
    cy.contains('Business Conference Package').should('exist');

    // Select a business trip
    cy.contains('Business Conference Package').click();
    cy.wait('@getTripDetails');

    // Verify trip details are displayed
    cy.contains('Business Conference Package').should('exist');
    cy.contains('Chicago, IL').should('exist');
    cy.contains('$2,499').should('exist');

    // Click book now
    cy.contains('Book Now').click();

    // Fill booking form for corporate group
    cy.get('[data-testid="booking-form"]').should('exist');

    // Select round trip option
    cy.get('[data-testid="round-trip-btn"]').click();

    // Fill in booking details
    cy.get('input[name="fullName"]').type('Acme Corporation');
    cy.get('input[name="email"]').type('bookings@acmecorp.com');
    cy.get('input[name="travelers"]').clear().type('12');

    // Select dates for the corporate trip
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 2);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    cy.get('input[name="startDate"]').type(formattedStartDate);

    const returnDate = new Date(startDate);
    returnDate.setDate(returnDate.getDate() + 4);
    const formattedReturnDate = returnDate.toISOString().split('T')[0];
    cy.get('input[name="returnDate"]').type(formattedReturnDate);

    // Add special requirements for the corporate event
    cy.get('textarea[name="specialRequests"]').type(
      'Corporate group booking - Need projector setup, meeting rooms, and vegetarian meal options for 5 attendees.'
    );

    // Submit booking
    cy.contains('Complete Booking').click();
    cy.wait('@createBooking');

    // Verify confirmation
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWC54321').should('exist');
    cy.contains('12 Travelers').should('exist');
  });

  it('should browse popular destinations for corporate events', () => {
    // Navigate to homepage
    cy.visit('/');
    cy.wait('@getTrips');

    // Check popular destinations section
    cy.contains('Popular Destinations').should('exist');

    // View all destinations
    cy.contains('All').click();

    // Look for business-friendly destinations
    cy.contains('Business Conference Package').should('exist');
    cy.contains('Corporate Retreat').should('exist');

    // Filter by category
    cy.contains('City').click();

    // Verify filtered results
    cy.contains('Business Conference Package').should('exist');
    cy.contains('Corporate Retreat').should('not.exist');

    // Check destination details
    cy.contains('Chicago, IL').should('exist');
    cy.contains('$2,499').should('exist');

    // Open trip details to explore business amenities
    cy.contains('Business Conference Package').click();
    cy.wait('@getTripDetails');

    // Verify business amenities are displayed
    cy.contains('Meeting Rooms').should('exist');
    cy.contains('Business Center').should('exist');
    cy.contains('Airport Transfers').should('exist');
  });
});
