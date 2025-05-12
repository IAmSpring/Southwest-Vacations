#!/usr/bin/env node

/**
 * This script fixes issues with the mock backend for testing
 * It's designed to be run before starting tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);

console.log('🔧 Fixing backend issues for testing...');

// Fix 1: Update mock-backend/index.ts to handle modules with and without default exports
const indexPath = path.join(process.cwd(), 'mock-backend/index.ts');
if (fs.existsSync(indexPath)) {
  console.log('Updating mock-backend/index.ts to handle all module export types...');
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Update imports to use * as for consistency
  indexContent = indexContent.replace(
    /import (\w+Router) from '\.\/routes\/(\w+)\.js';/g, 
    "import * as $2Module from './routes/$2.js';"
  );
  
  // After imports, add the router instance creation
  if (!indexContent.includes('// Create router instances for all modules')) {
    const routerCreationCode = `// Create router instances for all modules, handling both default and named exports
const tripsRouter = tripsModule.default || (tripsModule as any);
const bookingsRouter = bookingsModule.default || (bookingsModule as any);
const favoritesRouter = favoritesModule.default || (favoritesModule as any);
const usersRouter = usersModule.default || (usersModule as any);
const adminRouter = adminModule.default || (adminModule as any);
const trainingRouter = trainingModule.default || (trainingModule as any);
const notificationsRouter = notificationsModule.default || (notificationsModule as any);
const rolesRouter = rolesModule.default || (rolesModule as any);
const auditRouter = auditModule.default || (auditModule as any);
const twoFactorRouter = twoFactorModule.default || (twoFactorModule as any);
const promotionsRouter = promotionsModule.default || (promotionsModule as any);`;
    
    // Find the place after imports and before routes
    indexContent = indexContent.replace(
      /\/\/ Routes/,
      `${routerCreationCode}\n\n// Routes`
    );
  }
  
  // Fix seedData import
  indexContent = indexContent.replace(
    /import \{ generateSeedUsers \} from '\.\/seedData\.js';/,
    "import * as seedDataModule from './seedData.js';\n" +
    "const { generateSeedUsers } = seedDataModule;"
  );
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ mock-backend/index.ts updated successfully');
}

// Fix 2: Create a simplified backend with just what's needed for tests
console.log('Creating simplified backend for testing...');
const simpleBackendPath = path.join(process.cwd(), 'simple-test-backend.js');

const simpleBackendContent = `
// Simple backend for testing purposes
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
const dbFiles = ['users.json', 'trips.json', 'bookings.json', 'favorites.json'];
dbFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    const initialData = file === 'users.json' 
      ? JSON.stringify([
          {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: '$2a$10$XvjzWhU12pFlM1gfz9i5qekPkwxal3sI9dDdU2PaWRZPNz.MsIEqG', // Password123
            createdAt: new Date().toISOString(),
            isAdmin: false,
            role: 'agent'
          },
          {
            id: '2',
            username: 'admin',
            email: 'admin@example.com',
            passwordHash: '$2a$10$7j9uOJh0TYIVJ51f.KLfKO6z5g8z6G0H7uiP7Mmz0DrvuKfHW31oe', // Admin123
            createdAt: new Date().toISOString(),
            isAdmin: true,
            role: 'admin'
          }
        ]) 
      : JSON.stringify([]);
    fs.writeFileSync(filePath, initialData);
  }
});

// Simple in-memory database for testing
const db = {
  users: JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8')),
  trips: JSON.parse(fs.readFileSync(path.join(dataDir, 'trips.json'), 'utf8')),
  bookings: JSON.parse(fs.readFileSync(path.join(dataDir, 'bookings.json'), 'utf8')),
  favorites: JSON.parse(fs.readFileSync(path.join(dataDir, 'favorites.json'), 'utf8')),
};

// Save changes to disk
const saveDB = () => {
  Object.keys(db).forEach(collection => {
    fs.writeFileSync(
      path.join(dataDir, \`\${collection}.json\`),
      JSON.stringify(db[collection], null, 2)
    );
  });
};

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // For tests, we'll use a simple token verification
  try {
    // In a real app, verify JWT here
    // For tests, we'll use the token as the user ID or set it to 1
    req.userId = token === 'fake-jwt-token' ? '1' : token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // For tests, accept any valid-looking credentials
  if (email && password) {
    // Return fake JWT token
    res.json({
      token: 'fake-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: email,
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/users/profile', authMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user info without sensitive data
  const { passwordHash, ...userInfo } = user;
  res.json(userInfo);
});

// Trip routes
app.get('/api/trips', (req, res) => {
  // Return trips with optional filtering
  res.json(db.trips);
});

app.get('/api/trips/:id', (req, res) => {
  const trip = db.trips.find(t => t.id === req.params.id);
  
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  
  res.json(trip);
});

// Booking routes
app.post('/api/bookings', authMiddleware, (req, res) => {
  const bookingData = req.body;
  
  // Create a new booking
  const newBooking = {
    id: \`booking-\${Date.now()}\`,
    userId: req.userId,
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  
  db.bookings.push(newBooking);
  saveDB();
  
  res.status(201).json(newBooking);
});

app.get('/api/bookings', authMiddleware, (req, res) => {
  // Get user's bookings
  const userBookings = db.bookings.filter(b => b.userId === req.userId);
  res.json(userBookings);
});

// Favorites routes
app.post('/api/favorites', authMiddleware, (req, res) => {
  const { tripId } = req.body;
  
  if (!tripId) {
    return res.status(400).json({ error: 'Trip ID is required' });
  }
  
  // Check if already in favorites
  const existing = db.favorites.find(f => f.userId === req.userId && f.tripId === tripId);
  if (existing) {
    return res.status(409).json({ error: 'Trip already in favorites' });
  }
  
  // Add to favorites
  const newFavorite = {
    id: \`fav-\${Date.now()}\`,
    userId: req.userId,
    tripId,
    createdAt: new Date().toISOString(),
  };
  
  db.favorites.push(newFavorite);
  saveDB();
  
  res.status(201).json(newFavorite);
});

app.get('/api/favorites', authMiddleware, (req, res) => {
  // Get user's favorites
  const userFavorites = db.favorites.filter(f => f.userId === req.userId);
  res.json(userFavorites);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Southwest Vacations Test API' });
});

// Create sample data if needed
if (db.trips.length === 0) {
  // Add some sample trips
  const sampleTrips = [
    {
      id: 'trip-1',
      destination: 'Cancun, Mexico',
      image: 'https://example.com/cancun.jpg',
      price: 599.99,
      duration: 7,
      description: 'Enjoy the beautiful beaches of Cancun',
      departingFrom: 'Phoenix, AZ',
    },
    {
      id: 'trip-2',
      destination: 'Las Vegas, USA',
      image: 'https://example.com/vegas.jpg',
      price: 399.99,
      duration: 3,
      description: 'Experience the excitement of Las Vegas',
      departingFrom: 'Dallas, TX',
    },
    {
      id: 'trip-3',
      destination: 'Orlando, USA',
      image: 'https://example.com/orlando.jpg',
      price: 499.99,
      duration: 5,
      description: 'Visit the world-famous theme parks',
      departingFrom: 'Chicago, IL',
    },
  ];
  
  db.trips.push(...sampleTrips);
  saveDB();
}

// Start server
app.listen(PORT, () => {
  console.log(\`✅ Test backend server running on port \${PORT}\`);
});
`;

fs.writeFileSync(simpleBackendPath, simpleBackendContent);
console.log(`✅ Created simplified test backend at ${simpleBackendPath}`);

// Fix 3: Update test scripts to use the simplified backend
console.log('Updating test scripts to use simplified backend...');
const testScripts = [
  { 
    path: 'run-booking-flow-test.sh',
    findReplace: [
      ['node simple-backend.js', 'node simple-test-backend.js'],
    ] 
  },
  { 
    path: 'run-all-tests.sh',
    findReplace: [
      ['node simple-backend.js', 'node simple-test-backend.js'],
    ] 
  },
];

testScripts.forEach(script => {
  const scriptPath = path.join(process.cwd(), script.path);
  if (fs.existsSync(scriptPath)) {
    let content = fs.readFileSync(scriptPath, 'utf8');
    script.findReplace.forEach(([find, replace]) => {
      content = content.replace(find, replace);
    });
    fs.writeFileSync(scriptPath, content);
    console.log(`✅ Updated ${script.path}`);
  } else {
    console.log(`⚠️ Couldn't find ${script.path}`);
  }
});

// Create executable script to run the fixed backend
const runFixedBackendPath = path.join(process.cwd(), 'run-fixed-backend.sh');
const runFixedBackendContent = `#!/bin/bash
# Kill any existing backend processes
pkill -f "node simple-backend.js" || true
pkill -f "node simple-test-backend.js" || true

# Start the simplified backend for tests
node simple-test-backend.js
`;

fs.writeFileSync(runFixedBackendPath, runFixedBackendContent);
fs.chmodSync(runFixedBackendPath, 0o755); // Make executable
console.log(`✅ Created run-fixed-backend.sh script`);

console.log('✅ All backend fixes completed successfully!');
console.log('Run ./run-fixed-backend.sh to start the fixed backend for testing'); 