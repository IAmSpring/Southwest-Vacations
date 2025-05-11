/* eslint-env node */
// Script to initialize and fix the backend database for testing

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Starting backend database initialization...');
console.log(`Root directory: ${rootDir}`);

// Ensure data directory exists
const dataDir = path.resolve(rootDir, 'data');
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true, mode: 0o777 });
} else {
  console.log('Data directory exists, updating permissions...');
  fs.chmodSync(dataDir, 0o777);
}

// Remove any existing database files
const dbPath = path.resolve(dataDir, 'db.json');
const tmpPath = path.resolve(dataDir, 'db.json.tmp');
const backupPath = path.resolve(dataDir, 'db.json.backup');

// Clean up any existing files
[dbPath, tmpPath, backupPath].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Removing existing file: ${filePath}`);
    fs.unlinkSync(filePath);
  }
});

// Initialize database with minimum required data
const initialData = {
  users: [
    {
      id: '1',
      email: 'test@example.com',
      password: '$2a$10$yfIuEk1LAVnlJP7uZCVNqee39MYVa5qTH7nC74JP2zdIBN.ZUb7S2', // Password123
      name: 'Test User',
      role: 'user',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'admin@example.com',
      password: '$2a$10$XTy.tQXHtAHmBkRZ9ZVMkO5Jz5QnwtlEOzJOZYovIVp4IOm5VG68y', // Admin123
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  trips: [],
  bookings: [],
  favorites: [],
  notifications: [],
  audit_logs: []
};

// Write initial database with proper permissions
console.log('Writing initial database data...');
fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), { mode: 0o666 });

// Check if write was successful
if (fs.existsSync(dbPath)) {
  console.log('Database file created successfully.');
  fs.chmodSync(dbPath, 0o666);
} else {
  console.error('Failed to create database file!');
  process.exit(1);
}

// Create a backup
fs.copyFileSync(dbPath, backupPath);
fs.chmodSync(backupPath, 0o666);

console.log('Database initialized successfully.');
console.log(`Database location: ${dbPath}`);
console.log('Test users created:');
console.log('- test@example.com / Password123 (user role)');
console.log('- admin@example.com / Admin123 (admin role)');
console.log('\nYou can now restart the backend server.'); 