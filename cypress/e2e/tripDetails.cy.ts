/// <reference types="cypress" />

describe('Trip Details Page', () => {
  beforeEach(() => {
    // Mock trip details API response
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
        datesAvailable: ['2023-06-15', '2023-06-22', '2023-07-01', '2023-07-15'],
        highlights: [
          'Theme park tickets included',
          'Luxury hotel accommodations',
          'Round-trip flights',
        ],
        includes: ['Round-trip flight', '4 nights accommodation', 'Airport transfers'],
      },
    }).as('getTripDetails');

    // Visit the trip details page
    cy.visit('/trip/trip1');

    // Wait for API request to complete
    cy.wait('@getTripDetails');

    // Wait for any animations to complete
    cy.wait(1000);
  });

  it('displays trip name and destination correctly', () => {
    cy.contains('Orlando Adventure').should('exist');
    cy.contains('Orlando, FL').should('exist');
  });

  it('shows trip details and price', () => {
    cy.contains('$1,499').should('exist');
    cy.contains('5 Days').should('exist');
    cy.contains('Experience the magic of Orlando').should('exist');
  });

  it('displays trip highlights', () => {
    cy.contains('Trip Highlights').should('exist');
    cy.contains('Theme park tickets included').should('exist');
    cy.contains('Luxury hotel accommodations').should('exist');
    cy.contains('Round-trip flights').should('exist');
  });

  it('has a functional booking button', () => {
    cy.contains('Book This Trip').click();

    // Should navigate to the booking page with trip ID
    cy.url().should('include', '/book?trip=trip1');
  });

  it('allows date selection and passes the selected date to booking', () => {
    // Check if dates section exists
    cy.contains('Available Dates').should('exist');

    // First date should be selected by default
    cy.get('[data-testid="date-option-0"]').should('have.attr', 'aria-selected', 'true');

    // Select the second date
    cy.get('[data-testid="date-option-1"]').click();

    // Verify it's selected
    cy.get('[data-testid="date-option-1"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-testid="date-option-0"]').should('have.attr', 'aria-selected', 'false');

    // Verify the date appears in the booking summary
    cy.contains('Selected date').should('exist');
    cy.contains('2023-06-22').should('exist');

    // Click booking button and verify URL includes the selected date
    cy.contains('Book Now').click();
    cy.url().should('include', '/book?trip=trip1&date=2023-06-22');
  });
});
