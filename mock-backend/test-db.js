// Simple script to test the database
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('./db.js');
import { v4 as uuidv4 } from 'uuid';

console.log('Testing database connection...');

// Check if db and data are initialized
if (!db || !db.data) {
  console.error('Database is not properly initialized!');
  process.exit(1);
}

// Check if promotions collection exists
if (!db.data.promotions) {
  console.log('Creating promotions collection...');
  db.data.promotions = [];
  db.write();
} else {
  console.log('Promotions collection already exists');
  console.log(`Found ${db.data.promotions.length} promotions`);
}

// Check users collection
if (db.data.users && db.data.users.length > 0) {
  console.log(`Found ${db.data.users.length} users`);
  db.data.users.forEach(user => {
    console.log(`- User: ${user.email}, isAdmin: ${user.isAdmin}, role: ${user.role || 'none'}`);
  });
} else {
  console.log('No users found in database');
}

// Add a test promotion if none exist
if (db.data.promotions.length === 0) {
  console.log('Adding test promotion...');
  const testPromotion = {
    id: uuidv4(),
    code: 'TEST123',
    description: 'Test promotion for development',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    restrictions: 'Test only',
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  db.data.promotions.push(testPromotion);
  db.write();
  console.log('Test promotion added');
}

console.log('Database test completed'); 