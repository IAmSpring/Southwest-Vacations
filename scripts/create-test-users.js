#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    console.log('Creating test users...');
    
    // Path to the database file
    const dbPath = path.resolve(path.join(__dirname, '..', 'data', 'db.json'));
    
    // Check if the database file exists
    if (!fs.existsSync(dbPath)) {
      console.error('Database file not found at:', dbPath);
      process.exit(1);
    }
    
    // Read the current database
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize users array if it doesn't exist
    if (!dbData.users) {
      dbData.users = [];
    }
    
    // Check if test user exists
    const testUserExists = dbData.users.some(user => user.email === 'test@example.com');
    // Check if admin user exists
    const adminUserExists = dbData.users.some(user => user.email === 'admin@example.com');
    
    // Create test user if it doesn't exist
    if (!testUserExists) {
      const testPasswordHash = await bcrypt.hash('Password123', 10);
      dbData.users.push({
        id: uuidv4(),
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: testPasswordHash,
        createdAt: new Date().toISOString()
      });
      console.log('✅ Test user created');
    } else {
      console.log('Test user already exists');
    }
    
    // Create admin user if it doesn't exist
    if (!adminUserExists) {
      const adminPasswordHash = await bcrypt.hash('Admin123', 10);
      dbData.users.push({
        id: uuidv4(),
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        createdAt: new Date().toISOString(),
        isAdmin: true
      });
      console.log('✅ Admin user created');
    } else {
      console.log('Admin user already exists');
    }
    
    // Write the updated database back to the file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    console.log('Users have been saved to the database');
    
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
}

main(); 