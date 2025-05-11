#!/bin/bash

# Enhanced script to run Playwright tests with proper database and server initialization

# Set up color variables for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to clean up processes on exit
cleanup() {
  echo -e "\n${YELLOW}Cleaning up processes...${NC}"
  lsof -ti:5173,4000 | xargs kill -9 2>/dev/null || echo "No processes to kill"
  if [[ -n "$SERVER_PID" ]]; then
    echo -e "${YELLOW}Stopping backend server (PID: $SERVER_PID)...${NC}"
    kill $SERVER_PID &> /dev/null || true
  fi
  if [[ -n "$FRONTEND_PID" ]]; then
    echo -e "${YELLOW}Stopping frontend server (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID &> /dev/null || true
  fi
  echo -e "${BLUE}Test run complete.${NC}"
  exit $TEST_EXIT_CODE
}

# Set up trap to catch interrupts and call cleanup
trap cleanup EXIT INT TERM

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}║${YELLOW}       Southwest Vacations Enhanced Test Runner         ${BLUE}║${NC}"
echo -e "${BLUE}║                                                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if node and npm are available
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

# Set working directory to project root
cd "$(dirname "$0")/.." || exit 1

# Kill any existing processes on our ports
echo -e "${YELLOW}Killing any existing processes on ports 5173 and 4000...${NC}"
lsof -ti:5173,4000 | xargs kill -9 2>/dev/null || echo "No processes found on ports 5173 and 4000"

# Ensure database directory exists
mkdir -p data

# Fix database permissions and initialize test data
echo -e "${YELLOW}Initializing test database...${NC}"
node scripts/fix-backend.js > logs/database-init.log 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}Database initialization failed${NC}"
    cat logs/database-init.log
    exit 1
fi

echo -e "${GREEN}Database initialized successfully${NC}"

# Start our simple backend server
echo -e "${YELLOW}Starting simplified backend server...${NC}"
node simple-backend.js > logs/backend.log 2>&1 &
SERVER_PID=$!

# Wait for backend server to start
echo -e "${YELLOW}Waiting for backend server to start...${NC}"
timeout=10
while ! curl -s http://localhost:4000/health > /dev/null && [ $timeout -gt 0 ]; do
    echo -n "."
    sleep 1
    ((timeout--))
done
echo ""

if ! curl -s http://localhost:4000/health > /dev/null; then
    echo -e "${RED}Backend server failed to start within timeout period${NC}"
    cat logs/backend.log
    exit 1
fi

echo -e "${GREEN}Backend server started successfully with PID: ${SERVER_PID}${NC}"
echo -e "${CYAN}Backend server log: $(pwd)/logs/backend.log${NC}"

# Start frontend server
echo -e "${YELLOW}Starting frontend server...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend server to start
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
timeout=20
while ! curl -s http://localhost:5173 > /dev/null && [ $timeout -gt 0 ]; do
    echo -n "."
    sleep 1
    ((timeout--))
done
echo ""

if ! curl -s http://localhost:5173 > /dev/null; then
    echo -e "${RED}Frontend server failed to start within timeout period${NC}"
    cat logs/frontend.log
    exit 1
fi

echo -e "${GREEN}Frontend server started successfully with PID: ${FRONTEND_PID}${NC}"
echo -e "${CYAN}Frontend server log: $(pwd)/logs/frontend.log${NC}"

# Create test result directory if it doesn't exist
mkdir -p test-results

echo -e "${YELLOW}Starting tests...${NC}"
echo -e "${BLUE}╭────────────────────────────────────────────────────────╮${NC}"
echo -e "${BLUE}│${YELLOW}             Running Playwright Tests                  ${BLUE}│${NC}"
echo -e "${BLUE}╰────────────────────────────────────────────────────────╯${NC}"

# Run either filtered tests or all tests
if [[ "$1" == "--filter" && -n "$2" ]]; then
    echo -e "${CYAN}Running filtered tests matching: ${2}${NC}"
    npx playwright test --grep="$2" --reporter=html,list
elif [[ "$1" == "--file" && -n "$2" ]]; then
    echo -e "${CYAN}Running specific test file: ${2}${NC}"
    npx playwright test "$2" --reporter=html,list
elif [[ "$1" == "--ui" ]]; then
    # Run with UI mode
    echo -e "${CYAN}Running tests in UI mode${NC}"
    npx playwright test --ui
else
    # Run all tests with detailed reporting
    echo -e "${CYAN}Running all tests${NC}"
    npx playwright test --reporter=html,list
fi

TEST_EXIT_CODE=$?

# Show test report based on exit code
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╭────────────────────────────────────────────────────────╮${NC}"
    echo -e "${GREEN}│                All tests passed successfully!            │${NC}"
    echo -e "${GREEN}╰────────────────────────────────────────────────────────╯${NC}"
else
    echo -e "${RED}╭────────────────────────────────────────────────────────╮${NC}"
    echo -e "${RED}│              Some tests failed. Check report!           │${NC}"
    echo -e "${RED}╰────────────────────────────────────────────────────────╯${NC}"
    echo -e "${YELLOW}Opening test report...${NC}"
    npx playwright show-report
fi

# The cleanup function will handle stopping servers
exit $TEST_EXIT_CODE 