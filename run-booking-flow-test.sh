#!/bin/bash

# Make sure the script stops on first error
set -e

echo "🚀 Starting Southwest Vacations booking flow test..."

# Kill any processes that might be using our ports
echo "Cleaning up any existing processes..."
pkill -f "node simple-test-backend.js" || true
pkill -f "npm run dev" || true

# Start the simple backend server
echo "Starting simple backend server..."
node simple-test-backend.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend server to start..."
sleep 3

# Start the frontend development server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend server to start..."
sleep 10

# Run the Cypress test for booking flow
echo "Running Cypress booking flow test..."
npx cypress run --spec "cypress/e2e/complete-booking-flow.cy.ts" --browser chrome

# Save the test exit code
TEST_EXIT_CODE=$?

# Clean up processes
echo "Cleaning up processes..."
kill $BACKEND_PID || true
kill $FRONTEND_PID || true

# Report results
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo "✅ Booking flow test completed successfully!"
else
  echo "❌ Booking flow test failed with exit code $TEST_EXIT_CODE"
fi

exit $TEST_EXIT_CODE 