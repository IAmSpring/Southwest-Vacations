#!/bin/bash

# Southwest Vacations Startup Script
# This script initializes the database, runs tests, and starts the application with proper logging

# Set the script to exit immediately if any command fails
set -e

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create log directory if it doesn't exist
mkdir -p logs

# Timestamp function for logging
timestamp() {
  date +"%Y-%m-%d %H:%M:%S"
}

# Main log file
MAIN_LOG="logs/startup-$(date +%Y%m%d-%H%M%S).log"
BACKEND_LOG="logs/backend-$(date +%Y%m%d-%H%M%S).log"
FRONTEND_LOG="logs/frontend-$(date +%Y%m%d-%H%M%S).log"
TEST_LOG="logs/test-$(date +%Y%m%d-%H%M%S).log"

# Log function
log() {
  local level=$1
  local message=$2
  local color=$3
  echo -e "${color}[$(timestamp)] [${level}] ${message}${NC}"
  echo "[$(timestamp)] [${level}] ${message}" >> "$MAIN_LOG"
}

# Log info
info() {
  log "INFO" "$1" "$GREEN"
}

# Log warning
warn() {
  log "WARN" "$1" "$YELLOW"
}

# Log error
error() {
  log "ERROR" "$1" "$RED"
}

# Function to check if a port is in use
is_port_in_use() {
  local port=$1
  if command -v lsof >/dev/null 2>&1; then
    lsof -i :"$port" >/dev/null 2>&1
    return $?
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tuln | grep -q ":$port"
    return $?
  else
    warn "Cannot check if port $port is in use, neither lsof nor netstat is available"
    return 0
  fi
}

# Function to check and kill processes on a port
kill_process_on_port() {
  local port=$1
  
  if command -v lsof >/dev/null 2>&1; then
    local pid=$(lsof -ti :"$port")
    if [ -n "$pid" ]; then
      warn "Killing process $pid on port $port"
      kill -9 "$pid" 2>/dev/null || true
    fi
  elif command -v netstat >/dev/null 2>&1 && command -v grep >/dev/null 2>&1 && command -v awk >/dev/null 2>&1; then
    local pid=$(netstat -tuln | grep :"$port" | awk '{print $7}' | cut -d'/' -f1)
    if [ -n "$pid" ]; then
      warn "Killing process $pid on port $port"
      kill -9 "$pid" 2>/dev/null || true
    fi
  else
    warn "Cannot kill process on port $port, required commands not available"
  fi
}

# Function to check if Node.js and npm are installed
check_node() {
  info "Checking Node.js and npm installation..."
  
  if ! command -v node >/dev/null 2>&1; then
    error "Node.js is not installed. Please install Node.js version 16 or higher."
    exit 1
  fi
  
  if ! command -v npm >/dev/null 2>&1; then
    error "npm is not installed. Please install npm."
    exit 1
  fi
  
  local node_version=$(node -v | cut -d 'v' -f 2)
  local major_version=$(echo "$node_version" | cut -d '.' -f 1)
  
  info "Node.js version: $node_version"
  info "npm version: $(npm -v)"
  
  if [ "$major_version" -lt 16 ]; then
    warn "Node.js version is less than 16. Some features may not work correctly."
  else
    info "Node.js version is compatible."
  fi
}

# Function to check and install dependencies
check_dependencies() {
  info "Checking npm dependencies..."
  
  # Check if node_modules directory exists
  if [ ! -d "node_modules" ]; then
    info "Installing dependencies..."
    npm install
  else
    info "Dependencies already installed. Checking for updates..."
    npm outdated --depth=0
  fi
  
  # Check mock-backend dependencies
  if [ -d "mock-backend" ] && [ -f "mock-backend/package.json" ]; then
    if [ ! -d "mock-backend/node_modules" ]; then
      info "Installing mock-backend dependencies..."
      (cd mock-backend && npm install)
    fi
  fi
}

# Function to initialize database
initialize_database() {
  info "Initializing database..."
  
  # Create data directory if it doesn't exist
  mkdir -p data
  
  # Check if database file exists
  if [ ! -f "data/db.json" ]; then
    info "Creating new database file..."
    echo "{}" > data/db.json
    
    # Seed the database
    if [ -f "mock-backend/seedData.json" ]; then
      info "Seeding database with initial data..."
      cp mock-backend/seedData.json data/db.json
    fi
  else
    info "Database file already exists."
  fi
  
  # Make sure data directory has proper permissions
  chmod -R 755 data
}

# Function to run tests
run_tests() {
  if [ "$SKIP_TESTS" == "true" ]; then
    warn "Skipping tests as requested..."
    return 0
  fi
  
  info "Running basic tests..."
  
  # Create test directory if it doesn't exist
  mkdir -p test-results
  
  # Run basic system tests
  info "Running system check..."
  node scripts/test-system.js --check > "$TEST_LOG" 2>&1
  
  if [ $? -ne 0 ]; then
    error "System check failed. Check $TEST_LOG for details."
    return 1
  else
    info "System check passed."
  fi
  
  # Only run additional tests if requested
  if [ "$RUN_ALL_TESTS" == "true" ]; then
    info "Running all tests..."
    npm test >> "$TEST_LOG" 2>&1
    
    if [ $? -ne 0 ]; then
      error "Tests failed. Check $TEST_LOG for details."
      return 1
    else
      info "All tests passed."
    fi
  fi
  
  return 0
}

# Function to start the backend
start_backend() {
  info "Starting backend server..."
  
  # Check if port 4000 is in use
  if is_port_in_use 4000; then
    warn "Port 4000 is already in use. Attempting to kill existing process..."
    kill_process_on_port 4000
    sleep 2
  fi
  
  # Start the backend server
  node --loader ts-node/esm mock-backend/index.ts > "$BACKEND_LOG" 2>&1 &
  BACKEND_PID=$!
  
  info "Backend started with PID: $BACKEND_PID"
  
  # Wait for backend to start
  info "Waiting for backend to start..."
  local attempts=0
  local max_attempts=30
  
  while ! curl -s http://localhost:4000/health >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [ $attempts -ge $max_attempts ]; then
      error "Backend failed to start after $max_attempts attempts"
      kill -9 $BACKEND_PID 2>/dev/null || true
      exit 1
    fi
    echo -n "."
    sleep 1
  done
  
  echo ""
  info "Backend server started successfully and is healthy."
}

# Function to start the frontend
start_frontend() {
  info "Starting frontend server..."
  
  # Check if port 5173 is in use
  if is_port_in_use 5173; then
    warn "Port 5173 is already in use. Attempting to kill existing process..."
    kill_process_on_port 5173
    sleep 2
  fi
  
  # Start the frontend server
  npm run dev:frontend > "$FRONTEND_LOG" 2>&1 &
  FRONTEND_PID=$!
  
  info "Frontend started with PID: $FRONTEND_PID"
  
  # Wait for frontend to start
  info "Waiting for frontend to start..."
  local attempts=0
  local max_attempts=30
  
  while ! curl -s http://localhost:5173 >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [ $attempts -ge $max_attempts ]; then
      error "Frontend failed to start after $max_attempts attempts"
      kill -9 $FRONTEND_PID 2>/dev/null || true
      kill -9 $BACKEND_PID 2>/dev/null || true
      exit 1
    fi
    echo -n "."
    sleep 1
  done
  
  echo ""
  info "Frontend server started successfully."
}

# Function to display application URLs
show_application_info() {
  echo ""
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${BLUE}    Southwest Vacations Started Successfully${NC}"
  echo -e "${BLUE}=============================================${NC}"
  echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
  echo -e "${GREEN}Backend API:${NC} http://localhost:4000"
  echo -e "${GREEN}Log files:${NC}"
  echo -e "  - Main log: ${MAIN_LOG}"
  echo -e "  - Backend log: ${BACKEND_LOG}"
  echo -e "  - Frontend log: ${FRONTEND_LOG}"
  echo -e "  - Test log: ${TEST_LOG}"
  echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
  echo -e "${BLUE}=============================================${NC}"
  echo ""
}

# Process command line arguments
SKIP_TESTS="false"
RUN_ALL_TESTS="false"

for arg in "$@"; do
  case $arg in
    --skip-tests)
      SKIP_TESTS="true"
      shift
      ;;
    --all-tests)
      RUN_ALL_TESTS="true"
      shift
      ;;
    *)
      # Unknown option
      ;;
  esac
done

# Main execution
info "Starting Southwest Vacations application..."
info "Environment: $([ "$NODE_ENV" == "production" ] && echo "Production" || echo "Development")"

# Run initialization steps
check_node
check_dependencies
initialize_database
run_tests

# Start servers
start_backend
start_frontend

# Show application information
show_application_info

# Handle graceful shutdown
trap cleanup_and_exit INT TERM
cleanup_and_exit() {
  echo ""
  info "Shutting down servers..."
  kill -9 $FRONTEND_PID 2>/dev/null || true
  kill -9 $BACKEND_PID 2>/dev/null || true
  info "Servers stopped successfully."
  exit 0
}

# Keep the script running to show logs
tail -f "$BACKEND_LOG" "$FRONTEND_LOG" 