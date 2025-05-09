/// <reference types="cypress" />

describe('Booking Flow', () => {
  beforeEach(() => {
    // Login first - using the test user account
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          id: 'test123',
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    }).as('login');
    
    // Mock trip availability data
    cy.intercept('GET', '/api/trips/trip1', {
      statusCode: 200,
      body: {
        id: 'trip1',
        name: 'Orlando Adventure',
        destination: 'Orlando, FL',
        description: 'Experience the magic of Orlando with this amazing package.',
        price: 1499,
        duration: 5,
        imageUrl: 'orlando.jpg',
        category: 'family',
        availableDates: ['2025-07-15', '2025-08-10', '2025-09-05'],
        hotels: [
          {
            id: 'hotel1',
            name: 'Luxury Resort',
            location: 'Orlando Resort Area',
            pricePerNight: 199,
            rating: 4.8,
            amenities: ['Pool', 'Spa', 'Fitness Center', 'Free WiFi'],
            imageUrl: 'hotel1.jpg'
          }
        ],
        carRentals: [
          {
            id: 'car1',
            model: 'Economy Car',
            company: 'Southwest Car Rental',
            pricePerDay: 49,
            type: 'economy',
            imageUrl: 'car1.jpg'
          }
        ]
      }
    }).as('getTripDetails');
    
    // Mock booking submission endpoint
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking123',
        status: 'confirmed',
        confirmationCode: 'SWV12345',
        totalPrice: 1896,
        createdAt: new Date().toISOString()
      }
    }).as('createBooking');
    
    // Visit the login page and log in
    cy.visit('/login');
    cy.contains('Test User Login').click();
    cy.wait('@login');
    
    // Navigate to booking page with trip ID
    cy.visit('/book?trip=trip1');
    cy.wait('@getTripDetails');
    
    // Wait for the page to load completely
    cy.wait(1000);
  });

  it('completes a basic one-way booking', () => {
    // Verify form is loaded
    cy.get('[data-testid="booking-form"]').should('exist');
    cy.contains('Booking Details').should('exist');
    
    // Select one-way trip type
    cy.get('[data-testid="one-way-btn"]').click();
    
    // Fill booking details
    cy.get('input[name="fullName"]').type('John Traveler');
    cy.get('input[name="email"]').type('john.traveler@example.com');
    cy.get('input[name="travelers"]').clear().type('2');
    
    // Select travel date
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    const formattedDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD
    cy.get('input[name="startDate"]').type(formattedDate);
    
    // Add special requests
    cy.get('textarea[name="specialRequests"]').type('Window seats please');
    
    // Submit the booking
    cy.contains('Complete Booking').click();
    cy.wait('@createBooking');
    
    // Should be redirected to confirmation page
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWV12345').should('exist');
  });

  it('completes a round-trip booking with hotel and car', () => {
    // Select round-trip option
    cy.get('[data-testid="round-trip-btn"]').click();
    
    // Fill booking details
    cy.get('input[name="fullName"]').type('Family Vacation');
    cy.get('input[name="email"]').type('family@example.com');
    cy.get('input[name="travelers"]').clear().type('4');
    
    // Select travel dates
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 2);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    cy.get('input[name="startDate"]').type(formattedStartDate);
    
    const returnDate = new Date(startDate);
    returnDate.setDate(returnDate.getDate() + 7);
    const formattedReturnDate = returnDate.toISOString().split('T')[0];
    cy.get('input[name="returnDate"]').type(formattedReturnDate);
    
    // Include hotel
    cy.contains('Include hotel with my booking').click();
    cy.contains('Luxury Resort').click();
    
    // Include car rental
    cy.contains('Include car rental with my booking').click();
    cy.contains('Economy Car').click();
    
    // Add special requests
    cy.get('textarea[name="specialRequests"]').type('Early check-in preferred');
    
    // Submit the booking
    cy.contains('Complete Booking').click();
    cy.wait('@createBooking');
    
    // Should be redirected to confirmation page
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWV12345').should('exist');
    
    // Verify booking details are shown
    cy.contains('4 Travelers').should('exist');
    cy.contains('Round Trip').should('exist');
    cy.contains('Hotel: Luxury Resort').should('exist');
    cy.contains('Car Rental: Economy Car').should('exist');
  });
}); 