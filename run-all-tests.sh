#!/bin/bash

# Make script exit on first error
set -e

echo "🧪 Starting Southwest Vacations E2E Test Suite"

# Kill any processes that might be using our ports
echo "Cleaning up any existing processes..."
pkill -f "node simple-backend.js" || true
pkill -f "npm run dev" || true
sleep 1

# Create directories for test results if they don't exist
echo "Creating test result directories..."
mkdir -p test-results
mkdir -p cypress/screenshots
mkdir -p playwright-report
mkdir -p temp # For mock-backend temp files

# Start the simple backend server
echo "Starting simple backend server..."
node simple-backend.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend server to start..."
sleep 3

# Check if backend started successfully
if ! curl -s http://localhost:4000/health > /dev/null; then
  echo "❌ Backend server failed to start properly"
  kill $BACKEND_PID || true
  exit 1
else
  echo "✅ Backend server started successfully"
fi

# Start the frontend development server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend server to start..."
sleep 10

# Run the Cypress test
echo "🟢 Running Cypress booking flow test..."
npx cypress run --spec "cypress/e2e/complete-booking-flow.cy.ts" --browser chrome

# Save the Cypress test result
CYPRESS_EXIT_CODE=$?

# Run the Playwright visual test
echo "🟣 Running Playwright visual tests..."
npx playwright test tests/booking-visual.test.ts

# Save the Playwright test result
PLAYWRIGHT_EXIT_CODE=$?

# Clean up processes
echo "Cleaning up processes..."
kill $BACKEND_PID || true
kill $FRONTEND_PID || true

# Report results
echo ""
echo "📊 Test Results Summary:"
echo "------------------------"

if [ $CYPRESS_EXIT_CODE -eq 0 ]; then
  echo "✅ Cypress tests: PASSED"
else
  echo "❌ Cypress tests: FAILED with exit code $CYPRESS_EXIT_CODE"
fi

if [ $PLAYWRIGHT_EXIT_CODE -eq 0 ]; then
  echo "✅ Playwright tests: PASSED"
else
  echo "❌ Playwright tests: FAILED with exit code $PLAYWRIGHT_EXIT_CODE"
fi

echo ""
echo "Test reports available at:"
echo "- Cypress screenshots: cypress/screenshots"
echo "- Playwright report: playwright-report"
echo "- Visual test screenshots: test-results"

# Exit with failure if any tests failed
if [ $CYPRESS_EXIT_CODE -ne 0 ] || [ $PLAYWRIGHT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

exit 0 