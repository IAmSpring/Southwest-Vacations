#!/bin/bash
# Kill any existing backend processes
pkill -f "node simple-backend.js" || true
pkill -f "node simple-test-backend.js" || true

# Start the simplified backend for tests
node simple-test-backend.js
