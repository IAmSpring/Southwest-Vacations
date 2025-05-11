/// <reference types="cypress" />

describe('User Account Management Journey', () => {
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
          firstName: 'Test',
          lastName: 'User',
          phone: '5551234567',
        },
      },
    }).as('login');

    // Mock user profile data
    cy.intercept('GET', '/api/users/profile', {
      statusCode: 200,
      body: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '5551234567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        preferences: {
          newsletterSubscribed: true,
          dealAlerts: true,
          travelPreferences: ['beach', 'city'],
        },
        accountCreatedAt: '2022-01-01T00:00:00.000Z',
      },
    }).as('profileData');

    // Mock bookings history
    cy.intercept('GET', '/api/users/bookings', {
      statusCode: 200,
      body: [
        {
          id: 'booking1',
          destination: 'Miami, FL',
          departureDate: '2023-07-15',
          returnDate: '2023-07-22',
          status: 'completed',
          confirmationCode: 'SWV12345',
          totalPrice: 1299,
          travelers: 2,
        },
        {
          id: 'booking2',
          destination: 'Las Vegas, NV',
          departureDate: '2023-10-10',
          returnDate: '2023-10-13',
          status: 'completed',
          confirmationCode: 'SWV67890',
          totalPrice: 899,
          travelers: 1,
        },
        {
          id: 'booking3',
          destination: 'Orlando, FL',
          departureDate: '2025-05-20',
          returnDate: '2025-05-27',
          status: 'upcoming',
          confirmationCode: 'SWV54321',
          totalPrice: 1599,
          travelers: 4,
        },
      ],
    }).as('bookingsHistory');

    // Mock profile update
    cy.intercept('PUT', '/api/users/profile', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Profile updated successfully',
      },
    }).as('updateProfile');

    // Mock password change
    cy.intercept('PUT', '/api/users/password', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Password changed successfully',
      },
    }).as('changePassword');

    // Mock email preferences update
    cy.intercept('PUT', '/api/users/preferences', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Preferences updated successfully',
      },
    }).as('updatePreferences');

    // Login first
    cy.visit('/login');
    cy.contains('Test User Login').click();
    cy.wait('@login');
  });

  it('should view and update profile information', () => {
    // Navigate to account page
    cy.visit('/account');
    cy.wait('@profileData');

    // Verify current profile information
    cy.contains('Account Details').should('exist');
    cy.contains('Test User').should('exist');
    cy.contains('test@example.com').should('exist');
    cy.contains('123 Main St').should('exist');

    // Edit profile
    cy.contains('Edit Profile').click();

    // Update information
    cy.get('input[name="firstName"]').clear().type('Updated');
    cy.get('input[name="lastName"]').clear().type('Name');
    cy.get('input[name="phone"]').clear().type('5559876543');

    // Update address
    cy.get('input[name="street"]').clear().type('456 Oak Avenue');
    cy.get('input[name="city"]').clear().type('New City');
    cy.get('select[name="state"]').select('NY');
    cy.get('input[name="zipCode"]').clear().type('10001');

    // Save changes
    cy.get('[data-testid="save-profile"]').click();
    cy.wait('@updateProfile');

    // Verify success message
    cy.contains('Profile updated successfully').should('exist');

    // Mock updated profile data
    cy.intercept('GET', '/api/users/profile', {
      statusCode: 200,
      body: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Name',
        phone: '5559876543',
        address: {
          street: '456 Oak Avenue',
          city: 'New City',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        preferences: {
          newsletterSubscribed: true,
          dealAlerts: true,
          travelPreferences: ['beach', 'city'],
        },
        accountCreatedAt: '2022-01-01T00:00:00.000Z',
      },
    }).as('updatedProfileData');

    // Refresh profile page
    cy.visit('/account');
    cy.wait('@updatedProfileData');

    // Verify updated information
    cy.contains('Updated Name').should('exist');
    cy.contains('456 Oak Avenue').should('exist');
    cy.contains('New City, NY 10001').should('exist');
  });

  it('should view booking history and manage upcoming trips', () => {
    // Navigate to bookings page
    cy.visit('/account/bookings');
    cy.wait('@bookingsHistory');

    // Check for booking history sections
    cy.contains('Upcoming Trips').should('exist');
    cy.contains('Past Trips').should('exist');

    // Verify upcoming trip is displayed
    cy.contains('Orlando, FL').should('exist');
    cy.contains('May 20 - 27, 2025').should('exist');
    cy.contains('SWV54321').should('exist');

    // Verify past trips
    cy.contains('Miami, FL').should('exist');
    cy.contains('July 15 - 22, 2023').should('exist');
    cy.contains('SWV12345').should('exist');

    cy.contains('Las Vegas, NV').should('exist');
    cy.contains('October 10 - 13, 2023').should('exist');
    cy.contains('SWV67890').should('exist');

    // View upcoming trip details
    cy.contains('Orlando, FL').click();

    // Mock trip details API
    cy.intercept('GET', '/api/bookings/booking3', {
      statusCode: 200,
      body: {
        id: 'booking3',
        destination: 'Orlando, FL',
        departureDate: '2025-05-20',
        returnDate: '2025-05-27',
        status: 'upcoming',
        confirmationCode: 'SWV54321',
        totalPrice: 1599,
        travelers: 4,
        hotel: 'Family Resort & Spa',
        room: 'Family Suite',
        flight: {
          outbound: {
            flightNumber: 'SW123',
            departureTime: '2025-05-20T08:30:00Z',
            arrivalTime: '2025-05-20T11:45:00Z',
          },
          return: {
            flightNumber: 'SW456',
            departureTime: '2025-05-27T14:15:00Z',
            arrivalTime: '2025-05-27T17:30:00Z',
          },
        },
        activities: ['Theme Park Tickets', 'Character Breakfast'],
        specialRequests: 'Adjoining rooms preferred',
      },
    }).as('tripDetails');

    // Check trip details
    cy.contains('Booking Details').should('exist');
    cy.contains('SWV54321').should('exist');
    cy.contains('Orlando, FL').should('exist');
    cy.contains('4 Travelers').should('exist');
    cy.contains('Family Resort & Spa').should('exist');

    // Mock seat selection
    cy.intercept('GET', '/api/flights/SW123/seats', {
      statusCode: 200,
      body: {
        availableSeats: ['5A', '5B', '5C', '5D', '6A', '6B', '6C', '6D'],
      },
    }).as('flightSeats');

    // Add seat selection
    cy.contains('Select Seats').click();
    cy.wait('@flightSeats');

    // Select seats
    cy.get('[data-testid="seat-5A"]').click();
    cy.get('[data-testid="seat-5B"]').click();
    cy.get('[data-testid="seat-5C"]').click();
    cy.get('[data-testid="seat-5D"]').click();

    // Mock seat selection confirmation
    cy.intercept('POST', '/api/bookings/booking3/seats', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Seats selected successfully',
      },
    }).as('selectSeats');

    // Save seat selection
    cy.get('[data-testid="save-seats"]').click();
    cy.wait('@selectSeats');

    // Verify confirmation
    cy.contains('Seats selected successfully').should('exist');
  });

  it('should update communication preferences', () => {
    // Navigate to preferences page
    cy.visit('/account/preferences');
    cy.wait('@profileData');

    // Verify current preferences
    cy.get('[data-testid="newsletter-subscription"]').should('be.checked');
    cy.get('[data-testid="deal-alerts"]').should('be.checked');
    cy.get('[data-testid="beach-preference"]').should('be.checked');
    cy.get('[data-testid="city-preference"]').should('be.checked');

    // Update preferences
    cy.get('[data-testid="newsletter-subscription"]').uncheck();
    cy.get('[data-testid="mountain-preference"]').check();
    cy.get('[data-testid="city-preference"]').uncheck();

    // Set frequency
    cy.get('select[name="emailFrequency"]').select('Weekly');

    // Save preferences
    cy.get('[data-testid="save-preferences"]').click();
    cy.wait('@updatePreferences');

    // Verify success message
    cy.contains('Preferences updated successfully').should('exist');

    // Mock updated preferences
    cy.intercept('GET', '/api/users/profile', {
      statusCode: 200,
      body: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phone: '5551234567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        preferences: {
          newsletterSubscribed: false,
          dealAlerts: true,
          emailFrequency: 'weekly',
          travelPreferences: ['beach', 'mountain'],
        },
        accountCreatedAt: '2022-01-01T00:00:00.000Z',
      },
    }).as('updatedPreferences');

    // Refresh preferences page
    cy.visit('/account/preferences');
    cy.wait('@updatedPreferences');

    // Verify updated preferences
    cy.get('[data-testid="newsletter-subscription"]').should('not.be.checked');
    cy.get('[data-testid="deal-alerts"]').should('be.checked');
    cy.get('[data-testid="beach-preference"]').should('be.checked');
    cy.get('[data-testid="mountain-preference"]').should('be.checked');
    cy.get('[data-testid="city-preference"]').should('not.be.checked');
    cy.get('select[name="emailFrequency"]').should('have.value', 'weekly');
  });

  it('should change password successfully', () => {
    // Navigate to security page
    cy.visit('/account/security');

    // Change password
    cy.get('input[name="currentPassword"]').type('oldpassword');
    cy.get('input[name="newPassword"]').type('newSecurePassword123!');
    cy.get('input[name="confirmPassword"]').type('newSecurePassword123!');

    // Submit change
    cy.get('[data-testid="change-password"]').click();
    cy.wait('@changePassword');

    // Verify success message
    cy.contains('Password changed successfully').should('exist');

    // Verify security requirements met
    cy.get('[data-testid="password-length"]').should('have.class', 'text-green-500');
    cy.get('[data-testid="password-uppercase"]').should('have.class', 'text-green-500');
    cy.get('[data-testid="password-number"]').should('have.class', 'text-green-500');
    cy.get('[data-testid="password-special"]').should('have.class', 'text-green-500');
  });
});
