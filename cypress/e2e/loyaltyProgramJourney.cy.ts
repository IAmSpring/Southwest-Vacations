/// <reference types="cypress" />

describe('Loyalty Program Journey', () => {
  beforeEach(() => {
    // Mock auth with loyalty member account
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: {
        token: 'loyal-token',
        user: {
          id: 'user456',
          username: 'loyalmember',
          email: 'loyal@example.com',
          loyaltyInfo: {
            memberId: 'SWV-GOLD-123456',
            tier: 'Gold',
            points: 25000,
            status: 'active',
            memberSince: '2023-01-15',
            nextTier: {
              name: 'Platinum',
              pointsNeeded: 10000,
            },
          },
        },
      },
    }).as('loyaltyLogin');

    // Mock loyalty dashboard data
    cy.intercept('GET', '/api/loyalty/dashboard', {
      statusCode: 200,
      body: {
        currentPoints: 25000,
        pointsHistory: [
          {
            id: 'p1',
            date: '2024-01-15',
            description: 'Florida Beach Vacation',
            points: 5000,
            type: 'earned',
          },
          {
            id: 'p2',
            date: '2024-02-20',
            description: 'Vegas Weekend',
            points: 3000,
            type: 'earned',
          },
          {
            id: 'p3',
            date: '2024-03-10',
            description: 'Flight Upgrade',
            points: -2000,
            type: 'redeemed',
          },
          {
            id: 'p4',
            date: '2024-04-05',
            description: 'New York City Trip',
            points: 7000,
            type: 'earned',
          },
          {
            id: 'p5',
            date: '2024-05-15',
            description: 'Room Upgrade',
            points: -1500,
            type: 'redeemed',
          },
        ],
        upcomingRewards: [
          {
            id: 'r1',
            name: 'Free Night Stay',
            pointsCost: 15000,
            expiry: '2025-01-01',
            eligible: true,
          },
          {
            id: 'r2',
            name: 'Priority Boarding',
            pointsCost: 5000,
            expiry: '2025-01-01',
            eligible: true,
          },
          {
            id: 'r3',
            name: 'Companion Ticket',
            pointsCost: 30000,
            expiry: '2025-01-01',
            eligible: false,
          },
        ],
        membershipBenefits: [
          'Priority Check-in',
          'Extra Luggage Allowance',
          'Room Upgrades when available',
          'Late Check-out',
          '10% Bonus Points on Bookings',
        ],
      },
    }).as('loyaltyDashboard');

    // Mock rewards redemption endpoint
    cy.intercept('POST', '/api/loyalty/redeem', {
      statusCode: 200,
      body: {
        success: true,
        rewardId: 'r1',
        rewardCode: 'FREE-NIGHT-XYZ123',
        remainingPoints: 10000,
        message: 'Reward successfully redeemed!',
      },
    }).as('redeemReward');

    // Mock points earning preview
    cy.intercept('GET', '/api/loyalty/trip-points-preview*', {
      statusCode: 200,
      body: {
        tripId: 'trip123',
        basePoints: 4000,
        tierBonus: 400,
        specialPromoBonus: 1000,
        totalPointsEarnable: 5400,
      },
    }).as('pointsPreview');

    // Mock trip booking with loyalty option
    cy.intercept('POST', '/api/bookings', {
      statusCode: 200,
      body: {
        id: 'booking-loyal-123',
        confirmationCode: 'SWL78901',
        status: 'confirmed',
        totalPrice: 1299,
        pointsEarned: 5400,
        loyaltyBenefitsApplied: ['Priority Check-in', 'Room Upgrade'],
        createdAt: new Date().toISOString(),
      },
    }).as('createBooking');

    // Login with loyalty account
    cy.visit('/login');
    cy.contains('Login').click();
    cy.get('input[name="email"]').type('loyal@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loyaltyLogin');
  });

  it('should view loyalty dashboard and redeem a reward', () => {
    // Navigate to loyalty dashboard
    cy.visit('/account/loyalty');
    cy.wait('@loyaltyDashboard');

    // Verify loyalty information is displayed
    cy.contains('Gold Member').should('exist');
    cy.contains('25,000 points').should('exist');
    cy.contains('SWV-GOLD-123456').should('exist');

    // Verify points history section
    cy.contains('Points History').should('exist');
    cy.contains('Florida Beach Vacation').should('exist');
    cy.contains('+5,000').should('exist');
    cy.contains('Flight Upgrade').should('exist');
    cy.contains('-2,000').should('exist');

    // View available rewards
    cy.contains('Available Rewards').click();

    // Check reward details
    cy.contains('Free Night Stay').should('exist');
    cy.contains('15,000 points').should('exist');

    // Redeem a reward
    cy.get('[data-testid="redeem-reward-r1"]').click();

    // Confirm redemption
    cy.get('[data-testid="confirm-redemption"]').click();
    cy.wait('@redeemReward');

    // Verify confirmation
    cy.contains('Reward Redeemed Successfully').should('exist');
    cy.contains('FREE-NIGHT-XYZ123').should('exist');
    cy.contains('10,000 points').should('exist'); // updated balance

    // Verify reward in account
    cy.visit('/account/rewards');
    cy.contains('Free Night Stay').should('exist');
    cy.contains('FREE-NIGHT-XYZ123').should('exist');
    cy.contains('Valid until').should('exist');
  });

  it('should book a trip with loyalty points benefits', () => {
    // Browse trips
    cy.visit('/');

    // Select a trip
    cy.contains('Popular Destinations').should('exist');
    cy.contains('New York City').click();

    // View trip details
    cy.contains('Book Now').click();

    // Verify loyalty points preview
    cy.wait('@pointsPreview');
    cy.contains('Loyalty Benefits Available').should('exist');
    cy.contains("You'll earn 5,400 points with this booking").should('exist');

    // Fill booking details
    cy.get('[data-testid="booking-form"]').should('exist');
    cy.get('[data-testid="round-trip-btn"]').click();

    cy.get('input[name="fullName"]').type('Loyal Customer');
    cy.get('input[name="email"]').type('loyal@example.com');
    cy.get('input[name="travelers"]').clear().type('2');

    // Select dates
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 2);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    cy.get('input[name="startDate"]').type(formattedStartDate);

    const returnDate = new Date(startDate);
    returnDate.setDate(returnDate.getDate() + 5);
    const formattedReturnDate = returnDate.toISOString().split('T')[0];
    cy.get('input[name="returnDate"]').type(formattedReturnDate);

    // Apply loyalty benefits
    cy.get('[data-testid="apply-loyalty-benefits"]').check();

    // Select room upgrade
    cy.get('[data-testid="select-benefits"]').click();
    cy.get('[data-testid="benefit-room-upgrade"]').check();
    cy.get('[data-testid="benefit-priority-checkin"]').check();
    cy.contains('Continue').click();

    // Verify loyalty discount applied
    cy.contains('Gold Member Discount').should('exist');
    cy.contains('-$129.90').should('exist'); // 10% of price

    // Complete booking
    cy.contains('Complete Booking').click();
    cy.wait('@createBooking');

    // Verify confirmation with loyalty info
    cy.url().should('include', '/confirmation');
    cy.contains('Booking Confirmed').should('exist');
    cy.contains('SWL78901').should('exist');
    cy.contains('You earned 5,400 points').should('exist');
    cy.contains('Gold Member Benefits Applied').should('exist');
    cy.contains('Priority Check-in').should('exist');
    cy.contains('Room Upgrade').should('exist');
  });

  it('should view tier status and progress to next tier', () => {
    // Visit loyalty status page
    cy.visit('/account/loyalty/status');

    // Check current tier and progress
    cy.contains('Gold Member').should('exist');
    cy.contains('10,000 more points to Platinum').should('exist');

    // View tier benefits comparison
    cy.contains('View Tier Benefits').click();

    // Verify tier comparison table
    cy.get('[data-testid="tier-comparison"]').should('exist');
    cy.contains('Gold').should('exist');
    cy.contains('Platinum').should('exist');

    // Check differences highlighted
    cy.contains('Priority Security Lane').should('exist');
    cy.contains('Guaranteed Room Availability').should('exist');

    // Check activities to earn more points
    cy.contains('Ways to Earn Points Faster').click();

    // Verify point earning opportunities
    cy.contains('Book a Premium Trip').should('exist');
    cy.contains('Up to 10,000 points').should('exist');
    cy.contains('Southwest Credit Card').should('exist');
    cy.contains('3,000 bonus points').should('exist');

    // Check referral program
    cy.contains('Refer a Friend').click();

    // Verify referral details
    cy.contains('Refer friends and earn 2,500 points').should('exist');
    cy.get('[data-testid="referral-link"]').should('exist');
    cy.get('[data-testid="copy-link"]').click();
    cy.contains('Link copied to clipboard').should('exist');
  });
});
