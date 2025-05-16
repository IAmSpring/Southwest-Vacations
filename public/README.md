# Southwest Vacations Booking App

A full-stack vacation booking application built with React, TypeScript, and Express, featuring a persistent database for storing user data, bookings, and favorites.

![Southwest Airlines Vacations](https://github.com/user-attachments/assets/3cf8207c-15c2-4514-ac29-09dca386249e)

## Features

- Complete vacation booking experience
- User authentication and profile management
- Persistent data storage
- Favorites system for saving trips
- Modern UI with Southwest Airlines branding
- Responsive design for all devices
- AI-powered assistant with personalized trip recommendations

# Vacation Bookings

![Bookings](https://github.com/user-attachments/assets/b65d444e-c951-4aa3-bcf1-630f5dd44c12)

## Deployment

This application is automatically deployed to GitHub Pages through GitHub Actions workflows. Each commit to the main branch triggers a deployment pipeline that builds and publishes the application.

### GitHub Pages Hosting

The application is hosted on GitHub Pages at the repository's designated URL. The Vite configuration in `vite.config.ts` is set up to handle proper base paths for GitHub Pages hosting:

```javascript
const repositoryName = 'Southwest-Vacations';
const base = process.env.NODE_ENV === 'production' ? `/${repositoryName}/` : '/';
```

### Continuous Deployment

Two GitHub Actions workflows manage the deployment process:

1. **Main Deployment Workflow**:

   - Triggered on pushes to the main branch
   - Builds the application with production settings
   - Configures GitHub Pages environment
   - Uploads build artifacts
   - Deploys to GitHub Pages

2. **Manual Deployment**:
   - Can be triggered manually via `workflow_dispatch`
   - Useful for deploying specific versions or when automatic deployment is paused

### Environment Handling

For security, the workflows use GitHub Secrets to inject environment variables during the build process. This keeps sensitive information like API keys secure while allowing the application to access necessary services.

### Accessing the Deployed Application

The deployed application is available at:

- Production: [https://iamspring.github.io/Southwest-Vacations/](https://iamspring.github.io/Southwest-Vacations/)
- For each successful deployment, the GitHub Actions job will provide a link to the deployed version in the workflow summary.

![Learning Modules](https://github.com/user-attachments/assets/a4da78af-1d09-4cfa-89ad-bb12ae2bb235)

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
- OpenAI API integration for AI assistant

# Analytics

![Analytics](https://github.com/user-attachments/assets/efc7fd45-6870-4a43-adf7-939d77df9032)

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

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=asst_Le5hAPkk1mriAIVsRK06qGsm
```

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

![Automated Testing](https://github.com/user-attachments/assets/f7020ec4-3cf8-4a5a-a81c-9834fa672043)

### Automated Tests

Run the tests using the following commands:

```bash
# Run frontend unit tests
npm test

# Run end-to-end tests with Cypress
npm run cypress
```

![Admin Integrations](https://github.com/user-attachments/assets/0c31ccda-3731-49ae-8461-d7aff64be51a)

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

## 🛠️ Recent Improvements

### Testing Infrastructure

We've made significant improvements to the testing infrastructure to make it more reliable:

- **Simplified Test Backend**: Created a dedicated test backend (`simple-test-backend.js`) that provides all essential API endpoints with file-based storage.
- **Robust Test Scripts**: Developed several shell scripts for reliable test execution:
  - `run-simple-test.sh` - For Cypress login tests
  - `run-playwright-login.sh` - For Playwright login tests
  - `run-tests-fixed.sh` - For comprehensive testing
  - `run-fixed-backend.sh` - For starting the test backend
- **Fixed Authentication**: Improved authentication flow in tests to handle DOM detachment issues
- **Data Persistence**: Added proper test data seeding and persistence for consistent test results

### Backend Improvements

- Fixed route export defaults in the mock backend to ensure consistent module handling
- Enhanced error handling and validation in API endpoints
- Improved JWT token validation and user authentication

### Documentation

- Added detailed testing documentation in `README-testing.md`
- Improved API documentation with endpoint examples

For more details on testing, see the [Testing Guide](./README-testing.md).

### AI Assistant Integration

We've added a powerful AI assistant feature to enhance the user experience:

- **Interactive Chat Bubble**: AI assistant appears in the bottom right corner of the UI
- **OpenAI Integration**: Powered by GPT-4o for intelligent, contextual responses
- **JSON Response Structure**: Provides structured guidance with suggestions for next steps
- **Dual Functionality**:
  - **User Assistant**: Helps with finding destinations, booking flow, and travel questions
  - **Admin Assistant**: Provides system analytics and advanced debugging capabilities
- **Thread Management**: Maintains conversation history for context-aware responses
- **Smart Suggestions**: Offers clickable suggestion chips for seamless user guidance

For detailed information on the AI assistant implementation and usage, see the [AI Assistant Guide](./AI_ASSISTANT_USAGE.md).

### Clean Startup Script

Added a comprehensive `clean-startup.sh` script that:

- Checks for running services on required ports
- Starts services in the correct sequence
- Runs validation tests to ensure all components are working correctly
- Can be run with `npm run clean-start`

---

## 🔧 Tech Stack Overview

| Layer    | Tech                                            |
| -------- | ----------------------------------------------- |
| Frontend | React, Vite, Zustand, React Query, Tailwind CSS |
| Backend  | Express.js (mock for Java), TypeScript          |
| Data     | seedData.json (JSON db for mock backend)        |
| Testing  | Jest, React Testing Library, Cypress            |
| Tooling  | ESLint, Prettier, Husky, GitHub Actions         |

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
├── AI_ASSISTANT_USAGE.md     # AI assistant documentation
├── clean-startup.sh          # Clean startup script
├── mock-backend/            # Node backend
│   ├── index.ts             # Express server
│   ├── ai.ts                # AI assistant backend routes
│   ├── admin-ai.ts          # Admin AI routes
│   ├── seedData.json        # Mock data
├── src/
│   ├── components/
│   │   ├── AIAssistant.tsx  # AI chat bubble component
│   │   └── ...
│   └── sharedTypes.ts       # Shared trip/booking types
├── vite.config.ts
├── package.json             # Root with scripts for both apps
```

---

## 🔁 API Endpoints (Mocked via Express)

- `GET /trips`
- `GET /trips/:tripId`
- `POST /bookings`
- `GET /api/ai/threads` - Get all conversation threads for current user
- `POST /api/ai/threads` - Create a new conversation thread
- `GET /api/ai/threads/:threadId` - Get a specific thread with messages
- `POST /api/ai/threads/:threadId/messages` - Send a message and get AI response
- `GET /api/admin/ai/threads` - Get all user threads (admin only)
- `GET /api/admin/ai/threads/:threadId` - Get detailed thread data (admin only)

Backed by `seedData.json`.

---

## ✨ Scripts

```json
"scripts": {
  "dev": "concurrently \"vite\" \"ts-node mock-backend/index.ts\"",
  "build": "vite build",
  "start": "node dist/index.js",
  "test": "jest",
  "cypress": "cypress open",
  "clean-start": "bash clean-startup.sh",
  "test-ai-assistant": "jest --testPathPattern=ai-assistant",
  "dev:ai": "ts-node mock-backend/ai.ts"
}
```

---

## 🚀 GitHub Pages Deployment

This project is set up for automatic deployment to GitHub Pages using GitHub Actions workflows. Here's how the deployment process works:

### Continuous Deployment Flow

1. **Code Push Triggers Workflow**:

   - Any push to the `main` branch automatically triggers the GitHub Actions workflow
   - The workflow is defined in `.github/workflows/deploy.yml`

2. **Build Process**:

   - The workflow checks out the latest code
   - Sets up Node.js 18 with npm caching
   - Installs dependencies via `npm ci`
   - Builds the application using `npm run build`
   - This generates optimized static files in the `dist` directory

3. **GitHub Pages Configuration**:

   - The workflow configures GitHub Pages settings
   - Uploads the build artifacts from `dist`
   - Deploys the content to the GitHub Pages environment

4. **Base Path Configuration**:
   - The Vite configuration in `vite.config.ts` automatically handles the GitHub Pages base path:
   ```javascript
   const repositoryName = 'Southwest-Vacations';
   const base = process.env.NODE_ENV === 'production' ? `/${repositoryName}/` : '/';
   ```
   - This ensures all assets and routes work correctly when deployed

### Viewing the Deployed Application

The live application can be accessed at:

- [https://iamspring.github.io/Southwest-Vacations/](https://iamspring.github.io/Southwest-Vacations/)

### Manual Deployment

If needed, you can manually trigger the deployment workflow:

1. Go to the GitHub repository
2. Navigate to "Actions" tab
3. Select the "Deploy to GitHub Pages" workflow
4. Click "Run workflow" and select the branch to deploy

### Jekyll Configuration

The repository also includes Jekyll configuration via `_config.yml`:

```yaml
domain: iamspring.github.io
url: https://iamspring.github.io
baseurl: /home
```

This enables GitHub Pages to properly serve the application with the correct paths and settings.

### Deployment Status

After each push to the main branch:

1. Check the "Actions" tab in the GitHub repository to monitor build status
2. A successful deployment will show a green checkmark
3. The deployment URL will be available in the workflow summary

---

## 📡 Webhooks Integration

This application includes a webhook system for real-time notifications about booking data changes. When booking data is modified, the system automatically broadcasts these changes to configured external services.

### Key Features

- **Automatic Broadcasting**: Changes to booking data are automatically detected and broadcasted
- **Secure Communication**: Webhooks are authenticated with HMAC signatures
- **Configurable Endpoints**: Support for multiple recipient endpoints
- **Detailed Payloads**: Complete information about the changes is included in the payload

### Use Cases

- Integration with external reservation systems
- Real-time analytics and reporting
- Customer notification services
- Partner travel agency synchronization

For detailed information about the webhook system, see the [Webhook Documentation](./WEBHOOK_DOCUMENTATION.md).

---

# Full GitHub System Documentation (Easy Expandability)

---![Automatic GitHub Documentation ](https://github.com/user-attachments/assets/ce6d35a0-11ec-4a0a-94c1-28cd23212701)

<!-- Rebuild trigger: (timestamp) -->
