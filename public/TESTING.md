# Southwest Vacations Testing Guide

This document provides a comprehensive overview of the testing strategy for the Southwest Vacations booking application, covering all testing frameworks and approaches used in the project.

## Testing Architecture

The Southwest Vacations application follows a comprehensive multi-level testing approach:

1. **Unit & Integration Tests**: Using Jest and React Testing Library
2. **End-to-End (E2E) Tests**: Using Cypress for user journey testing
3. **Visual & Interactive Tests**: Using Playwright for cross-browser testing and complex interactions
4. **API & Service Tests**: Using dedicated tooling for backend service verification

## Test Suite Organization

| Framework  | Test Count | Directory          | Purpose                                                      |
| ---------- | ---------- | ------------------ | ------------------------------------------------------------ |
| Jest       | 160+       | `src/**/__tests__` | Unit/integration testing of components, hooks, and utilities |
| Cypress    | 24+        | `cypress/e2e`      | End-to-end testing of critical user journeys                 |
| Playwright | 17+        | `tests/`           | Cross-browser testing and complex interactions               |

## Running Tests

### All Tests (Full Suite)

To run the complete test suite (recommended before any significant deployment):

```bash
./run-all-tests.sh
```

This will:

1. Start all required servers (frontend, backend, webhook)
2. Run Jest tests with coverage reporting
3. Run Cypress tests in headless mode
4. Run Playwright tests across browsers
5. Generate a consolidated test report
6. Display test success metrics on the startup page

### Jest Unit Tests

For rapid development feedback loop:

```bash
# Run all Jest tests
npm test

# Watch mode for development
npm run test:watch

# With coverage report
npm run test:coverage
```

### Cypress E2E Tests

```bash
# Run all Cypress tests headlessly
npm run cypress:run

# Open Cypress Test Runner UI
npm run cypress

# Run a specific test file
npm run cypress:run -- --spec "cypress/e2e/booking-flow.cy.ts"
```

### Playwright Tests

```bash
# Run all Playwright tests
npm run test:pw

# Run with UI
npm run test:pw:ui

# Run specific tests
npm run test:pw:login
npm run test:pw:features
```

## Critical User Journeys

The following critical journeys are tested across multiple frameworks:

| User Journey              | Jest | Cypress | Playwright |
| ------------------------- | ---- | ------- | ---------- |
| Authentication (Login)    | ✅   | ✅      | ✅         |
| Trip Search & Filtering   | ✅   | ✅      | ✅         |
| Booking Creation          | ✅   | ✅      | ✅         |
| Multi-Passenger Booking   | ✅   | ✅      | ✅         |
| Multi-Destination Booking | ❌   | ✅      | ✅         |
| Booking Management        | ✅   | ✅      | ✅         |
| Payment Processing        | ❌   | ✅      | ✅         |
| Admin Dashboard           | ✅   | ✅      | ❌         |
| Training Certification    | ❌   | ✅      | ✅         |
| AI Assistant              | ✅   | ✅      | ✅         |

## Cypress Test Suite

### User Authentication Tests

- `auth.cy.ts`: Tests login, registration and authentication flows
- `simple-login-test.cy.ts`: Basic login functionality verification

### Booking Flow Tests

- `booking-flow.cy.js`: Simple booking creation flow
- `booking-end-to-end.cy.ts`: Complete booking flow from search to confirmation
- `complete-booking-flow.cy.ts`: End-to-end booking with all options
- `multi-passenger-booking.cy.ts`: Adding multiple passengers to a booking
- `multi-location-trip.cy.ts`: Creating multi-destination bookings

### User Journey Tests

- `accountManagementJourney.cy.ts`: Account creation and management
- `basicJourney.cy.ts`: Basic user journey through the application
- `corporateJourney.cy.ts`: Corporate booking user journeys
- `familyVacationJourney.cy.ts`: Family vacation booking scenarios
- `lastMinuteDealJourney.cy.ts`: Last-minute deals booking flow
- `loyaltyProgramJourney.cy.ts`: Loyalty program member journeys
- `searchFilterJourney.cy.ts`: Search and filtering journeys

### Feature-Specific Tests

- `dateSelectionTest.cy.ts`: Date selector component testing
- `homePage.cy.ts`: Home page functionality and navigation
- `promotions-flow.cy.js`: Promotions and discount application
- `search-filters.cy.ts`: Advanced search filter functionality
- `training-certification.cy.ts`: Employee training and certification
- `tripDetails.cy.ts`: Trip details page functionality

## Playwright Test Suite

### Authentication Tests

- `login.spec.ts`: Thorough login form testing including validation
- `login-basic.spec.ts`: Basic authentication verification

### Booking Management

- `booking-management.spec.ts`: Admin booking management functionality
- `multi-passenger-booking.spec.ts`: Multiple passenger booking flows
- `multi-location-booking.spec.ts`: Multiple destination booking flows
- `payment-processing.spec.ts`: Payment form and processing verification

### Feature Tests

- `ai-assistant.spec.ts`: AI assistant interaction and responses
- `basic-ui.spec.ts`: Core UI functionality and responsiveness
- `error-handling.spec.ts`: Error state handling and recovery
- `search-filters.spec.ts`: Search functionality and filters
- `training-certification.spec.ts`: Training module completion flows
- `booking-visual.test.ts`: Visual verification of booking interfaces

## Mocking Strategy

Our testing approach uses several mocking strategies:

1. **API Mocks**: Using MSW (Mock Service Worker) for Jest tests and direct route handlers for E2E tests
2. **Auth State Mocks**: Simulating different authentication states
3. **Test Data**: Using fixtures in `cypress/fixtures` and `tests/fixtures`
4. **Service Workers**: Mocking network requests and simulating offline mode
5. **Visual Snapshots**: For UI regression testing

## Test Coverage

Current test coverage metrics:

- **Unit/Integration Tests**: 86% line coverage, 78% branch coverage
- **E2E Test Coverage**: 92% of critical user journeys
- **Component Coverage**: 90% of UI components have tests

Coverage reports can be found in:

- Jest: `coverage/lcov-report/index.html`
- Cypress: `cypress/coverage/lcov-report/index.html`
- Consolidated: `coverage-report/index.html` (after running full test suite)

## Visual Testing Server

The application includes a visual test server that provides a dashboard for viewing test results:

```bash
npm run test:viz
```

This server:

- Displays real-time test execution
- Provides video recordings of failed tests
- Shows visual diffs for UI regression tests
- Tracks test history over time

## Test Driven Development

When adding new features:

1. Start by writing tests for the expected behavior
2. Run tests to verify they fail (red)
3. Implement the feature minimally to make tests pass (green)
4. Refactor code while keeping tests passing (refactor)
5. Add to the appropriate test suites (Jest, Cypress, Playwright)

## Continuous Integration

Tests are automatically run in the CI/CD pipeline:

1. Jest tests run on every pull request
2. Cypress tests run on feature branches
3. Full test suite runs before deployment to staging
4. Visual regression tests run before production deployment

## Troubleshooting Tests

If tests are failing:

1. Check the test logs in the appropriate directory
2. Use the visual test server to identify issues
3. Run the specific failing test with debugging enabled
4. Check for environment-specific issues
5. Verify mock data is current

To fix backend-related test issues:

```bash
npm run fix:backend
```

## Future Test Enhancements

Planned improvements to the test suite:

1. Expanded API contract testing
2. Performance testing integration
3. Accessibility testing integration
4. Enhanced visual regression testing
5. Mobile device testing expansion

For questions about testing, contact the QA team at testing@southwestvacations.com.
