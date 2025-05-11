/// <reference types="cypress" />

describe('Date Selection Flow', () => {
  beforeEach(() => {
    // Mock trip details API response with available dates
    cy.intercept('GET', '/api/trips/trip1', {
      statusCode: 200,
      body: {
        id: 'trip1',
        destination: 'Orlando, Florida',
        description:
          'Experience the magic of Disney World and other theme parks in Orlando, Florida.',
        price: 899,
        imageUrl: 'orlando.jpg',
        category: 'family',
        duration: 7,
        datesAvailable: ['2023-06-15', '2023-06-22', '2023-07-01', '2023-07-15'],
      },
    }).as('getTripDetails');

    // Mock bookings API to prevent actual booking
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: { success: true, bookingId: 'test-booking-123' },
    }).as('submitBooking');

    // Visit the trip details page
    cy.visit('/trip/trip1');

    // Wait for API request to complete
    cy.wait('@getTripDetails');
  });

  it('selects a date on trip details page and passes it to booking form', () => {
    // Verify available dates are displayed
    cy.contains('Available Dates').should('exist');

    // First date should be selected by default
    cy.get('[data-testid="date-option-0"]').should('have.attr', 'aria-selected', 'true');

    // Select the second date
    cy.get('[data-testid="date-option-1"]').click();

    // Verify it's selected
    cy.get('[data-testid="date-option-1"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-testid="date-option-0"]').should('have.attr', 'aria-selected', 'false');

    // Store the selected date text
    cy.get('[data-testid="date-option-1"]').invoke('text').as('selectedDate');

    // Click Book Now button
    cy.contains('Book Now').click();

    // On booking page, verify the selected date is displayed
    cy.url().should('include', '/book?trip=trip1&date=');

    // Check that the selected date is shown in the booking form
    cy.get('@selectedDate').then(selectedDate => {
      cy.contains('Selected Date:').next().should('contain', selectedDate);
    });

    // Verify the departure date input is pre-filled and highlighted
    cy.get('[data-testid="departure-date-input"]').should('have.value');
    cy.get('.date-selected').should('exist');

    // Fill out a test booking
    cy.get('input[name="fullName"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="travelers"]').clear().type('2');

    // Submit the booking form
    cy.get('[data-testid="submit-booking-btn"]').click();

    // Verify booking was submitted with the selected date
    cy.wait('@submitBooking').then(interception => {
      expect(interception.request.body).to.have.property('startDate');
      cy.get('@selectedDate').then(selectedDate => {
        expect(interception.request.body.startDate).to.include(selectedDate);
      });
    });

    // Verify redirection to confirmation page
    cy.url().should('include', '/confirmation');
  });
});
