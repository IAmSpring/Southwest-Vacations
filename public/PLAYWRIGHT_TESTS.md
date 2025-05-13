# Southwest Vacations Playwright Test Suite

This document describes the Playwright test suite for the Southwest Vacations internal booking system application.

## Test Suites Overview

### Login Tests (`tests/login.spec.ts`)

- Verifies all login form elements are correctly displayed
- Tests quick login options functionality
- Validates user interface elements such as notes section with test credentials
- Handles and reports backend server errors gracefully
- Skips tests that require successful authentication when backend issues occur

### Multi-Passenger Booking (`tests/multi-passenger-booking.spec.ts`)

- Tests the ability to add multiple passengers to a single booking
- Verifies passenger form fields are properly rendered
- Tests calculation of total price for multiple passengers
- Validates removal of additional passengers
- Includes fallbacks for backend failures

### Search Filters (`tests/search-filters.spec.ts`)

- Tests filtering results by destination
- Verifies date range filtering functionality
- Tests price range filters
- Validates filter reset capabilities
- Tests combined filtering with multiple criteria

### Multi-Location Booking (`tests/multi-location-booking.spec.ts`)

- Tests ability to add multiple destinations to a single booking
- Validates date range validation between multiple locations
- Tests trip duration calculations for multi-destination trips

### Training Certification (`tests/training-certification.spec.ts`)

- Tests employee training module display
- Verifies training completion workflows
- Tests certification tracking
- Validates training assignment functionality
- Tests certification report generation

### Payment Processing (`tests/payment-processing.spec.ts`) - NEW

- Tests payment form field rendering
- Validates credit card information entry and validation
- Tests discount code application and removal
- Verifies complete payment flow and booking confirmation
- Tests graceful handling of payment failures

### Booking Management (`tests/booking-management.spec.ts`) - NEW

- Tests the booking management interface for administrators
- Verifies booking details viewing
- Tests booking cancellation functionality
- Validates refund processing for cancelled bookings
- Tests booking modification capabilities
- Ensures cancellation policy and fee calculation works correctly

### Error Handling (`tests/error-handling.spec.ts`) - NEW

- Tests graceful handling of server connectivity issues
- Validates invalid credential error messaging
- Tests form validation for login fields
- Verifies session expiration handling
- Tests database availability issue handling
- Validates prevention of rapid-fire form submissions
- Tests recovery from 500 errors
- Verifies offline mode functionality
- Tests input sanitization for security

## Running the Tests

The test suite includes a script that handles test environment setup, including database initialization:

```bash
./scripts/run-playwright-tests.sh
```

For interactive mode with UI:

```bash
./scripts/run-playwright-tests.sh --ui
```

## Test Structure

Each test file follows a similar structure:

1. `beforeEach` hook that handles navigation and authentication
2. Tests for basic UI rendering that should always pass
3. Functional tests that may be skipped if backend is unavailable
4. Error handling and edge case tests

## Critical Test Cases for Launch

The following test cases are most critical to ensure before launch:

1. Login functionality with proper error handling
2. Booking creation with multiple passengers
3. Payment processing with validation
4. Booking cancellation and refund processing
5. Error handling for network issues and backend failures

## Current Status

Many tests are currently skipped due to backend issues, specifically:

- 500 errors during login attempts
- Database initialization issues

The fix-backend.js script resolves most of these issues by properly initializing the database with test users.

Even with backend issues, the tests verify critical UI components are rendered correctly, ensuring that the frontend remains functional and ready for integration with a fixed backend.

## Next Steps

1. Run the full test suite after backend fixes
2. Enable any skipped tests once backend is stable
3. Add additional test cases for authorization levels and role-based access
