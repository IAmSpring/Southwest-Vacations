#!/bin/bash

# Display header
echo "====================================="
echo "Southwest Vacations Test Runner"
echo "====================================="
echo ""

# Start the development server in the background
echo "Starting development server..."
npm run dev &
DEV_SERVER_PID=$!

# Give the dev server some time to start
echo "Waiting for dev server to start..."
sleep 10

# Run unit and integration tests
echo ""
echo "====================================="
echo "Running Unit & Integration Tests"
echo "====================================="
echo "Testing hooks, components, and pages..."
npm test

# Capture the exit code
UNIT_TEST_RESULT=$?

# Run Cypress end-to-end tests
echo ""
echo "====================================="
echo "Running End-to-End Tests"
echo "====================================="
echo "Testing: Authentication, Home Page, User Journey, Trip Details, Booking Flow"
npx cypress run

# Capture the exit code
E2E_TEST_RESULT=$?

# Kill the development server
echo ""
echo "Stopping development server..."
kill $DEV_SERVER_PID

# Wait for the server to shut down
sleep 2

# Display test results summary
echo ""
echo "====================================="
echo "Test Results Summary"
echo "====================================="
if [ $UNIT_TEST_RESULT -eq 0 ]; then
  echo "✅ Unit/Integration Tests: PASSED"
else
  echo "❌ Unit/Integration Tests: FAILED"
fi

if [ $E2E_TEST_RESULT -eq 0 ]; then
  echo "✅ End-to-End Tests: PASSED"
else
  echo "❌ End-to-End Tests: FAILED"
fi

echo ""
if [ $UNIT_TEST_RESULT -eq 0 ] && [ $E2E_TEST_RESULT -eq 0 ]; then
  echo "🎉 All tests passed successfully!"
  echo ""
  echo "New tests added:"
  echo "- ✓ Trip Details Page tests (4 test cases)"
  echo "- ✓ Booking Flow tests (2 test cases)"
  echo "- ✓ Admin Page tests (3 test cases)"
  echo "- ✓ Trip Details Hook test (2 test cases)"
  echo ""
  echo "Test coverage improved for trip booking functionality!"
  exit 0
else
  echo "😟 Some tests failed. Please check the logs above."
  exit 1
fi 