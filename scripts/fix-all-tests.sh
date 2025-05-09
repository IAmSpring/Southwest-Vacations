#!/bin/bash

# Fix the db.json file
echo "}" >> data/db.json

# Run unit tests
echo "Running unit tests..."
npm test -- --testPathIgnorePatterns=e2e

# Start the dev server for Cypress
echo "Running dev server for Cypress in the background..."
npm run dev &
DEV_PID=$!

# Give the dev server time to start
echo "Waiting for dev server to start..."
sleep 10

# Run Cypress tests
echo "Running Cypress tests..."
npx cypress run --browser chrome --headless

# Kill the dev server
echo "Shutting down dev server..."
kill $DEV_PID

echo "All tests completed!" 