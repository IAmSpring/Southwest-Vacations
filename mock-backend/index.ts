import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import fs from 'fs';
import { generateSeedUsers } from './seedData.js';
import db from './db.js';

console.log('Starting server initialization...');

// Startup validation - test file system access
const tempDir = path.join(process.cwd(), 'temp');
const testFile = path.join(tempDir, `startup-test-${Date.now()}.txt`);

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('✅ Created temp directory');
  } catch (error) {
    console.error('❌ Failed to create temp directory:', error);
    process.exit(1);
  }
}

// Test file write/read/delete operations
try {
  // Write test file
  fs.writeFileSync(testFile, 'Startup validation check', 'utf8');
  console.log('✅ File system write check successful');

  // Read test file
  const content = fs.readFileSync(testFile, 'utf8');
  if (content !== 'Startup validation check') {
    throw new Error('File content verification failed');
  }
  console.log('✅ File system read check successful');

  // Delete test file
  fs.unlinkSync(testFile);
  console.log('✅ File system delete check successful');
} catch (error) {
  console.error('❌ File system validation failed:', error);
  process.exit(1);
}

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

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
});

// Import routes
import tripsRouter from './routes/trips.js';
import bookingsRouter from './routes/bookings.js';
import favoritesRouter from './routes/favorites.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';
import trainingRouter from './routes/training.js';
import notificationsRouter from './routes/notifications.js';
import rolesRouter from './routes/roles.js';
import auditRouter from './routes/audit.js';
import twoFactorRouter from './routes/two-factor.js';

// Routes
app.use('/api/trips', tripsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/training', trainingRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/audit', auditRouter);
app.use('/api/two-factor', twoFactorRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbStatus: 'connected',
    apiVersion: '1.0.0',
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Southwest Vacations Internal Booking System API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
