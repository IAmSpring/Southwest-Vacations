/**
 * Database Seeding Script
 * This script initializes or resets the database with seed data
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Configuration
const dataDir = path.join(process.cwd(), 'data');
const mockBackendDir = path.join(process.cwd(), 'mock-backend');
const force = process.argv.includes('--force');
const collections = ['users', 'trips', 'bookings', 'favorites', 'roles', 'notifications', 'training'];

// Function to log with color
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Function to ensure directory exists
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    log(`Creating directory: ${dir}`, colors.yellow);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Function to copy seed data
function copySeedData(collection) {
  // Check if seed data exists
  const seedFile = path.join(mockBackendDir, `${collection}.json`);
  const seedDataFile = path.join(mockBackendDir, 'seedData.json');
  const targetFile = path.join(dataDir, `${collection}.json`);
  
  // Skip if target file exists and force is not enabled
  if (fs.existsSync(targetFile) && !force) {
    log(`Skipping ${collection} (already exists, use --force to override)`, colors.yellow);
    return false;
  }
  
  try {
    // Try collection-specific seed file first
    if (fs.existsSync(seedFile)) {
      log(`Seeding ${collection} from ${seedFile}`, colors.green);
      fs.copyFileSync(seedFile, targetFile);
      return true;
    }
    
    // If collection file doesn't exist, try to extract from seedData.json
    if (fs.existsSync(seedDataFile)) {
      const seedData = JSON.parse(fs.readFileSync(seedDataFile, 'utf8'));
      
      if (seedData[collection]) {
        log(`Extracting ${collection} from seedData.json`, colors.green);
        fs.writeFileSync(targetFile, JSON.stringify(seedData[collection], null, 2));
        return true;
      }
    }
    
    // If no seed data found, create empty collection
    log(`Creating empty ${collection} collection`, colors.blue);
    fs.writeFileSync(targetFile, JSON.stringify(collection === 'users' ? [
      {
        "id": "admin",
        "username": "admin",
        "email": "admin@example.com",
        "passwordHash": "$2a$10$XF2sKkRtTIHX86Jt.2MeA.u.xZHVn/m0C4YDHLYsFKjzGbIGQJo1i", // Password: admin123
        "createdAt": new Date().toISOString(),
        "role": "admin",
        "isAdmin": true
      }
    ] : []), null, 2);
    return true;
  } catch (error) {
    log(`Error seeding ${collection}: ${error.message}`, colors.red);
    return false;
  }
}

// Main function
function main() {
  log('Southwest Vacations Database Seeder', colors.blue);
  log('===================================', colors.blue);
  
  // Ensure data directory exists
  ensureDirectoryExists(dataDir);
  
  // Seed all collections
  let seededCount = 0;
  for (const collection of collections) {
    if (copySeedData(collection)) {
      seededCount++;
    }
  }
  
  // Create db.json if it doesn't exist
  const dbJsonPath = path.join(dataDir, 'db.json');
  if (!fs.existsSync(dbJsonPath) || force) {
    log('Creating main db.json file', colors.green);
    
    // Build db.json from individual collections
    const db = {};
    for (const collection of collections) {
      const collectionPath = path.join(dataDir, `${collection}.json`);
      if (fs.existsSync(collectionPath)) {
        try {
          db[collection] = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        } catch (error) {
          log(`Error reading ${collection}: ${error.message}`, colors.red);
        }
      }
    }
    
    // Write combined db.json
    fs.writeFileSync(dbJsonPath, JSON.stringify(db, null, 2));
    seededCount++;
  } else {
    log('Skipping db.json (already exists, use --force to override)', colors.yellow);
  }
  
  log(`\nDatabase seeding complete. Seeded ${seededCount} files.`, colors.green);
  log(`Database directory: ${dataDir}`, colors.blue);
}

// Run the script
main(); 