# Southwest Vacations Testing Guide

This document describes the testing strategy and setup for the Southwest Vacations booking application.

## Testing Structure

The application uses a comprehensive testing approach with multiple testing layers:

### Unit & Integration Tests

Unit and integration tests are implemented using Jest and React Testing Library. These tests focus on:

- **Component Tests**: Verify that UI components render correctly with proper styling and interactions
- **Hook Tests**: Ensure custom hooks provide the expected functionality and handle various states
- **Utility Tests**: Validate helper functions and utilities work as expected

Unit tests are located in `__tests__` directories adjacent to the code they're testing.

### End-to-End Tests

End-to-end tests use Cypress to simulate real user interactions with the application. These tests cover critical user journeys such as:

- Authentication (login, logout)
- Browsing the home page and trip catalog
- Viewing trip details
- Completing the booking flow
- Admin dashboard access and functionality

E2E tests are located in the `cypress/e2e` directory.

## Running Tests

### All Tests at Once

To run all tests (unit, integration, and E2E), use the test runner script:

```bash
./fix-all-tests.sh
```

This script:

1. Starts the development server
2. Runs all Jest tests
3. Runs all Cypress E2E tests
4. Provides a summary of test results

### Unit & Integration Tests Only

To run only the Jest tests:

```bash
npm test
```

To run tests for a specific file or pattern:

```bash
npm test -- --testPathPattern=HomePage
```

### E2E Tests Only

To run Cypress tests in headless mode:

```bash
npx cypress run
```

To open the Cypress Test Runner UI:

```bash
npx cypress open
```

## Test Coverage

Test coverage reports are generated after running the Jest tests. The coverage report can be found in the `coverage` directory.

To view the HTML coverage report:

```bash
open coverage/lcov-report/index.html
```

## Recently Added Tests

Recent additions to the test suite include:

### Unit Tests

- AdminPage component tests
- useTripDetails hook tests

### E2E Tests

- Trip Details page tests
- Complete booking flow tests (one-way and round-trip)

## Mocking Strategy

The application uses various mocking approaches:

1. **API Mocks**: HTTP requests are mocked using Jest for unit tests and Cypress interceptors for E2E tests
2. **Context Mocks**: React contexts like AuthContext are mocked to test different authentication states
3. **Mock Data**: Test data is provided through fixtures in the `cypress/fixtures` directory

## Continuous Integration

Tests are automatically run as part of the CI pipeline to ensure code quality before deployment.
