# Southwest Vacations Testing Guide

This document provides information about the testing framework and instructions for running the tests for the Southwest Vacations booking application.

## Test Suite Overview

The application uses multiple testing frameworks to ensure comprehensive coverage:

1. **Cypress Tests** - For end-to-end testing of user flows
2. **Playwright Tests** - For visual testing and more complex interactions
3. **Unit Tests** - For testing individual components

## Running Tests

### Running All Tests

To run the complete test suite which includes both Cypress and Playwright tests:

```bash
./run-all-tests.sh
```

This script will:

- Start the simple backend server
- Start the frontend development server
- Run the Cypress tests
- Run the Playwright visual tests
- Generate reports in the appropriate directories

### Running Only Booking Flow Tests

To test only the booking flow functionality:

```bash
./run-booking-flow-test.sh
```

## Test Credentials

The following test accounts are available for testing:

- **Regular User**:
  - Email: test@example.com
  - Password: Password123
- **Admin User**:
  - Email: admin@example.com
  - Password: Admin123

## Test Directory Structure

- `cypress/e2e/` - Contains Cypress end-to-end tests
- `tests/` - Contains Playwright tests
- `test-results/` - Visual test screenshots
- `cypress/screenshots/` - Cypress test screenshots
- `playwright-report/` - Playwright HTML reports

## Creating New Tests

When creating new tests, follow these guidelines:

1. For **Cypress tests**:

   - Place files in `cypress/e2e/` with the `.cy.ts` extension
   - Use the existing test structure as a template

2. For **Playwright tests**:
   - Place files in `tests/` with the `.test.ts` extension
   - Use steps to organize test stages

## Troubleshooting

If you encounter issues running the tests:

1. Make sure both the frontend and backend servers are not already running
2. Check that the ports 5173 (frontend) and 4000 (backend) are available
3. Ensure you have all dependencies installed by running `npm install`

## Recent Improvements

- Added complete end-to-end testing for the booking flow
- Added visual regression testing with screenshots
- Integrated tests with the simple mock backend
