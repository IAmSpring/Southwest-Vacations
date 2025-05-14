# Southwest Vacations Testing Guide

This document provides information about the testing framework and instructions for running the tests for the Southwest Vacations booking application.

## Test Suite Overview

The application uses multiple testing frameworks to ensure comprehensive coverage:

1. **Cypress Tests** - For end-to-end testing of user flows
2. **Playwright Tests** - For visual testing and more complex interactions
3. **Unit Tests** - For testing individual components

## Running Tests

### Test Scripts

The following test scripts are available for running different types of tests:

1. **Run Simple Login Test**

   ```bash
   ./run-simple-test.sh
   ```

   - Runs a basic Cypress test that verifies the login functionality
   - Uses the simplified test backend

2. **Run Playwright Login Test**

   ```bash
   ./run-playwright-login.sh
   ```

   - Runs a Playwright test that verifies the login functionality
   - Useful for visual testing and DOM interaction testing

3. **Run All Tests (Fixed Version)**

   ```bash
   ./run-tests-fixed.sh
   ```

   - Runs all tests with proper setup and teardown
   - Includes both Cypress and Playwright tests
   - Generates detailed test reports
   - Options:
     - `./run-tests-fixed.sh cypress` - Run only Cypress tests
     - `./run-tests-fixed.sh playwright` - Run only Playwright tests
     - `./run-tests-fixed.sh all` (default) - Run all tests

4. **Run Fixed Backend**
   ```bash
   ./run-fixed-backend.sh
   ```
   - Starts only the simplified test backend on port 4000
   - Useful for manual testing or developing new tests

### Backend Testing

The application uses a simplified test backend (`simple-test-backend.js`) that provides:

- User authentication via JWT tokens
- Trip data management
- Booking functionality
- Favorites system
- File-based persistence in the `data/` directory

The test backend automatically seeds test data including:

- Sample user accounts
- Trip listings
- Empty bookings and favorites collections that get populated during tests

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
  - `simple-login-test.cy.ts` - Basic login test
  - `complete-booking-flow.cy.ts` - Full booking flow test
- `tests/` - Contains Playwright tests
  - `login-basic.spec.ts` - Basic login test for Playwright
  - `booking-visual.test.ts` - Visual tests for the booking flow
- `test-results/` - Visual test screenshots
- `cypress/screenshots/` - Cypress test screenshots
- `playwright-report/` - Playwright HTML reports
- `data/` - Test data storage (created automatically)

## Troubleshooting

If you encounter issues running the tests:

1. Make sure both the frontend and backend servers are not already running
2. Check that the ports 5173 (frontend) and 4000 (backend) are available
3. Ensure you have all dependencies installed by running `npm install`
4. If login tests fail:
   - Check that the test backend is properly initialized
   - Verify that the login commands correctly handle DOM detachment
   - Make sure the JWT token handling is working properly
5. For API-related issues, check the `data/` directory to ensure the JSON files are properly formatted

## Backend Architecture

The test backend implements the following API endpoints:

- **Authentication**

  - `POST /api/users/login` - Login with email and password
  - `GET /api/users/profile` - Get current user profile

- **Trips**

  - `GET /api/trips` - Get all trips
  - `GET /api/trips/:id` - Get trip details

- **Bookings**

  - `POST /api/bookings` - Create a new booking
  - `GET /api/bookings` - Get user's bookings

- **Favorites**
  - `POST /api/favorites` - Add a trip to favorites
  - `GET /api/favorites` - Get user's favorites

## Test Screenshots Viewer

The application includes a dedicated test screenshots viewer that allows you to:

1. **View test screenshots in an organized way** - Screenshots are organized by test suite in an accordion interface
2. **See test details** - Each screenshot includes information about the test name and when it was captured
3. **View full-size screenshots** - Click on any thumbnail to open a full-size view of the screenshot
4. **Filter by test framework** - Filter screenshots by specific test frameworks (Cypress, Playwright)
5. **Mark screenshots as important or reviewed** - Use the buttons on each screenshot to mark them for follow-up
6. **Persistence across sessions** - Important and reviewed marks are saved in localStorage and persist across page reloads

To access the test screenshots viewer:

1. Log in as an admin user
2. Click on your profile in the top-right corner
3. Select "Test Screenshots" from the dropdown menu
4. Use the framework tabs and accordion interface to browse through test screenshots

The screenshots viewer supports:

- Cypress end-to-end test screenshots
- Playwright test screenshots and artifacts
- Visual indicators for important test failures (yellow star icon)
- Reviewed status tracking (green checkmark icon)
- Framework-specific counts and filtering
- Improved error handling for missing screenshots with auto-retry

## Recent Improvements

- Fixed backend server startup issues related to export defaults in route files
- Created a simplified test backend with file-based storage
- Improved Cypress and Playwright test commands to handle DOM detachment
- Added robust test runner scripts with proper setup and teardown
- Implemented reliable login commands for both test frameworks
- Enhanced error handling and reporting in test scripts
- Added proper seeding of test users and trip data
- Created a visual test screenshots viewer with accordion interface
- Added features to mark screenshots as important or reviewed
- Implemented smart error handling for missing screenshot images
- Added persistent storage of screenshot review status
