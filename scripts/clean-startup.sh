#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                 Southwest Vacations App                    ║${RESET}"
echo -e "${BLUE}║               Clean Startup Sequence v1.0                  ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${RESET}"

# Function to check if a port is in use
check_port() {
    local port=$1
    lsof -i:$port > /dev/null 2>&1
    return $?
}

# Function to kill process using a specific port
kill_port_process() {
    local port=$1
    echo -e "${YELLOW}Killing process on port $port...${RESET}"
    lsof -ti:$port | xargs kill -9 > /dev/null 2>&1
    sleep 1
    echo -e "${GREEN}✓ Port $port is now available${RESET}"
}

# Step 1: Clean up any running processes
echo -e "\n${BLUE}[1/5]${RESET} Checking for running processes..."

# Check backend port (4000)
if check_port 4000; then
    echo -e "${YELLOW}⚠ Port 4000 is in use. Cleaning up...${RESET}"
    kill_port_process 4000
else
    echo -e "${GREEN}✓ Port 4000 is available${RESET}"
fi

# Check frontend ports (5173 and 5174 - Vite might use either)
if check_port 5173; then
    echo -e "${YELLOW}⚠ Port 5173 is in use. Cleaning up...${RESET}"
    kill_port_process 5173
else
    echo -e "${GREEN}✓ Port 5173 is available${RESET}"
fi

if check_port 5174; then
    echo -e "${YELLOW}⚠ Port 5174 is in use. Cleaning up...${RESET}"
    kill_port_process 5174
else
    echo -e "${GREEN}✓ Port 5174 is available${RESET}"
fi

# Step 2: Start the AI-enabled backend
echo -e "\n${BLUE}[2/5]${RESET} Starting AI-enabled backend server..."
node ai-test-backend.js > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to start up...${RESET}"
MAX_RETRIES=10
RETRY_COUNT=0
until curl -s http://localhost:4000/health > /dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e "${RED}✗ Failed to start backend after $MAX_RETRIES attempts${RESET}"
        kill $BACKEND_PID
        exit 1
    fi
    echo -e "${YELLOW}Waiting for backend (attempt $RETRY_COUNT/$MAX_RETRIES)...${RESET}"
    sleep 1
done

echo -e "${GREEN}✓ Backend server started successfully on port 4000${RESET}"

# Step 3: Start frontend
echo -e "\n${BLUE}[3/5]${RESET} Starting frontend development server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to be ready (checking either 5173 or 5174)
echo -e "${YELLOW}Waiting for frontend to start up...${RESET}"
MAX_RETRIES=20
RETRY_COUNT=0
until check_port 5173 || check_port 5174; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e "${RED}✗ Failed to start frontend after $MAX_RETRIES attempts${RESET}"
        kill $BACKEND_PID
        kill $FRONTEND_PID
        exit 1
    fi
    echo -e "${YELLOW}Waiting for frontend (attempt $RETRY_COUNT/$MAX_RETRIES)...${RESET}"
    sleep 1
done

# Determine which port the frontend is using
if check_port 5173; then
    FRONTEND_PORT=5173
else
    FRONTEND_PORT=5174
fi

echo -e "${GREEN}✓ Frontend server started successfully on port $FRONTEND_PORT${RESET}"

# Step 4: Run AI Assistant tests
echo -e "\n${BLUE}[4/5]${RESET} Running AI Assistant tests..."
node scripts/test-ai-assistant.js > ai-test.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ AI Assistant tests passed successfully${RESET}"
else
    echo -e "${RED}✗ AI Assistant tests failed - Check ai-test.log for details${RESET}"
fi

# Step 5: System health check
echo -e "\n${BLUE}[5/5]${RESET} Performing system health check..."
curl -s http://localhost:4000/health | grep -q "ok"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend health check passed${RESET}"
else
    echo -e "${RED}✗ Backend health check failed${RESET}"
fi

# Check if both services are running
if ps -p $BACKEND_PID > /dev/null && ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ All services are running${RESET}"
else
    echo -e "${RED}✗ Some services have stopped${RESET}"
fi

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                   Startup Complete                          ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${RESET}"
echo -e "${GREEN}Backend:${RESET} http://localhost:4000"
echo -e "${GREEN}Frontend:${RESET} http://localhost:$FRONTEND_PORT"
echo -e "${YELLOW}Logs:${RESET}"
echo -e "  - Backend: backend.log"
echo -e "  - Frontend: frontend.log"
echo -e "  - AI Tests: ai-test.log"
echo -e "\n${YELLOW}Press Ctrl+C to stop all services${RESET}"

# Keep script running to allow easy shutdown
wait $FRONTEND_PID
kill $BACKEND_PID
echo -e "\n${RED}Services stopped${RESET}" 