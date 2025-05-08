#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a random date between start and end
const generateRandomDate = (start = new Date(2025, 4, 1), end = new Date(2025, 7, 30)) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Generate a return date some days after the start date
const getReturnDate = (startDate, minDays = 3, maxDays = 14) => {
  const start = new Date(startDate);
  const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  const returnDate = new Date(start);
  returnDate.setDate(returnDate.getDate() + days);
  return returnDate.toISOString().split('T')[0];
};

const TIME_OPTIONS = ["morning", "afternoon", "evening"];
const getRandomTime = () => TIME_OPTIONS[Math.floor(Math.random() * TIME_OPTIONS.length)];

// Main function
async function main() {
  try {
    console.log('Creating test booking scenarios...');
    
    // Path to the database file
    const dbPath = path.resolve(path.join(__dirname, '..', 'data', 'db.json'));
    
    // Check if file exists
    if (!fs.existsSync(dbPath)) {
      console.error('Database file not found at:', dbPath);
      process.exit(1);
    }
    
    // Read the current database
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Initialize bookings array if needed
    if (!dbData.bookings) {
      dbData.bookings = [];
    }

    // Get test users (or notify to create them)
    let testUser = dbData.users.find(user => user.email === 'test@example.com');
    let adminUser = dbData.users.find(user => user.email === 'admin@example.com');

    if (!testUser || !adminUser) {
      console.log('Test users not found. Please run create-test-users.js first.');
      process.exit(1);
    }

    // Create test scenarios
    const scenarios = [
      // Scenario 1: Simple flight booking (one-way)
      {
        id: uuidv4(),
        userId: testUser.id,
        tripId: "trip1", // Hawaii
        fullName: "John Smith",
        email: testUser.email,
        travelers: 2,
        startDate: generateRandomDate(),
        tripType: "one-way",
        departureTime: "morning",
        totalPrice: 2598, 
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        specialRequests: "Window seats preferred."
      },
      
      // Scenario 2: Round trip flight with hotel
      {
        id: uuidv4(),
        userId: testUser.id,
        tripId: "trip2", // Cancun
        fullName: "John Smith",
        email: testUser.email,
        travelers: 2,
        startDate: (function() { 
          const date = generateRandomDate();
          this.returnDate = getReturnDate(date);
          return date;
        })(),
        returnDate: null, // Set by the start date function
        tripType: "round-trip",
        departureTime: "morning",
        returnTime: "evening",
        hotelId: "hotel2-1", // Cancun Beachfront Resort
        totalPrice: 3796,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        specialRequests: "Early check-in requested"
      },
      
      // Scenario 3: Full package - flight, hotel, car rental
      {
        id: uuidv4(),
        userId: adminUser.id,
        tripId: "trip3", // Las Vegas
        fullName: "Admin User",
        email: adminUser.email,
        travelers: 4,
        startDate: (function() { 
          const date = generateRandomDate();
          this.returnDate = getReturnDate(date, 5, 7);
          return date;
        })(),
        returnDate: null, // Set by the start date function
        tripType: "round-trip",
        departureTime: "afternoon",
        returnTime: "afternoon",
        hotelId: "hotel3-2", // Vegas Luxury Suites
        carRentalId: "car3-1", // Ford Mustang Convertible
        totalPrice: 5730,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        specialRequests: "Non-smoking rooms, convertible car with GPS"
      },
      
      // Scenario 4: Family trip to Orlando
      {
        id: uuidv4(),
        userId: testUser.id,
        tripId: "trip5", // Orlando
        fullName: "John Smith",
        email: testUser.email,
        travelers: 5,
        startDate: (function() { 
          const date = generateRandomDate(new Date(2025, 5, 1), new Date(2025, 6, 30));
          this.returnDate = getReturnDate(date, 7, 10);
          return date;
        })(),
        returnDate: null, // Set by the start date function
        tripType: "round-trip",
        departureTime: "morning",
        returnTime: "afternoon",
        hotelId: "hotel5-3", // Luxury Orlando Villas
        carRentalId: "car5-1", // Chrysler Pacifica
        totalPrice: 8990,
        status: "confirmed",
        confirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        specialRequests: "Need cribs for twin infants, theme park tickets, and grocery delivery"
      },
      
      // Scenario 5: Cancelled booking
      {
        id: uuidv4(),
        userId: testUser.id,
        tripId: "trip4", // Denver
        fullName: "John Smith",
        email: testUser.email,
        travelers: 2,
        startDate: (function() { 
          const date = generateRandomDate();
          this.returnDate = getReturnDate(date);
          return date;
        })(),
        returnDate: null, // Set by the start date function
        tripType: "round-trip",
        departureTime: getRandomTime(),
        returnTime: getRandomTime(),
        hotelId: "hotel4-1", // Rocky Mountain Lodge
        totalPrice: 2496,
        status: "cancelled",
        confirmedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        updatedAt: new Date().toISOString(),
        specialRequests: "Needed to cancel due to emergency"
      }
    ];
    
    // Process and fix the scenarios - need this because of how we generate return dates
    scenarios.forEach(scenario => {
      if (scenario.returnDate === null) {
        scenario.returnDate = getReturnDate(scenario.startDate);
      }
    });

    // Clear existing bookings for clean test data
    dbData.bookings = [];

    // Add each scenario
    scenarios.forEach((scenario, index) => {
      dbData.bookings.push(scenario);
      console.log(`✅ Added scenario ${index + 1}: ${scenario.tripType} to ${scenario.tripId} with status: ${scenario.status}`);
    });
    
    // Write the updated database back to the file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    console.log(`Total of ${scenarios.length} booking scenarios have been saved to the database`);
    
  } catch (error) {
    console.error('Error creating test scenarios:', error);
    process.exit(1);
  }
}

main(); 