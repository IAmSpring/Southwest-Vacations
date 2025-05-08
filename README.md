# Southwest Vacations Booking App

A full-stack vacation booking application built with React, TypeScript, and Express, featuring a persistent database for storing user data, bookings, and favorites.

## Features

- Complete vacation booking experience
- User authentication and profile management
- Persistent data storage
- Favorites system for saving trips
- Modern UI with Southwest Airlines branding
- Responsive design for all devices

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- React Query for data fetching

### Backend
- Node.js with Express
- LowDB for persistent JSON storage
- JWT for authentication
- TypeScript for type safety

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd southwest-vacations
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will launch both the frontend and backend with colored output in a single terminal.

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:4000](http://localhost:4000)

## API Endpoints

### Trips
- `GET /trips` - Get all trips
- `GET /trips/:tripId` - Get a specific trip
- `GET /trips/search` - Search trips

### User Management
- `POST /users/register` - Register a new user
- `POST /users/login` - Login
- `GET /users/me` - Get current user profile

### Bookings
- `POST /bookings` - Create a new booking
- `GET /bookings/user` - Get user's bookings
- `GET /bookings/:bookingId` - Get booking details
- `PATCH /bookings/:bookingId/cancel` - Cancel a booking

### Favorites
- `POST /favorites` - Add a trip to favorites
- `GET /favorites` - Get user's favorites
- `DELETE /favorites/:favoriteId` - Remove from favorites

## Data Persistence

The application uses LowDB to store data in a JSON file. The database will be automatically created in the `data` directory when you first run the application.

## Testing the Application

### Automated Tests

Run the tests using the following commands:

```bash
# Run frontend unit tests
npm test

# Run end-to-end tests with Cypress
npm run cypress
```

### Manual Testing Scripts

Below are manual testing scripts you can use to verify the application works as expected:

#### 1. Authentication Testing

```bash
# Register a new user
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Password123"}'

# Login with the registered user
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Get user profile (copy the token from the login response)
curl -X GET http://localhost:4000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Trip Search and Filtering

```bash
# Get all trips
curl -X GET http://localhost:4000/trips

# Get a specific trip
curl -X GET http://localhost:4000/trips/trip1

# Search trips by destination
curl -X GET "http://localhost:4000/trips/search?destination=Hawaii"

# Filter trips by price range
curl -X GET "http://localhost:4000/trips/search?minPrice=1000&maxPrice=2000"
```

#### 3. Booking Management

```bash
# Create a booking (requires authentication)
curl -X POST http://localhost:4000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "tripId": "trip1",
    "fullName": "Test User",
    "email": "test@example.com",
    "travelers": 2,
    "startDate": "2025-08-01"
  }'

# Get user's bookings
curl -X GET http://localhost:4000/bookings/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get booking details (replace BOOKING_ID with an actual booking ID)
curl -X GET http://localhost:4000/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Cancel a booking
curl -X PATCH http://localhost:4000/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Favorites Testing

```bash
# Add a trip to favorites
curl -X POST http://localhost:4000/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"tripId": "trip2"}'

# Get user's favorites
curl -X GET http://localhost:4000/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Remove from favorites (replace FAVORITE_ID with an actual favorite ID)
curl -X DELETE http://localhost:4000/favorites/FAVORITE_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing with Postman

A Postman collection is included in the `tests/postman` directory. Import the collection into Postman to quickly test all endpoints.

To use the collection:
1. Import `Southwest_Vacations_API.postman_collection.json` into Postman
2. Set up an environment with variables:
   - `baseUrl`: http://localhost:4000
   - `authToken`: (Will be set automatically after login)
3. Run the collection in sequence, starting with authentication

### Database Verification

To verify data is being stored properly, check the `data/db.json` file. This file contains all the application data and is updated in real-time.

## System Testing

### System Check Tool

The application includes a system check tool for verifying that the frontend and backend are properly connected and authentication is working correctly. This is useful for diagnosing issues during setup or after making changes.

To use the system check:

1. Navigate to the `/system-check` route in your browser
2. Click "Run System Check" to verify:
   - Backend connectivity
   - Authentication flow
   - Booking functionality

You can also run a basic system check from the command line:

```bash
# Run the system check utility
npm run system-test

# Check only if services are running
npm run system-test -- --check

# Open the system check in browser
npm run system-test -- --view
```

The system check will verify that:
- The backend API is reachable and responding
- Authentication endpoints are working correctly
- You can successfully log in and get a valid token
- The booking flow is functional with proper authentication

If you encounter the "Authentication required" error when trying to book a trip, use the system check to verify that your authentication is working properly.

## License

This project is licensed under the MIT License.

---

## 🔧 Tech Stack Overview

| Layer       | Tech                                      |
|-------------|-------------------------------------------|
| Frontend    | React, Vite, Zustand, React Query, Tailwind CSS |
| Backend     | Express.js (mock for Java), TypeScript    |
| Data        | seedData.json (JSON db for mock backend)  |
| Testing     | Jest, React Testing Library, Cypress      |
| Tooling     | ESLint, Prettier, Husky, GitHub Actions   |

---

## 🚀 Quick Start

```bash
# install root + backend
npm install && cd mock-backend && npm install && cd ..

# start both backend + frontend together
npm run dev
```

---

## 📁 Folder Structure

```
.
├── README.md
├── mock-backend/            # Node backend
│   ├── index.ts             # Express server
│   ├── seedData.json        # Mock data
├── src/
│   └── sharedTypes.ts       # Shared trip/booking types
├── vite.config.ts
├── package.json             # Root with scripts for both apps
```

---

## 🔁 API Endpoints (Mocked via Express)

- `GET /trips`
- `GET /trips/:tripId`
- `POST /bookings`

Backed by `seedData.json`.

---

## ✨ Scripts

```json
"scripts": {
  "dev": "concurrently \"vite\" \"ts-node mock-backend/index.ts\"",
  "build": "vite build",
  "start": "node dist/index.js",
  "test": "jest",
  "cypress": "cypress open"
}
```

---

