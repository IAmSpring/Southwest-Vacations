import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import fs from 'fs';
import * as seedDataModule from './seedData.js';
import * as dbModule from './db.js';
import { v4 as uuidv4 } from 'uuid';

console.log('Starting server initialization...');

// Cast the db module to any type to handle both default and named exports
const db = dbModule.default || (dbModule as any);
// Get generateSeedUsers from seedData module
const { generateSeedUsers } = seedDataModule;

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

// Initialize promotions if they don't exist
async function initializePromotions() {
  try {
    // Check if promotions already exist
    const existingPromotions = db.get('promotions').value();

    if (!existingPromotions || existingPromotions.length === 0) {
      console.log('Generating seed promotions...');

      // Create some initial promotions
      const promotions = [
        {
          id: uuidv4(),
          code: 'SUMMER2023',
          description: 'Summer Special: Get 15% off on all beach destinations',
          discountType: 'percentage',
          discountValue: 15,
          startDate: '2023-06-01',
          endDate: '2023-08-31',
          restrictions: 'Not applicable with other discounts. Minimum 3-night stay required.',
          status: 'active',
          eligibleDestinations: ['Cancun', 'Miami', 'Honolulu', 'San Diego', 'Puerto Vallarta'],
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'FALL50',
          description: '$50 off fall bookings to mountain destinations',
          discountType: 'fixed',
          discountValue: 50,
          startDate: '2023-09-01',
          endDate: '2023-11-30',
          restrictions: 'Valid for bookings above $500. Cannot be combined with other promotions.',
          status: 'upcoming',
          eligibleDestinations: ['Denver', 'Salt Lake City', 'Vancouver', 'Portland', 'Seattle'],
          minBookingValue: 500,
          createdAt: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          code: 'FAMILY25',
          description: '25% discount for family packages with children',
          discountType: 'percentage',
          discountValue: 25,
          startDate: '2023-05-01',
          endDate: '2023-12-31',
          restrictions: 'Must include at least 2 adults and 1 child. Maximum discount of $300.',
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      ];

      // Add to database
      promotions.forEach(promo => {
        db.get('promotions').push(promo).write();
      });

      console.log(`✅ Added ${promotions.length} initial promotions`);
    } else {
      console.log(`Found ${existingPromotions.length} existing promotions in database`);
    }
  } catch (error) {
    console.error('Error initializing promotions:', error);
  }
}

// Initialize the promotions
initializePromotions();

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
import * as tripsModule from './routes/trips.js';
import * as bookingsModule from './routes/bookings.js';
import * as favoritesModule from './routes/favorites.js';
import * as usersModule from './routes/users.js';
import * as adminModule from './routes/admin.js';
import * as trainingModule from './routes/training.js';
import * as notificationsModule from './routes/notifications.js';
import * as rolesModule from './routes/roles.js';
import * as auditModule from './routes/audit.js';
import * as twoFactorModule from './routes/two-factor.js';
import * as promotionsModule from './routes/promotions.js';

// Create router instances for all modules, handling both default and named exports
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
const promotionsRouter = promotionsModule.default || (promotionsModule as any);

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
app.use('/api/promotions', promotionsRouter);

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
