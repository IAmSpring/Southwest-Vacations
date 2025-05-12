#!/bin/bash

# Make script exit on first error
set -e

echo "🧪 Running Southwest Vacations Playwright Login Test"

# Kill any processes that might be using our ports
echo "Cleaning up any existing processes..."
pkill -f "node simple-backend.js" || true
pkill -f "node simple-test-backend.js" || true
pkill -f "npm run dev" || true
pkill -f "vite" || true
sleep 2

# Start the simple backend server
echo "Starting simple test backend server..."
node simple-test-backend.js &
BACKEND_PID=$!

echo "Waiting for backend server to start..."
sleep 5

# Start the frontend development server
echo "Starting frontend server..."
npm run dev:frontend &
FRONTEND_PID=$!

echo "Waiting for frontend server to start..."
sleep 10

# Run the Playwright test
echo "🟣 Running Playwright login tests..."
npx playwright test tests/login-basic.spec.ts --headed
TEST_EXIT_CODE=$?

# Clean up
echo "Cleaning up processes..."
kill $BACKEND_PID || true
kill $FRONTEND_PID || true
sleep 1

if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo "✅ Playwright login tests PASSED"
else
  echo "❌ Playwright login tests FAILED with exit code $TEST_EXIT_CODE"
fi

exit $TEST_EXIT_CODE 