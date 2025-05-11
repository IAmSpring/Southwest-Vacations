/// <reference types="cypress" />

describe('Last-Minute Deal Journey', () => {
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

    // Mock last-minute deals
    cy.intercept('GET', '/api/deals/last-minute', {
      statusCode: 200,
      body: [
        {
          id: 'lm1',
          name: 'Last-Minute Cancun Getaway',
          destination: 'Cancun, Mexico',
          description: 'Beachfront resort in Cancun with all-inclusive option.',
          price: 799,
          originalPrice: 1299,
          duration: 4,
          category: 'beach',
          imageUrl: 'cancun.jpg',
          discount: 38,
          departureDate: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            return date.toISOString().split('T')[0];
          })(),
          seatsRemaining: 5,
        },
        {
          id: 'lm2',
          name: 'Weekend in Las Vegas',
          destination: 'Las Vegas, NV',
          description: 'Quick weekend getaway to Las Vegas with show tickets.',
          price: 499,
          originalPrice: 799,
          duration: 3,
          category: 'city',
          imageUrl: 'vegas.jpg',
          discount: 37,
          departureDate: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            return date.toISOString().split('T')[0];
          })(),
          seatsRemaining: 2,
        },
        {
          id: 'lm3',
          name: 'Miami Beach Escape',
          destination: 'Miami, FL',
          description: 'Last-minute luxury beach escape in South Beach.',
          price: 699,
          originalPrice: 1099,
          duration: 3,
          category: 'beach',
          imageUrl: 'miami.jpg',
          discount: 36,
          departureDate: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 10);
            return date.toISOString().split('T')[0];
          })(),
          seatsRemaining: 3,
        },
      ],
    }).as('lastMinuteDeals');

    // Mock deal details
    cy.intercept('GET', '/api/deals/lm1', {
      statusCode: 200,
      body: {
        id: 'lm1',
        name: 'Last-Minute Cancun Getaway',
        destination: 'Cancun, Mexico',
        description: 'Beachfront resort in Cancun with all-inclusive option.',
        longDescription:
          'Escape to the beautiful beaches of Cancun with this last-minute deal. Stay at a beachfront resort with optional all-inclusive package. This deal includes round-trip flights, airport transfers, and hotel accommodation. Limited seats remaining, book now to secure this special rate!',
        price: 799,
        originalPrice: 1299,
        duration: 4,
        category: 'beach',
        imageUrl: 'cancun.jpg',
        discount: 38,
        departureDate: (() => {
          const date = new Date();
          date.setDate(date.getDate() + 14);
          return date.toISOString().split('T')[0];
        })(),
        seatsRemaining: 5,
        includes: [
          'Round-trip flights',
          '3 nights accommodation',
          'Airport transfers',
          'Optional all-inclusive meal plan',
        ],
        hotels: [
          {
            id: 'cancun-resort',
            name: 'Beachfront Resort',
            pricePerNight: 150,
            stars: 4,
          },
        ],
      },
    }).as('dealDetails');

    // Mock booking
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking-lm-123',
        confirmationCode: 'SWL12345',
        status: 'confirmed',
        totalPrice: 799,
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Mock deal alert
    cy.intercept('POST', '/api/alerts', {
      statusCode: 200,
      body: {
        id: 'alert123',
        status: 'created',
        message: 'Deal alert created successfully',
      },
    }).as('createAlert');

    // Login first
    cy.visit('/login');
    cy.contains('Test User Login').click();
    cy.wait('@login');
  });

  it('should browse last-minute deals and book a trip to Cancun', () => {
    // Navigate to last-minute deals page
    cy.visit('/deals/last-minute');
    cy.wait('@lastMinuteDeals');

    // Verify deals are displayed
    cy.contains('Last-Minute Deals').should('exist');
    cy.contains('Last-Minute Cancun Getaway').should('exist');
    cy.contains('Weekend in Las Vegas').should('exist');
    cy.contains('Miami Beach Escape').should('exist');

    // Verify discount badges
    cy.contains('38% OFF').should('exist');
    cy.contains('37% OFF').should('exist');

    // Check remaining seats are displayed
    cy.contains('Only 5 seats left!').should('exist');
    cy.contains('Only 2 seats left!').should('exist');

    // View Cancun deal
    cy.contains('Last-Minute Cancun Getaway').click();
    cy.wait('@dealDetails');

    // Verify deal details
    cy.contains('Last-Minute Cancun Getaway').should('exist');
    cy.contains('Cancun, Mexico').should('exist');
    cy.contains('$799').should('exist');
    cy.contains('$1,299').should('exist');

    // Book the deal
    cy.contains('Book This Deal').click();

    // Complete quick booking form (simplified for last-minute)
    cy.get('[data-testid="booking-form"]').should('exist');
    cy.get('[data-testid="one-way-btn"]').click();

    cy.get('input[name="fullName"]').type('Quick Booker');
    cy.get('input[name="email"]').type('quick@example.com');
    cy.get('input[name="travelers"]').clear().type('2');

    // Add passenger details (required for international)
    cy.get('[data-testid="add-passenger-details"]').click();
    cy.get('input[name="passenger1Name"]').type('John Booker');
    cy.get('input[name="passenger1Passport"]').type('AB123456');
    cy.get('input[name="passenger2Name"]').type('Jane Booker');
    cy.get('input[name="passenger2Passport"]').type('CD789012');

    // Accept terms for last-minute booking
    cy.get('[data-testid="accept-terms"]').check();

    // Complete booking
    cy.contains('Book Now').click();
    cy.wait('@createBooking');

    // Verify confirmation
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWL12345').should('exist');
    cy.contains('Last-Minute Cancun Getaway').should('exist');
    cy.contains('2 Travelers').should('exist');
  });

  it('should set a deal alert for destination not currently on sale', () => {
    // Navigate to deals page
    cy.visit('/deals');

    // Go to deal alerts section
    cy.contains('Get Deal Alerts').click();

    // Set up alert
    cy.get('[data-testid="alert-form"]').should('exist');
    cy.get('select[name="destination"]').select('Hawaii');
    cy.get('input[name="priceThreshold"]').clear().type('899');
    cy.get('input[name="email"]').type('alerts@example.com');

    // Set timeframe
    cy.get('select[name="timeframe"]').select('Next 30 days');

    // Select notification preferences
    cy.get('[data-testid="email-notifications"]').check();
    cy.get('[data-testid="sms-notifications"]').check();
    cy.get('input[name="phone"]').type('5551234567');

    // Submit alert request
    cy.get('[data-testid="create-alert"]').click();
    cy.wait('@createAlert');

    // Verify confirmation
    cy.contains('Deal Alert Created').should('exist');
    cy.contains("We'll notify you when Hawaii deals under $899 become available").should('exist');

    // Check saved alerts
    cy.visit('/account/alerts');
    cy.contains('Hawaii').should('exist');
    cy.contains('Under $899').should('exist');
    cy.contains('Active').should('exist');
  });

  it('should filter last-minute deals by destination and price', () => {
    // Navigate to last-minute deals page
    cy.visit('/deals/last-minute');
    cy.wait('@lastMinuteDeals');

    // Use filters
    cy.get('[data-testid="filter-form"]').should('exist');

    // Filter by destination type
    cy.get('[data-testid="beach-filter"]').check();

    // Verify only beach destinations show
    cy.contains('Last-Minute Cancun Getaway').should('exist');
    cy.contains('Miami Beach Escape').should('exist');
    cy.contains('Weekend in Las Vegas').should('not.exist');

    // Filter by price range
    cy.get('[data-testid="price-slider"]').invoke('val', 650).trigger('change');

    // Verify filtered results
    cy.contains('Miami Beach Escape').should('exist');
    cy.contains('Last-Minute Cancun Getaway').should('not.exist');

    // Apply departure date filter
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const formattedDate = nextWeek.toISOString().split('T')[0];

    cy.get('[data-testid="max-date-filter"]').type(formattedDate);

    // Verify date-filtered results
    cy.contains('Miami Beach Escape').should('not.exist');

    // Reset filters
    cy.get('[data-testid="reset-filters"]').click();

    // Verify all deals are back
    cy.contains('Last-Minute Cancun Getaway').should('exist');
    cy.contains('Weekend in Las Vegas').should('exist');
    cy.contains('Miami Beach Escape').should('exist');
  });
});
