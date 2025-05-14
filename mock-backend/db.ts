import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  Trip,
  TripDetail,
  User,
  Favorite,
  Booking,
  UserActivity,
  Promotion,
} from '../src/sharedTypes.js';

// Define database schema
export type Schema = {
  trips: any[];
  users: any[];
  bookings: any[];
  favorites: any[];
  promotions: any[];
  aiThreads: any[];
  adminAiThreads: any[];
};

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Class for database operations
class DB {
  public data: Schema;
  private filePath: string;
  
  constructor() {
    // Ensure the data directory exists
    const DB_DIR = path.join(process.cwd(), 'data');
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    
    this.filePath = path.join(DB_DIR, 'db.json');
    
    // Default empty data structure
    this.data = {
      trips: [],
      users: [],
      bookings: [],
      favorites: [],
      promotions: [],
      aiThreads: [],
      adminAiThreads: []
    };
    
    this.loadData();
  }
  
  private loadData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, 'utf8');
        this.data = JSON.parse(fileData);
      } else {
        // Create default data if file doesn't exist
        this.data = {
          trips: [
            {
              id: "trip1",
              destination: "Hawaii",
              imageUrl: "/images/southwest-hawaii.jpg",
              price: 1299,
              description: "Experience the beauty of Hawaii with Southwest Airlines. Enjoy pristine beaches, volcanic landscapes, and rich cultural heritage.",
              datesAvailable: ["2025-06-01", "2025-07-01", "2025-08-01"]
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
          aiThreads: [],
          adminAiThreads: []
        };
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
  }
  
  public async read() {
    this.loadData();
    return this.data;
  }
  
  public async write() {
    await this.saveData();
  }
  
  private saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }
  
  // Helper methods for backward compatibility
  public get(collection: keyof Schema) {
    return {
      value: () => this.data[collection],
      find: (predicate: (item: any) => boolean) => {
        return this.data[collection].find(predicate);
      },
      push: (item: any) => {
        this.data[collection].push(item);
        return {
          write: async () => {
            await this.saveData();
          }
        };
      }
    };
  }
}

// Create database instance
const db = new DB();

export default db;
