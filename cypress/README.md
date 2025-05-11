# Southwest Vacations Cypress Tests

## End-to-End Booking Tests

These tests verify the complete customer journey, from selecting a trip to completing a booking and checking it in the "Manage Vacations" section.

### Prerequisites

- Node.js 14+ installed
- npm or yarn

### Running the Tests

**Option 1: Using the Cypress Test Runner**

```bash
# Open Cypress Test Runner
npx cypress open
```

Then select "E2E Testing" and choose the "booking-end-to-end.cy.ts" test to run.

**Option 2: Running from Command Line**

```bash
# Run the booking end-to-end tests directly
node cypress/run-booking-tests.js
```

**Option 3: Using npm scripts**

```bash
# Run all E2E tests
npm run test:e2e

# Run only booking flow tests
npm run test:booking
```

## Test Coverage

The booking end-to-end tests cover:

1. **Trip Selection**: Selecting a trip from the homepage
2. **Date Selection**: Selecting a date on the trip details page
3. **Authentication**: Logging in to the system
4. **Booking Flow**: Completing the booking form
5. **Confirmation**: Receiving a booking confirmation
6. **Vacation Management**: Checking the booking in the "Manage Vacations" section

## Troubleshooting

If tests are failing, check:

1. Mock data in `cypress/fixtures/` directory
2. Network request mocks in the test files
3. Data-testid attributes in your components

For more information, see the [Cypress Documentation](https://docs.cypress.io/).
