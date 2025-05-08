#!/bin/bash

# Southwest Vacations API Testing Script
# This script helps test various API endpoints of the Southwest Vacations application

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables
API_URL="http://localhost:4000"
AUTH_TOKEN=""
BOOKING_ID=""
FAVORITE_ID=""

# Function to show help
show_help() {
  echo -e "${CYAN}Southwest Vacations API Testing Script${NC}"
  echo ""
  echo -e "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  health             - Check if the API is running"
  echo "  register           - Register a new user"
  echo "  login              - Login and get authentication token"
  echo "  profile            - Get user profile (requires login first)"
  echo "  trips              - Get all trips"
  echo "  trip <id>          - Get a specific trip by ID"
  echo "  search <query>     - Search trips (e.g., 'destination=Hawaii&minPrice=1000')"
  echo "  book               - Create a booking (requires login first)"
  echo "  my-bookings        - Get user's bookings (requires login first)"
  echo "  booking <id>       - Get specific booking details (requires login first)"
  echo "  cancel <id>        - Cancel a booking (requires login first)"
  echo "  favorite <tripId>  - Add a trip to favorites (requires login first)"
  echo "  my-favorites       - Get user's favorites (requires login first)"
  echo "  unfavorite <id>    - Remove from favorites (requires login first)"
  echo "  all                - Run all tests in sequence (register, login, etc.)"
  echo "  help               - Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 health"
  echo "  $0 register"
  echo "  $0 login"
  echo "  $0 trips"
  echo "  $0 trip trip1"
  echo "  $0 all"
}

# Function to check if API is running
check_health() {
  echo -e "${BLUE}Checking API health...${NC}"
  curl -s "$API_URL/health" | jq .
  if [ $? -ne 0 ]; then
    echo -e "${RED}API is not responding. Make sure it's running at $API_URL${NC}"
    exit 1
  fi
}

# Function to register a new user
register_user() {
  echo -e "${BLUE}Registering a new user...${NC}"
  curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","email":"test@example.com","password":"Password123"}' \
    "$API_URL/users/register" | jq .
}

# Function to login
login_user() {
  echo -e "${BLUE}Logging in...${NC}"
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Password123"}' \
    "$API_URL/users/login")
  
  echo "$RESPONSE" | jq .
  
  # Extract and save the token
  AUTH_TOKEN=$(echo "$RESPONSE" | jq -r '.token')
  if [[ "$AUTH_TOKEN" != "null" && "$AUTH_TOKEN" != "" ]]; then
    echo -e "${GREEN}Login successful. Token saved.${NC}"
  else
    echo -e "${RED}Login failed. No token received.${NC}"
  fi
}

# Function to get user profile
get_profile() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Getting user profile...${NC}"
  curl -s -X GET \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/users/me" | jq .
}

# Function to get all trips
get_trips() {
  echo -e "${BLUE}Getting all trips...${NC}"
  curl -s -X GET "$API_URL/trips" | jq .
}

# Function to get a specific trip
get_trip() {
  if [[ "$1" == "" ]]; then
    echo -e "${RED}Trip ID is required. Example: $0 trip trip1${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Getting trip details for $1...${NC}"
  curl -s -X GET "$API_URL/trips/$1" | jq .
}

# Function to search trips
search_trips() {
  echo -e "${BLUE}Searching trips with query: $1${NC}"
  curl -s -X GET "$API_URL/trips/search?$1" | jq .
}

# Function to create a booking
create_booking() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Creating a booking...${NC}"
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "tripId": "trip1",
      "fullName": "Test User",
      "email": "test@example.com",
      "travelers": 2,
      "startDate": "2025-08-01"
    }' \
    "$API_URL/bookings")
  
  echo "$RESPONSE" | jq .
  
  # Extract and save the booking ID
  BOOKING_ID=$(echo "$RESPONSE" | jq -r '.bookingId')
  if [[ "$BOOKING_ID" != "null" && "$BOOKING_ID" != "" ]]; then
    echo -e "${GREEN}Booking created. ID saved: $BOOKING_ID${NC}"
  else
    echo -e "${RED}Booking creation failed.${NC}"
  fi
}

# Function to get user's bookings
get_user_bookings() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Getting user's bookings...${NC}"
  curl -s -X GET \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/bookings/user" | jq .
}

# Function to get booking details
get_booking() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  local id=$1
  if [[ "$id" == "" && "$BOOKING_ID" != "" ]]; then
    id=$BOOKING_ID
  fi
  
  if [[ "$id" == "" ]]; then
    echo -e "${RED}Booking ID is required. Example: $0 booking <id>${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Getting booking details for $id...${NC}"
  curl -s -X GET \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/bookings/$id" | jq .
}

# Function to cancel a booking
cancel_booking() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  local id=$1
  if [[ "$id" == "" && "$BOOKING_ID" != "" ]]; then
    id=$BOOKING_ID
  fi
  
  if [[ "$id" == "" ]]; then
    echo -e "${RED}Booking ID is required. Example: $0 cancel <id>${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Cancelling booking $id...${NC}"
  curl -s -X PATCH \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/bookings/$id/cancel" | jq .
}

# Function to add a trip to favorites
add_favorite() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  if [[ "$1" == "" ]]; then
    echo -e "${RED}Trip ID is required. Example: $0 favorite trip2${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Adding trip $1 to favorites...${NC}"
  RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d "{\"tripId\": \"$1\"}" \
    "$API_URL/favorites")
  
  echo "$RESPONSE" | jq .
  
  # Extract and save the favorite ID
  FAVORITE_ID=$(echo "$RESPONSE" | jq -r '.id')
  if [[ "$FAVORITE_ID" != "null" && "$FAVORITE_ID" != "" ]]; then
    echo -e "${GREEN}Trip added to favorites. ID saved: $FAVORITE_ID${NC}"
  else
    echo -e "${RED}Failed to add to favorites.${NC}"
  fi
}

# Function to get user's favorites
get_favorites() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Getting user's favorites...${NC}"
  curl -s -X GET \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/favorites" | jq .
}

# Function to remove from favorites
remove_favorite() {
  if [[ "$AUTH_TOKEN" == "" ]]; then
    echo -e "${RED}No authentication token. Please login first.${NC}"
    return 1
  fi
  
  local id=$1
  if [[ "$id" == "" && "$FAVORITE_ID" != "" ]]; then
    id=$FAVORITE_ID
  fi
  
  if [[ "$id" == "" ]]; then
    echo -e "${RED}Favorite ID is required. Example: $0 unfavorite <id>${NC}"
    return 1
  fi
  
  echo -e "${BLUE}Removing favorite $id...${NC}"
  curl -s -X DELETE \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    "$API_URL/favorites/$id" | jq .
}

# Function to run all tests
run_all_tests() {
  echo -e "${PURPLE}=== Running all tests in sequence ===${NC}"
  check_health
  register_user
  login_user
  get_profile
  get_trips
  get_trip "trip1"
  search_trips "destination=Hawaii"
  create_booking
  get_user_bookings
  get_booking ""
  add_favorite "trip2"
  get_favorites
  remove_favorite ""
  cancel_booking ""
  echo -e "${PURPLE}=== All tests completed ===${NC}"
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo -e "${RED}Error: jq is not installed. Please install it first.${NC}"
  echo "Debian/Ubuntu: sudo apt install jq"
  echo "macOS: brew install jq"
  echo "Fedora: sudo dnf install jq"
  exit 1
fi

# Main script logic
case "$1" in
  "health")
    check_health
    ;;
  "register")
    register_user
    ;;
  "login")
    login_user
    ;;
  "profile")
    get_profile
    ;;
  "trips")
    get_trips
    ;;
  "trip")
    get_trip "$2"
    ;;
  "search")
    search_trips "$2"
    ;;
  "book")
    create_booking
    ;;
  "my-bookings")
    get_user_bookings
    ;;
  "booking")
    get_booking "$2"
    ;;
  "cancel")
    cancel_booking "$2"
    ;;
  "favorite")
    add_favorite "$2"
    ;;
  "my-favorites")
    get_favorites
    ;;
  "unfavorite")
    remove_favorite "$2"
    ;;
  "all")
    run_all_tests
    ;;
  "help"|"--help"|"-h"|"")
    show_help
    ;;
  *)
    echo -e "${RED}Unknown command: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0 