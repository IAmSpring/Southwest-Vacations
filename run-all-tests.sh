#!/bin/bash

# Colors for better output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Divider for visual separation in console output
DIVIDER="========================================================="

# Start with an informative banner
echo -e "${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🧪 Southwest Vacations - Comprehensive Test Suite${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

# Initialize result counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Create necessary directories
echo -e "${BLUE}📁 Creating test result directories...${NC}"
mkdir -p test-results/combined-report
mkdir -p coverage-report
mkdir -p logs

# Cleanup function to stop all processes before exiting
cleanup() {
    echo -e "\n${BLUE}🧹 Cleaning up processes...${NC}"
    pkill -f "node.*mock-backend" || true
    pkill -f "npm run dev:frontend" || true
    pkill -f "node.*webhook-server" || true
    pkill -f "cypress" || true
    pkill -f "playwright" || true
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Setup error handling
handle_error() {
    echo -e "${RED}❌ Error: $1${NC}"
    cleanup
    exit 1
}

# Register cleanup function to run on script exit
trap cleanup EXIT

# Clean up any existing processes
echo -e "${BLUE}🧹 Cleaning up any existing processes...${NC}"
pkill -f "node" || true
sleep 2

# Start Backend Server
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🚀 Starting Backend Server${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

echo -e "${BLUE}▶️ Starting mock backend...${NC}"
npm run dev:backend > logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
echo -e "${BLUE}⏳ Waiting for backend server to start...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while ! curl -s http://localhost:4000/health > /dev/null; do
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        handle_error "Backend server failed to start in time"
    fi
    sleep 1
    echo -n "."
done

echo -e "\n${GREEN}✅ Backend server started successfully on port 4000${NC}"

# Start Frontend Server
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🚀 Starting Frontend Server${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

echo -e "${BLUE}▶️ Starting frontend application...${NC}"
npm run dev:frontend > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo -e "${BLUE}⏳ Waiting for frontend server to start...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while ! curl -s http://localhost:5173 > /dev/null; do
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        handle_error "Frontend server failed to start in time"
    fi
    sleep 1
    echo -n "."
done

echo -e "\n${GREEN}✅ Frontend server started successfully on port 5173${NC}"

# Start Webhook Server
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🚀 Starting Webhook Server${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

echo -e "${BLUE}▶️ Starting webhook server...${NC}"
npm run webhook:dev > logs/webhook.log 2>&1 &
WEBHOOK_PID=$!

# Wait for webhook server to be ready
echo -e "${BLUE}⏳ Waiting for webhook server to start...${NC}"
sleep 3
echo -e "${GREEN}✅ Webhook server started${NC}"

# Giving servers a moment to fully initialize
echo -e "${BLUE}⏳ Allowing servers to fully initialize...${NC}"
sleep 3

# Run Jest Tests
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🧪 Running Jest Unit & Integration Tests${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

echo -e "${BLUE}▶️ Running Jest tests with coverage...${NC}"
npm test -- --coverage --silent > logs/jest.log

if [ $? -eq 0 ]; then
    JEST_TESTS=$(grep "Tests:" logs/jest.log | awk '{print $2}')
    JEST_PASSED=$(grep "Tests:" logs/jest.log | awk '{print $4}')
    JEST_FAILED=$(grep "Tests:" logs/jest.log | awk '{print $6}')
    JEST_SKIPPED=$(grep "Tests:" logs/jest.log | awk '{print $8}')
    
    TOTAL_TESTS=$((TOTAL_TESTS + JEST_TESTS))
    PASSED_TESTS=$((PASSED_TESTS + JEST_PASSED))
    FAILED_TESTS=$((FAILED_TESTS + JEST_FAILED))
    SKIPPED_TESTS=$((SKIPPED_TESTS + JEST_SKIPPED))
    
    echo -e "${GREEN}✅ Jest tests completed${NC}"
    echo -e "   Tests: ${JEST_TESTS}, Passed: ${JEST_PASSED}, Failed: ${JEST_FAILED}, Skipped: ${JEST_SKIPPED}"
else
    echo -e "${RED}❌ Jest tests failed${NC}"
    cat logs/jest.log
fi

# Run Cypress Tests
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🧪 Running Cypress E2E Tests${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

echo -e "${BLUE}▶️ Starting Cypress tests in headless mode...${NC}"
npm run cypress:run > logs/cypress.log 2>&1 

if [ $? -eq 0 ]; then
    CYPRESS_TESTS=$(grep "All specs passed" logs/cypress.log | grep -o '[0-9]\+ passing' | grep -o '[0-9]\+')
    CYPRESS_SKIPPED=$(grep -o '[0-9]\+ pending' logs/cypress.log | grep -o '[0-9]\+' || echo "0")
    CYPRESS_FAILED=$(grep -o '[0-9]\+ failing' logs/cypress.log | grep -o '[0-9]\+' || echo "0")
    
    TOTAL_TESTS=$((TOTAL_TESTS + CYPRESS_TESTS + CYPRESS_SKIPPED + CYPRESS_FAILED))
    PASSED_TESTS=$((PASSED_TESTS + CYPRESS_TESTS))
    FAILED_TESTS=$((FAILED_TESTS + CYPRESS_FAILED))
    SKIPPED_TESTS=$((SKIPPED_TESTS + CYPRESS_SKIPPED))
    
    echo -e "${GREEN}✅ Cypress tests completed${NC}"
    echo -e "   Tests: $((CYPRESS_TESTS + CYPRESS_SKIPPED + CYPRESS_FAILED)), Passed: ${CYPRESS_TESTS}, Failed: ${CYPRESS_FAILED}, Skipped: ${CYPRESS_SKIPPED}"
else
    echo -e "${YELLOW}⚠️ Some Cypress tests failed${NC}"
    CYPRESS_TESTS=$(grep -o '[0-9]\+ passing' logs/cypress.log | grep -o '[0-9]\+' || echo "0")
    CYPRESS_SKIPPED=$(grep -o '[0-9]\+ pending' logs/cypress.log | grep -o '[0-9]\+' || echo "0")
    CYPRESS_FAILED=$(grep -o '[0-9]\+ failing' logs/cypress.log | grep -o '[0-9]\+' || echo "0")
    
    TOTAL_TESTS=$((TOTAL_TESTS + CYPRESS_TESTS + CYPRESS_SKIPPED + CYPRESS_FAILED))
    PASSED_TESTS=$((PASSED_TESTS + CYPRESS_TESTS))
    FAILED_TESTS=$((FAILED_TESTS + CYPRESS_FAILED))
    SKIPPED_TESTS=$((SKIPPED_TESTS + CYPRESS_SKIPPED))
    
    echo -e "   Tests: $((CYPRESS_TESTS + CYPRESS_SKIPPED + CYPRESS_FAILED)), Passed: ${CYPRESS_TESTS}, Failed: ${CYPRESS_FAILED}, Skipped: ${CYPRESS_SKIPPED}"
fi

# Run Playwright Tests
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}🧪 Running Playwright Tests${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

echo -e "${BLUE}▶️ Starting Playwright tests...${NC}"
npm run test:pw > logs/playwright.log 2>&1

if [ $? -eq 0 ]; then
    PW_TESTS=$(grep " passed" logs/playwright.log | awk '{print $1}')
    
    TOTAL_TESTS=$((TOTAL_TESTS + PW_TESTS))
    PASSED_TESTS=$((PASSED_TESTS + PW_TESTS))
    
    echo -e "${GREEN}✅ Playwright tests completed${NC}"
    echo -e "   Tests: ${PW_TESTS}, Passed: ${PW_TESTS}, Failed: 0, Skipped: 0"
else
    # Try to parse results even on partial success
    PW_PASSED=$(grep " passed" logs/playwright.log | awk '{print $1}' || echo "0")
    PW_FAILED=$(grep " failed" logs/playwright.log | awk '{print $1}' || echo "0")
    PW_SKIPPED=$(grep " skipped" logs/playwright.log | awk '{print $1}' || echo "0")
    
    if [ -z "$PW_PASSED" ]; then PW_PASSED=0; fi
    if [ -z "$PW_FAILED" ]; then PW_FAILED=0; fi
    if [ -z "$PW_SKIPPED" ]; then PW_SKIPPED=0; fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + PW_PASSED + PW_FAILED + PW_SKIPPED))
    PASSED_TESTS=$((PASSED_TESTS + PW_PASSED))
    FAILED_TESTS=$((FAILED_TESTS + PW_FAILED))
    SKIPPED_TESTS=$((SKIPPED_TESTS + PW_SKIPPED))
    
    echo -e "${YELLOW}⚠️ Some Playwright tests failed${NC}"
    echo -e "   Tests: $((PW_PASSED + PW_FAILED + PW_SKIPPED)), Passed: ${PW_PASSED}, Failed: ${PW_FAILED}, Skipped: ${PW_SKIPPED}"
fi

# Generate Final Report
echo -e "\n${CYAN}$DIVIDER${NC}"
echo -e "${CYAN}📊 Test Summary Report${NC}"
echo -e "${CYAN}$DIVIDER${NC}"

PASS_PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

echo -e "${BLUE}📝 Overall Test Results:${NC}"
echo -e "   Total Tests: ${TOTAL_TESTS}"
echo -e "   Passed Tests: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "   Failed Tests: ${RED}${FAILED_TESTS}${NC}"
echo -e "   Skipped Tests: ${YELLOW}${SKIPPED_TESTS}${NC}"
echo -e "   Pass Rate: ${PASS_PERCENTAGE}%"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}✅ All tests passed successfully!${NC}"
elif [ $PASS_PERCENTAGE -ge 90 ]; then
    echo -e "\n${YELLOW}⚠️ Most tests passed (${PASS_PERCENTAGE}%), but there were ${FAILED_TESTS} failures.${NC}"
    echo -e "   Check the logs for details on failing tests."
else
    echo -e "\n${RED}❌ Test suite has significant failures (${FAILED_TESTS} tests failed)${NC}"
    echo -e "   Review the logs and fix failing tests."
fi

# Provide Open URL for Test Results
echo -e "\n${BLUE}🌐 Test Results Available:${NC}"
echo -e "   Jest Coverage: ${CYAN}file://$PWD/coverage/lcov-report/index.html${NC}"
echo -e "   Cypress Results: ${CYAN}file://$PWD/cypress/screenshots${NC}"
echo -e "   Playwright Report: ${CYAN}file://$PWD/playwright-report/index.html${NC}"

# Give instructions for viewing the app
echo -e "\n${BLUE}🌐 Application URLs:${NC}"
echo -e "   Frontend: ${CYAN}http://localhost:5173${NC}"
echo -e "   Backend API: ${CYAN}http://localhost:4000${NC}"
echo -e "   System Health: ${CYAN}http://localhost:5173/system-health${NC}"

# Exit with success only if all tests passed
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}✅ Test suite completed successfully${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️ Test suite completed with some failures${NC}"
    exit 1
fi 