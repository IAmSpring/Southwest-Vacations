#!/bin/bash

# Make script exit on first error
set -e

echo "🧪 Starting Southwest Vacations E2E Test Suite"

# Kill any processes that might be using our ports
echo "Cleaning up any existing processes..."
pkill -f "node simple-backend.js" || true
pkill -f "node simple-test-backend.js" || true
pkill -f "npm run dev" || true
pkill -f "vite" || true
sleep 2

# Create directories for test results if they don't exist
echo "Creating test result directories..."
mkdir -p test-results
mkdir -p cypress/screenshots
mkdir -p playwright-report
mkdir -p temp # For temp files
mkdir -p data # For backend data

# Start the simple backend server first
echo "Starting simple test backend server..."
node simple-test-backend.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend server to start..."
sleep 5

# Check if backend started successfully
RETRY_COUNT=0
MAX_RETRIES=5
BACKEND_STARTED=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:4000/health > /dev/null; then
    echo "✅ Backend server started successfully"
    BACKEND_STARTED=true
    break
  else
    echo "Waiting for backend server... (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT+1))
    sleep 2
  fi
done

if [ "$BACKEND_STARTED" != "true" ]; then
  echo "❌ Backend server failed to start properly after $MAX_RETRIES attempts"
  kill $BACKEND_PID || true
  exit 1
fi

# Start the frontend development server
echo "Starting frontend server..."
npm run dev:frontend &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend server to start (this may take a moment)..."
sleep 15

# Check if frontend started successfully
RETRY_COUNT=0
MAX_RETRIES=5
FRONTEND_STARTED=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend server started successfully"
    FRONTEND_STARTED=true
    break
  else
    echo "Waiting for frontend server... (attempt $((RETRY_COUNT+1))/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT+1))
    sleep 5
  fi
done

if [ "$FRONTEND_STARTED" != "true" ]; then
  echo "❌ Frontend server failed to start properly after $MAX_RETRIES attempts"
  kill $BACKEND_PID || true
  kill $FRONTEND_PID || true
  exit 1
fi

# Run the tests
TEST_TYPE=${1:-"all"}

if [ "$TEST_TYPE" = "cypress" ] || [ "$TEST_TYPE" = "all" ]; then
  # Run the Cypress test with retries
  echo "🟢 Running Cypress booking flow test..."
  npx cypress run --spec "cypress/e2e/complete-booking-flow.cy.ts" --browser chrome --config retries=3
  CYPRESS_EXIT_CODE=$?
else
  CYPRESS_EXIT_CODE=0
  echo "🟡 Skipping Cypress tests"
fi

if [ "$TEST_TYPE" = "playwright" ] || [ "$TEST_TYPE" = "all" ]; then
  # Run the Playwright visual test with increased timeouts
  echo "🟣 Running Playwright visual tests..."
  PLAYWRIGHT_TIMEOUT=60000 npx playwright test tests/booking-visual.test.ts --timeout=60000
  PLAYWRIGHT_EXIT_CODE=$?
else
  PLAYWRIGHT_EXIT_CODE=0
  echo "🟡 Skipping Playwright tests"
fi

# Clean up processes
echo "Cleaning up processes..."
kill $BACKEND_PID || true
kill $FRONTEND_PID || true
sleep 1

# Report results
echo ""
echo "📊 Test Results Summary:"
echo "------------------------"

if [ "$TEST_TYPE" = "cypress" ] || [ "$TEST_TYPE" = "all" ]; then
  if [ $CYPRESS_EXIT_CODE -eq 0 ]; then
    echo "✅ Cypress tests: PASSED"
  else
    echo "❌ Cypress tests: FAILED with exit code $CYPRESS_EXIT_CODE"
  fi
fi

if [ "$TEST_TYPE" = "playwright" ] || [ "$TEST_TYPE" = "all" ]; then
  if [ $PLAYWRIGHT_EXIT_CODE -eq 0 ]; then
    echo "✅ Playwright tests: PASSED"
  else
    echo "❌ Playwright tests: FAILED with exit code $PLAYWRIGHT_EXIT_CODE"
  fi
fi

echo ""
echo "Test reports available at:"
echo "- Cypress screenshots: cypress/screenshots"
echo "- Playwright report: playwright-report"
echo "- Visual test screenshots: test-results"

# Return appropriate exit code
if [ "$TEST_TYPE" = "all" ]; then
  if [ $CYPRESS_EXIT_CODE -eq 0 ] && [ $PLAYWRIGHT_EXIT_CODE -eq 0 ]; then
    echo "All tests passed successfully!"
    exit 0
  else
    echo "Some tests failed. Check the results summary above."
    exit 1
  fi
elif [ "$TEST_TYPE" = "cypress" ]; then
  exit $CYPRESS_EXIT_CODE
elif [ "$TEST_TYPE" = "playwright" ]; then
  exit $PLAYWRIGHT_EXIT_CODE
else
  echo "Unknown test type: $TEST_TYPE"
  exit 1
fi 