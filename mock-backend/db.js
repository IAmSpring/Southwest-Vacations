import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define the type of our database
export class Database {
  data;
  
  constructor() {
    this.data = {
      trips: [],
      users: [],
      bookings: [],
      favorites: [],
      promotions: [],
      aiThreads: [],  // Add aiThreads to store AI assistant conversations
      adminAiThreads: []  // New collection for admin AI threads
    };
  }
}

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the data directory exists
const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'db.json');

// Initialize with default data if file doesn't exist
if (!fs.existsSync(DB_PATH)) {
  // Create default data structure
  const defaultData = {
    trips: [
      {
        id: "trip1",
        destination: "Hawaii",
        imageUrl: "/images/southwest-hawaii.jpg",
        price: 1299,
        description: "Experience the beauty of Hawaii with Southwest Airlines. Enjoy pristine beaches, volcanic landscapes, and rich cultural heritage.",
        datesAvailable: ["2025-06-01", "2025-07-01", "2025-08-01"],
        hotels: [
          {
            id: "hotel1-1",
            name: "Hawaiian Paradise Resort",
            location: "Waikiki Beach",
            pricePerNight: 299,
            rating: 4.7,
            amenities: ["Beach Access", "Pool", "Spa", "Free WiFi", "Restaurant"],
            imageUrl: "/images/hotel-hawaii-1.jpg"
          },
          {
            id: "hotel1-2",
            name: "Tropical Beach Hotel",
            location: "Maui",
            pricePerNight: 349,
            rating: 4.8,
            amenities: ["Ocean View", "Pool", "Golf Course", "Free Breakfast", "Fitness Center"],
            imageUrl: "/images/hotel-hawaii-2.jpg"
          }
        ]
      },
      {
        id: "trip2",
        destination: "Cancun",
        imageUrl: "/images/southwest-cancun.jpg",
        price: 899,
        description: "Relax on the stunning beaches of Cancun with Southwest Airlines. Crystal-clear waters, vibrant nightlife, and ancient Mayan ruins await.",
        datesAvailable: ["2025-06-15", "2025-07-15", "2025-08-15"]
      },
      {
        id: "trip3",
        destination: "Las Vegas",
        imageUrl: "/images/southwest-vegas.jpg",
        price: 599,
        description: "Experience the excitement of Las Vegas with Southwest Airlines. World-class entertainment, dining, and gaming in the heart of the desert.",
        datesAvailable: ["2025-05-01", "2025-06-01", "2025-07-01"]
      }
    ],
    users: [],
    bookings: [],
    favorites: [],
    promotions: [],
    aiThreads: [],  // Add aiThreads to store AI assistant conversations
    adminAiThreads: []  // New collection for admin AI threads
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
}

// Create the adapter and the db
const adapter = new JSONFile(DB_PATH);
const db = new Low(adapter, new Database());

// Initialize database
await db.read();
if (db.data === null) {
  db.data = new Database().data;
  await db.write();
}

export default db; 