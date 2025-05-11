/// <reference types="cypress" />

describe('Family Vacation Planning Journey', () => {
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

    // Mock destinations
    cy.intercept('GET', '/api/trips/categories/family', {
      statusCode: 200,
      body: [
        {
          id: 'family1',
          name: 'Disney World Adventure',
          destination: 'Orlando, FL',
          description: 'Magical family vacation at Disney World.',
          price: 2199,
          duration: 5,
          category: 'family',
          imageUrl: 'disney.jpg',
          highlights: ['Park Tickets', 'Character Dining', 'Resort Stay'],
        },
        {
          id: 'family2',
          name: 'San Diego Family Fun',
          destination: 'San Diego, CA',
          description: 'Beach, zoo, and theme parks in sunny San Diego.',
          price: 1899,
          duration: 6,
          category: 'family',
          imageUrl: 'sandiego.jpg',
          highlights: ['Zoo Tickets', 'SeaWorld', 'Beach Resort'],
        },
        {
          id: 'family3',
          name: 'Yellowstone Family Adventure',
          destination: 'Yellowstone, WY',
          description: 'Explore the natural wonders of Yellowstone with the family.',
          price: 2499,
          duration: 7,
          category: 'family',
          imageUrl: 'yellowstone.jpg',
          highlights: ['Park Pass', 'Cabin Stay', 'Guided Tours'],
        },
      ],
    }).as('familyTrips');

    // Mock trip details
    cy.intercept('GET', '/api/trips/family1', {
      statusCode: 200,
      body: {
        id: 'family1',
        name: 'Disney World Adventure',
        destination: 'Orlando, FL',
        description: 'Magical family vacation at Disney World.',
        price: 2199,
        duration: 5,
        category: 'family',
        imageUrl: 'disney.jpg',
        highlights: ['Park Tickets', 'Character Dining', 'Resort Stay'],
        includes: [
          '4 nights accommodation at Disney resort',
          '3-day Disney park hopper passes',
          'Character breakfast',
          'Airport transfers',
        ],
        availableDates: ['2025-06-15', '2025-07-10', '2025-08-05', '2025-09-15'],
        hotels: [
          {
            id: 'disney-resort',
            name: 'Disney Value Resort',
            pricePerNight: 199,
            stars: 3,
          },
          {
            id: 'disney-deluxe',
            name: 'Disney Deluxe Resort',
            pricePerNight: 399,
            stars: 5,
          },
        ],
      },
    }).as('disneyTripDetails');

    // Mock favorites
    cy.intercept('POST', '/api/favorites', {
      statusCode: 200,
      body: { success: true },
    }).as('addFavorite');

    // Mock booking
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking-family-123',
        confirmationCode: 'SWF78901',
        status: 'confirmed',
        totalPrice: 6597,
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Login first
    cy.visit('/login');
    cy.contains('Test User Login').click();
    cy.wait('@login');
  });

  it('should filter family-friendly destinations and save favorites', () => {
    // Navigate to home page
    cy.visit('/');

    // Click on Family filter
    cy.contains('Family').click();
    cy.wait('@familyTrips');

    // Verify family destinations are shown
    cy.contains('Disney World Adventure').should('exist');
    cy.contains('San Diego Family Fun').should('exist');
    cy.contains('Yellowstone Family Adventure').should('exist');

    // Save two destinations as favorites
    cy.get('[data-testid="trip-card-family1"] [data-testid="favorite-btn"]').click();
    cy.wait('@addFavorite');

    cy.get('[data-testid="trip-card-family3"] [data-testid="favorite-btn"]').click();
    cy.wait('@addFavorite');

    // Navigate to favorites
    cy.visit('/favorites');

    // Verify favorites are saved
    cy.contains('Disney World Adventure').should('exist');
    cy.contains('Yellowstone Family Adventure').should('exist');
    cy.contains('San Diego Family Fun').should('not.exist');
  });

  it('should book a Disney vacation for a family of 5', () => {
    // Visit the family trip details page
    cy.visit('/trips/family1');
    cy.wait('@disneyTripDetails');

    // Verify trip details are displayed
    cy.contains('Disney World Adventure').should('exist');
    cy.contains('Orlando, FL').should('exist');
    cy.contains('Park Tickets').should('exist');

    // Click book now
    cy.contains('Book Now').click();

    // Fill booking form for family of 5
    cy.get('[data-testid="booking-form"]').should('exist');
    cy.get('[data-testid="round-trip-btn"]').click();

    cy.get('input[name="fullName"]').type('Smith Family');
    cy.get('input[name="email"]').type('smith@example.com');
    cy.get('input[name="travelers"]').clear().type('5');

    // Select dates
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 6);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    cy.get('input[name="startDate"]').type(formattedStartDate);

    const returnDate = new Date(startDate);
    returnDate.setDate(returnDate.getDate() + 5);
    const formattedReturnDate = returnDate.toISOString().split('T')[0];
    cy.get('input[name="returnDate"]').type(formattedReturnDate);

    // Choose deluxe resort
    cy.contains('Include hotel with my booking').click();
    cy.contains('Disney Deluxe Resort').click();

    // Add special requests
    cy.get('textarea[name="specialRequests"]').type(
      'Two connecting rooms, child seats for transportation, and birthday celebration for 8-year-old.'
    );

    // Submit booking
    cy.contains('Complete Booking').click();
    cy.wait('@createBooking');

    // Verify confirmation
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWF78901').should('exist');
    cy.contains('5 Travelers').should('exist');
    cy.contains('Disney Deluxe Resort').should('exist');
  });

  it('should use the vacation planner tool to get a customized family itinerary', () => {
    // Mock vacation planner API
    cy.intercept('POST', '/api/planner', {
      statusCode: 200,
      body: {
        id: 'plan123',
        itinerary: [
          {
            day: 1,
            activities: ['Magic Kingdom', 'Character Dinner'],
            tips: 'Arrive early to beat the crowds!',
          },
          {
            day: 2,
            activities: ['Animal Kingdom', 'Pool Time'],
            tips: "Don't miss the Safari ride!",
          },
          {
            day: 3,
            activities: ['Hollywood Studios', 'Fantasmic Show'],
            tips: 'Book Lightning Lane for popular rides.',
          },
          {
            day: 4,
            activities: ['Epcot', 'Fireworks Show'],
            tips: 'Try foods from around the world in World Showcase.',
          },
          {
            day: 5,
            activities: ['Water Park', 'Souvenir Shopping'],
            tips: 'Remember to pack sunscreen!',
          },
        ],
      },
    }).as('plannerRequest');

    // Navigate to vacation planner
    cy.visit('/planner');

    // Fill planner form
    cy.get('[data-testid="destination"]').select('Orlando, FL');
    cy.get('[data-testid="duration"]').select('5 days');
    cy.get('[data-testid="travelers"]').select('5');
    cy.get('[data-testid="children"]').select('3');

    // Select preferences
    cy.get('[data-testid="theme-parks"]').check();
    cy.get('[data-testid="swimming"]').check();
    cy.get('[data-testid="dining"]').check();

    // Set child ages
    cy.get('[data-testid="child-age-1"]').select('8');
    cy.get('[data-testid="child-age-2"]').select('6');
    cy.get('[data-testid="child-age-3"]').select('4');

    // Submit request
    cy.get('[data-testid="generate-plan"]').click();
    cy.wait('@plannerRequest');

    // Verify itinerary is displayed
    cy.contains('Your Custom Family Itinerary').should('exist');
    cy.contains('Day 1:').should('exist');
    cy.contains('Magic Kingdom').should('exist');

    // Save itinerary
    cy.intercept('POST', '/api/planner/save', {
      statusCode: 200,
      body: { success: true, planId: 'plan123' },
    }).as('savePlan');

    cy.get('[data-testid="save-itinerary"]').click();
    cy.wait('@savePlan');

    cy.contains('Itinerary saved successfully').should('exist');

    // Navigate to saved plans
    cy.visit('/planner/saved');
    cy.contains('Orlando, FL - 5 days').should('exist');
  });
});
