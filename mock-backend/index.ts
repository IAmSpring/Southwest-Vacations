import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import { generateSeedUsers } from './seedData.js';
import db from './db.js';

console.log('Starting server initialization...');

// Database 
console.log('Loading database...');
// Add test users if they don't exist
async function initializeUsers() {
  try {
    // Check if users already exist
    const testUser = db.get('users').find({ email: 'test@example.com' }).value();
    const adminUser = db.get('users').find({ email: 'admin@example.com' }).value();
    
    // Only generate if users don't exist
    if (!testUser || !adminUser) {
      console.log('Generating seed users...');
      const users = await generateSeedUsers();
      
      // Add users to database if they don't exist
      users.forEach(user => {
        if (user.email === 'test@example.com' && !testUser) {
          db.get('users').push(user).write();
          console.log(`✅ Test user created: ${user.email}`);
        }
        if (user.email === 'admin@example.com' && !adminUser) {
          db.get('users').push(user).write();
          console.log(`✅ Admin user created: ${user.email}`);
        }
      });
    } else {
      console.log('Test users already exist in the database');
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
}

// Initialize the users
initializeUsers();

console.log('Database loaded successfully');

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Request logging

// Import routes
import tripsRouter from './routes/trips.js';
import bookingsRouter from './routes/bookings.js';
import favoritesRouter from './routes/favorites.js';
import usersRouter from './routes/users.js';

// Routes
app.use('/trips', tripsRouter);
app.use('/bookings', bookingsRouter);
app.use('/favorites', favoritesRouter);
app.use('/users', usersRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Southwest Vacations API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
