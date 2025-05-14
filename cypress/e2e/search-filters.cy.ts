/// <reference types="cypress" />

describe('Search Filters Functionality', () => {
  const TEST_EMPLOYEE = {
    email: 'employee@southwestvacations.com',
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

    // Mock search results API with various properties for filtering
    cy.intercept('GET', '/api/trips/search*', {
      statusCode: 200,
      body: {
        trips: [
          {
            id: 'trip1',
            destination: 'Maui, Hawaii',
            location: {
              country: 'USA',
              region: 'Hawaii',
            },
            price: 1499.99,
            duration: 7,
            departureDate: '2025-07-10',
            returnDate: '2025-07-17',
            category: 'beach',
            rating: 4.8,
            amenities: ['pool', 'spa', 'beachfront', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['Early Bird Special', '10% Southwest Employee Discount'],
          },
          {
            id: 'trip2',
            destination: 'Las Vegas, Nevada',
            location: {
              country: 'USA',
              region: 'West',
            },
            price: 899.99,
            duration: 4,
            departureDate: '2025-08-15',
            returnDate: '2025-08-19',
            category: 'entertainment',
            rating: 4.5,
            amenities: ['pool', 'casino', 'spa', 'restaurant', 'nightclub'],
            recommended: false,
            capacity: 2,
            availableDeals: ['Last Minute Deal', 'Casino Credit'],
          },
          {
            id: 'trip3',
            destination: 'New York City, New York',
            location: {
              country: 'USA',
              region: 'East',
            },
            price: 1299.99,
            duration: 5,
            departureDate: '2025-09-20',
            returnDate: '2025-09-25',
            category: 'city',
            rating: 4.3,
            amenities: ['central location', 'restaurant', 'fitness center'],
            recommended: true,
            capacity: 3,
            availableDeals: ['City Pass Included', '15% Southwest Employee Discount'],
          },
          {
            id: 'trip4',
            destination: 'Cancun, Mexico',
            location: {
              country: 'Mexico',
              region: 'Caribbean',
            },
            price: 1099.99,
            duration: 6,
            departureDate: '2025-06-05',
            returnDate: '2025-06-11',
            category: 'beach',
            rating: 4.6,
            amenities: ['all-inclusive', 'beachfront', 'pool', 'spa', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['All-Inclusive Package', 'Free Airport Transfer'],
          },
          {
            id: 'trip5',
            destination: 'Aspen, Colorado',
            location: {
              country: 'USA',
              region: 'West',
            },
            price: 1899.99,
            duration: 7,
            departureDate: '2025-12-10',
            returnDate: '2025-12-17',
            category: 'mountain',
            rating: 4.7,
            amenities: ['ski-in/ski-out', 'fireplace', 'hot tub', 'restaurant'],
            recommended: false,
            capacity: 6,
            availableDeals: ['Early Bird Ski Package', '5% Southwest Employee Discount'],
          },
        ],
        total: 5,
        page: 1,
        totalPages: 1,
      },
    }).as('searchTrips');

    // Mock filtered search results for price range
    cy.intercept('GET', '/api/trips/search*price_min=1000&price_max=1500*', {
      statusCode: 200,
      body: {
        trips: [
          {
            id: 'trip1',
            destination: 'Maui, Hawaii',
            location: {
              country: 'USA',
              region: 'Hawaii',
            },
            price: 1499.99,
            duration: 7,
            departureDate: '2025-07-10',
            returnDate: '2025-07-17',
            category: 'beach',
            rating: 4.8,
            amenities: ['pool', 'spa', 'beachfront', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['Early Bird Special', '10% Southwest Employee Discount'],
          },
          {
            id: 'trip3',
            destination: 'New York City, New York',
            location: {
              country: 'USA',
              region: 'East',
            },
            price: 1299.99,
            duration: 5,
            departureDate: '2025-09-20',
            returnDate: '2025-09-25',
            category: 'city',
            rating: 4.3,
            amenities: ['central location', 'restaurant', 'fitness center'],
            recommended: true,
            capacity: 3,
            availableDeals: ['City Pass Included', '15% Southwest Employee Discount'],
          },
          {
            id: 'trip4',
            destination: 'Cancun, Mexico',
            location: {
              country: 'Mexico',
              region: 'Caribbean',
            },
            price: 1099.99,
            duration: 6,
            departureDate: '2025-06-05',
            returnDate: '2025-06-11',
            category: 'beach',
            rating: 4.6,
            amenities: ['all-inclusive', 'beachfront', 'pool', 'spa', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['All-Inclusive Package', 'Free Airport Transfer'],
          },
        ],
        total: 3,
        page: 1,
        totalPages: 1,
      },
    }).as('filterByPrice');

    // Mock filtered search results for category
    cy.intercept('GET', '/api/trips/search*category=beach*', {
      statusCode: 200,
      body: {
        trips: [
          {
            id: 'trip1',
            destination: 'Maui, Hawaii',
            location: {
              country: 'USA',
              region: 'Hawaii',
            },
            price: 1499.99,
            duration: 7,
            departureDate: '2025-07-10',
            returnDate: '2025-07-17',
            category: 'beach',
            rating: 4.8,
            amenities: ['pool', 'spa', 'beachfront', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['Early Bird Special', '10% Southwest Employee Discount'],
          },
          {
            id: 'trip4',
            destination: 'Cancun, Mexico',
            location: {
              country: 'Mexico',
              region: 'Caribbean',
            },
            price: 1099.99,
            duration: 6,
            departureDate: '2025-06-05',
            returnDate: '2025-06-11',
            category: 'beach',
            rating: 4.6,
            amenities: ['all-inclusive', 'beachfront', 'pool', 'spa', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['All-Inclusive Package', 'Free Airport Transfer'],
          },
        ],
        total: 2,
        page: 1,
        totalPages: 1,
      },
    }).as('filterByCategory');

    // Mock filtered search results for employee deals
    cy.intercept('GET', '/api/trips/search*employee_discount=true*', {
      statusCode: 200,
      body: {
        trips: [
          {
            id: 'trip1',
            destination: 'Maui, Hawaii',
            location: {
              country: 'USA',
              region: 'Hawaii',
            },
            price: 1499.99,
            discountedPrice: 1349.99,
            duration: 7,
            departureDate: '2025-07-10',
            returnDate: '2025-07-17',
            category: 'beach',
            rating: 4.8,
            amenities: ['pool', 'spa', 'beachfront', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['Early Bird Special', '10% Southwest Employee Discount'],
          },
          {
            id: 'trip3',
            destination: 'New York City, New York',
            location: {
              country: 'USA',
              region: 'East',
            },
            price: 1299.99,
            discountedPrice: 1104.99,
            duration: 5,
            departureDate: '2025-09-20',
            returnDate: '2025-09-25',
            category: 'city',
            rating: 4.3,
            amenities: ['central location', 'restaurant', 'fitness center'],
            recommended: true,
            capacity: 3,
            availableDeals: ['City Pass Included', '15% Southwest Employee Discount'],
          },
          {
            id: 'trip5',
            destination: 'Aspen, Colorado',
            location: {
              country: 'USA',
              region: 'West',
            },
            price: 1899.99,
            discountedPrice: 1804.99,
            duration: 7,
            departureDate: '2025-12-10',
            returnDate: '2025-12-17',
            category: 'mountain',
            rating: 4.7,
            amenities: ['ski-in/ski-out', 'fireplace', 'hot tub', 'restaurant'],
            recommended: false,
            capacity: 6,
            availableDeals: ['Early Bird Ski Package', '5% Southwest Employee Discount'],
          },
        ],
        total: 3,
        page: 1,
        totalPages: 1,
      },
    }).as('filterByEmployeeDiscount');

    // Mock combined filters
    cy.intercept('GET', '/api/trips/search*category=beach*employee_discount=true*', {
      statusCode: 200,
      body: {
        trips: [
          {
            id: 'trip1',
            destination: 'Maui, Hawaii',
            location: {
              country: 'USA',
              region: 'Hawaii',
            },
            price: 1499.99,
            discountedPrice: 1349.99,
            duration: 7,
            departureDate: '2025-07-10',
            returnDate: '2025-07-17',
            category: 'beach',
            rating: 4.8,
            amenities: ['pool', 'spa', 'beachfront', 'restaurant'],
            recommended: true,
            capacity: 4,
            availableDeals: ['Early Bird Special', '10% Southwest Employee Discount'],
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      },
    }).as('filterByCategoryAndDiscount');
  });

  it('allows filtering search results by price range', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to search page
    cy.contains('Search Vacations').click();

    // Initial search
    cy.get('[data-testid="search-input"]').type('vacation');
    cy.contains('Search').click();
    cy.wait('@searchTrips');

    // Verify initial results
    cy.contains('5 Results Found').should('exist');
    cy.contains('Maui, Hawaii').should('exist');
    cy.contains('Las Vegas, Nevada').should('exist');
    cy.contains('New York City, New York').should('exist');
    cy.contains('Cancun, Mexico').should('exist');
    cy.contains('Aspen, Colorado').should('exist');

    // Filter by price range
    cy.get('[data-testid="price-filter-min"]').clear().type('1000');
    cy.get('[data-testid="price-filter-max"]').clear().type('1500');
    cy.contains('Apply Filters').click();
    cy.wait('@filterByPrice');

    // Verify filtered results
    cy.contains('3 Results Found').should('exist');
    cy.contains('Maui, Hawaii').should('exist');
    cy.contains('New York City, New York').should('exist');
    cy.contains('Cancun, Mexico').should('exist');
    cy.contains('Las Vegas, Nevada').should('not.exist');
    cy.contains('Aspen, Colorado').should('not.exist');
  });

  it('allows filtering search results by category', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to search page
    cy.contains('Search Vacations').click();

    // Initial search
    cy.get('[data-testid="search-input"]').type('vacation');
    cy.contains('Search').click();
    cy.wait('@searchTrips');

    // Verify initial results
    cy.contains('5 Results Found').should('exist');

    // Filter by category
    cy.get('[data-testid="category-filter"]').click();
    cy.contains('Beach').click();
    cy.contains('Apply Filters').click();
    cy.wait('@filterByCategory');

    // Verify filtered results
    cy.contains('2 Results Found').should('exist');
    cy.contains('Maui, Hawaii').should('exist');
    cy.contains('Cancun, Mexico').should('exist');
    cy.contains('Las Vegas, Nevada').should('not.exist');
    cy.contains('New York City, New York').should('not.exist');
    cy.contains('Aspen, Colorado').should('not.exist');
  });

  it('allows filtering search results by employee discount', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to search page
    cy.contains('Search Vacations').click();

    // Initial search
    cy.get('[data-testid="search-input"]').type('vacation');
    cy.contains('Search').click();
    cy.wait('@searchTrips');

    // Verify initial results
    cy.contains('5 Results Found').should('exist');

    // Filter by employee discount
    cy.get('[data-testid="employee-discount-filter"]').click();
    cy.contains('Apply Filters').click();
    cy.wait('@filterByEmployeeDiscount');

    // Verify filtered results
    cy.contains('3 Results Found').should('exist');
    cy.contains('Maui, Hawaii').should('exist');
    cy.contains('New York City, New York').should('exist');
    cy.contains('Aspen, Colorado').should('exist');

    // Verify discount is displayed
    cy.contains('$1,349.99').should('exist');
    cy.contains('$1,104.99').should('exist');
    cy.contains('$1,804.99').should('exist');
  });

  it('allows combining multiple filters', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to search page
    cy.contains('Search Vacations').click();

    // Initial search
    cy.get('[data-testid="search-input"]').type('vacation');
    cy.contains('Search').click();
    cy.wait('@searchTrips');

    // Verify initial results
    cy.contains('5 Results Found').should('exist');

    // Apply multiple filters
    cy.get('[data-testid="category-filter"]').click();
    cy.contains('Beach').click();
    cy.get('[data-testid="employee-discount-filter"]').click();
    cy.contains('Apply Filters').click();
    cy.wait('@filterByCategoryAndDiscount');

    // Verify filtered results
    cy.contains('1 Result Found').should('exist');
    cy.contains('Maui, Hawaii').should('exist');
    cy.contains('$1,349.99').should('exist');
    cy.contains('10% Southwest Employee Discount').should('exist');

    // All other results should not exist
    cy.contains('Las Vegas, Nevada').should('not.exist');
    cy.contains('New York City, New York').should('not.exist');
    cy.contains('Cancun, Mexico').should('not.exist');
    cy.contains('Aspen, Colorado').should('not.exist');
  });

  it('allows clearing filters', () => {
    // Login as employee
    cy.visit('/employee-portal');
    cy.get('input[name="email"]').type(TEST_EMPLOYEE.email);
    cy.get('input[name="password"]').type(TEST_EMPLOYEE.password);
    cy.contains('Login').click();
    cy.wait('@loginEmployee');

    // Navigate to search page
    cy.contains('Search Vacations').click();

    // Initial search
    cy.get('[data-testid="search-input"]').type('vacation');
    cy.contains('Search').click();
    cy.wait('@searchTrips');

    // Apply filters
    cy.get('[data-testid="category-filter"]').click();
    cy.contains('Beach').click();
    cy.contains('Apply Filters').click();
    cy.wait('@filterByCategory');

    // Verify filtered results
    cy.contains('2 Results Found').should('exist');

    // Clear filters
    cy.contains('Clear Filters').click();
    cy.wait('@searchTrips');

    // Verify all results are shown again
    cy.contains('5 Results Found').should('exist');
    cy.contains('Maui, Hawaii').should('exist');
    cy.contains('Las Vegas, Nevada').should('exist');
    cy.contains('New York City, New York').should('exist');
    cy.contains('Cancun, Mexico').should('exist');
    cy.contains('Aspen, Colorado').should('exist');
  });
});
