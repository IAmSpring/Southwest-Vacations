/**
 * Database Reset Script
 * This script completely resets the database by removing all data files
 * and optionally reseeds with fresh data
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Configuration
const dataDir = path.join(process.cwd(), 'data');
const backupDir = path.join(process.cwd(), 'data-backups');
const reseed = process.argv.includes('--reseed');
const skipBackup = process.argv.includes('--no-backup');
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

// Function to backup database
function backupDatabase() {
  if (skipBackup) {
    log('Skipping database backup as requested', colors.yellow);
    return;
  }
  
  if (!fs.existsSync(dataDir)) {
    log('No database to backup', colors.yellow);
    return;
  }
  
  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  
  try {
    ensureDirectoryExists(backupDir);
    ensureDirectoryExists(backupPath);
    
    // Copy all files from data dir to backup dir
    const files = fs.readdirSync(dataDir);
    let backupCount = 0;
    
    for (const file of files) {
      const sourcePath = path.join(dataDir, file);
      const destPath = path.join(backupPath, file);
      
      // Skip directories
      if (fs.statSync(sourcePath).isDirectory()) {
        continue;
      }
      
      fs.copyFileSync(sourcePath, destPath);
      backupCount++;
    }
    
    log(`Database backed up to ${backupPath} (${backupCount} files)`, colors.green);
  } catch (error) {
    log(`Error backing up database: ${error.message}`, colors.red);
  }
}

// Function to delete database
function deleteDatabase() {
  if (!fs.existsSync(dataDir)) {
    log('No database to delete', colors.yellow);
    return;
  }
  
  try {
    // Delete all files in data dir
    const files = fs.readdirSync(dataDir);
    let deleteCount = 0;
    
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      
      // Skip directories
      if (fs.statSync(filePath).isDirectory()) {
        continue;
      }
      
      fs.unlinkSync(filePath);
      deleteCount++;
    }
    
    log(`Database deleted (${deleteCount} files removed)`, colors.magenta);
  } catch (error) {
    log(`Error deleting database: ${error.message}`, colors.red);
  }
}

// Function to reseed database
function reseedDatabase() {
  try {
    log('Reseeding database...', colors.blue);
    execSync('node scripts/seed-database.js --force', { stdio: 'inherit' });
  } catch (error) {
    log(`Error reseeding database: ${error.message}`, colors.red);
  }
}

// Ask for confirmation
function confirmReset() {
  if (process.argv.includes('--yes')) {
    return true;
  }
  
  log('\n⚠️  WARNING: This will delete all database files! ⚠️', colors.red);
  log('This action cannot be undone (although a backup will be created unless --no-backup is specified).', colors.yellow);
  log('\nTo proceed, run the command again with the --yes flag:', colors.blue);
  log(`node scripts/reset-database.js --yes${reseed ? ' --reseed' : ''}${skipBackup ? ' --no-backup' : ''}`, colors.blue);
  return false;
}

// Main function
function main() {
  log('Southwest Vacations Database Reset', colors.blue);
  log('================================', colors.blue);
  
  // Check for confirmation
  if (!confirmReset()) {
    return;
  }
  
  // Backup the database
  backupDatabase();
  
  // Delete the database
  deleteDatabase();
  
  // Reseed if requested
  if (reseed) {
    reseedDatabase();
  } else {
    log('\nDatabase has been reset. To reseed it, run:', colors.green);
    log('npm run seed-database', colors.blue);
  }
  
  log('\nDatabase reset complete.', colors.green);
}

// Run the script
main(); 