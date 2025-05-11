#!/bin/bash

# Start the development server in the background
echo "Starting development server..."
npm run dev &

# Store the PID of the dev server
DEV_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 10

# Run Cypress tests
echo "Running Cypress tests..."
npx cypress run --spec "cypress/e2e/simple-test.cy.ts" --headless --browser electron

# Store the exit code of the Cypress command
CYPRESS_EXIT_CODE=$?

# Kill the development server
echo "Shutting down development server..."
kill $DEV_PID

# Exit with the same status as Cypress
exit $CYPRESS_EXIT_CODE 