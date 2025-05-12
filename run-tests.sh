#!/bin/bash

# Start the development server in the background
echo "Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 10

# Run the tests
echo "Running tests..."
npx playwright test

# Kill the development server
echo "Shutting down development server..."
kill $DEV_PID

echo "Test run complete!" 