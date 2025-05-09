import { Low } from 'lowdb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Trip, TripDetail, User, Favorite, Booking, UserActivity } from '../src/sharedTypes.js';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the database schema
type Schema = {
  trips: TripDetail[];
  users: User[];
  favorites: Favorite[];
  bookings: Booking[];
  activities: UserActivity[];
};

// Custom JSONFile adapter that doesn't rely on lowdb imports
class JSONFile<T> {
  private filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async read(): Promise<T | null> {
    try {
      const data = await fs.promises.readFile(this.filename, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      // If the file doesn't exist or can't be read, return null
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async write(data: T): Promise<void> {
    // Create a temporary file name
    const tempFilename = `${this.filename}.tmp`;
    
    // Write to temporary file first (atomic write)
    await fs.promises.writeFile(tempFilename, JSON.stringify(data, null, 2), 'utf8');
    
    // Rename temporary file to the actual filename (atomic operation)
    await fs.promises.rename(tempFilename, this.filename);
  }
}

// Ensure the data directory exists
const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
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
        ],
        carRentals: [
          {
            id: "car1-1",
            company: "Aloha Car Rentals",
            model: "Jeep Wrangler",
            type: "suv",
            pricePerDay: 89,
            imageUrl: "/images/car-jeep.jpg"
          },
          {
            id: "car1-2",
            company: "Island Cars",
            model: "Convertible Mustang",
            type: "luxury",
            pricePerDay: 129,
            imageUrl: "/images/car-mustang.jpg"
          }
        ]
      },
      {
        id: "trip2",
        destination: "Cancun",
        imageUrl: "/images/southwest-cancun.jpg",
        price: 899,
        description: "Relax on the stunning beaches of Cancun with Southwest Airlines. Crystal-clear waters, vibrant nightlife, and ancient Mayan ruins await.",
        datesAvailable: ["2025-06-15", "2025-07-15", "2025-08-15"],
        hotels: [
          {
            id: "hotel2-1",
            name: "Cancun Beachfront Resort",
            location: "Hotel Zone",
            pricePerNight: 249,
            rating: 4.6,
            amenities: ["All-Inclusive", "Beach Access", "Pool", "Spa", "Nightclub"],
            imageUrl: "/images/hotel-cancun-1.jpg"
          },
          {
            id: "hotel2-2",
            name: "Maya Riviera Lodge",
            location: "Playa del Carmen",
            pricePerNight: 279,
            rating: 4.5,
            amenities: ["Swim-up Rooms", "Multiple Restaurants", "Water Sports", "Entertainment"],
            imageUrl: "/images/hotel-cancun-2.jpg"
          }
        ],
        carRentals: [
          {
            id: "car2-1",
            company: "Mexico Drive",
            model: "Volkswagen Jetta",
            type: "midsize",
            pricePerDay: 65,
            imageUrl: "/images/car-jetta.jpg"
          },
          {
            id: "car2-2",
            company: "Cancun Cars",
            model: "Chevrolet Spark",
            type: "economy",
            pricePerDay: 45,
            imageUrl: "/images/car-spark.jpg"
          }
        ]
      },
      {
        id: "trip3",
        destination: "Las Vegas",
        imageUrl: "/images/southwest-vegas.jpg",
        price: 599,
        description: "Experience the excitement of Las Vegas with Southwest Airlines. World-class entertainment, dining, and gaming in the heart of the desert.",
        datesAvailable: ["2025-05-01", "2025-06-01", "2025-07-01"],
        hotels: [
          {
            id: "hotel3-1",
            name: "Desert Oasis Casino & Resort",
            location: "The Strip",
            pricePerNight: 199,
            rating: 4.5,
            amenities: ["Casino", "Multiple Restaurants", "Shows", "Pool", "Spa"],
            imageUrl: "/images/hotel-vegas-1.jpg"
          },
          {
            id: "hotel3-2",
            name: "Vegas Luxury Suites",
            location: "Downtown",
            pricePerNight: 229,
            rating: 4.4,
            amenities: ["All-Suite Rooms", "Rooftop Pool", "Free Airport Shuttle", "24-Hour Room Service"],
            imageUrl: "/images/hotel-vegas-2.jpg"
          }
        ],
        carRentals: [
          {
            id: "car3-1",
            company: "Desert Wheels",
            model: "Ford Mustang Convertible",
            type: "luxury",
            pricePerDay: 110,
            imageUrl: "/images/car-mustang-convertible.jpg"
          },
          {
            id: "car3-2",
            company: "Vegas Auto",
            model: "Toyota Camry",
            type: "midsize",
            pricePerDay: 70,
            imageUrl: "/images/car-camry.jpg"
          }
        ]
      },
      {
        id: "trip4",
        destination: "Denver",
        imageUrl: "/images/southwest-denver.jpg",
        price: 499,
        description: "Explore the natural beauty of Denver with Southwest Airlines. Mountain adventures, urban attractions, and breathtaking landscapes.",
        datesAvailable: ["2025-05-15", "2025-06-15", "2025-07-15"],
        hotels: [
          {
            id: "hotel4-1",
            name: "Rocky Mountain Lodge",
            location: "Downtown Denver",
            pricePerNight: 179,
            rating: 4.3,
            amenities: ["Mountain Views", "Free Breakfast", "Fitness Center", "Spa", "Restaurant"],
            imageUrl: "/images/hotel-denver-1.jpg"
          },
          {
            id: "hotel4-2",
            name: "Urban Altitude Hotel",
            location: "Cherry Creek",
            pricePerNight: 219,
            rating: 4.5,
            amenities: ["Rooftop Pool", "Bar", "Pet Friendly", "Free WiFi", "Business Center"],
            imageUrl: "/images/hotel-denver-2.jpg"
          }
        ],
        carRentals: [
          {
            id: "car4-1",
            company: "Mountain Explorers",
            model: "Jeep Grand Cherokee",
            type: "suv",
            pricePerDay: 85,
            imageUrl: "/images/car-jeep-cherokee.jpg"
          },
          {
            id: "car4-2",
            company: "Denver Auto",
            model: "Subaru Outback",
            type: "midsize",
            pricePerDay: 65,
            imageUrl: "/images/car-outback.jpg"
          }
        ]
      },
      {
        id: "trip5",
        destination: "Orlando",
        imageUrl: "/images/southwest-orlando.jpg",
        price: 699,
        description: "Discover the magic of Orlando with Southwest Airlines. World-famous theme parks, family attractions, and year-round sunshine.",
        datesAvailable: ["2025-05-01", "2025-06-01", "2025-07-01"],
        hotels: [
          {
            id: "hotel5-1",
            name: "Magic Kingdom Resort",
            location: "Near Disney World",
            pricePerNight: 259,
            rating: 4.6,
            amenities: ["Theme Park Shuttle", "Pool", "Kids Club", "Restaurant", "Character Breakfast"],
            imageUrl: "/images/hotel-orlando-1.jpg"
          },
          {
            id: "hotel5-2",
            name: "Sunshine Family Hotel",
            location: "International Drive",
            pricePerNight: 189,
            rating: 4.2,
            amenities: ["Water Park", "Game Room", "Multiple Pools", "Restaurant", "Theme Park Tickets"],
            imageUrl: "/images/hotel-orlando-2.jpg"
          },
          {
            id: "hotel5-3",
            name: "Luxury Orlando Villas",
            location: "Lake Buena Vista",
            pricePerNight: 349,
            rating: 4.8,
            amenities: ["Full Kitchen", "Private Pool", "Multiple Bedrooms", "BBQ Area", "Golf Course"],
            imageUrl: "/images/hotel-orlando-3.jpg"
          }
        ],
        carRentals: [
          {
            id: "car5-1",
            company: "Sunshine Rentals",
            model: "Chrysler Pacifica",
            type: "minivan",
            pricePerDay: 95,
            imageUrl: "/images/car-pacifica.jpg"
          },
          {
            id: "car5-2",
            company: "Family Wheels",
            model: "Toyota Sienna",
            type: "minivan",
            pricePerDay: 89,
            imageUrl: "/images/car-sienna.jpg"
          }
        ]
      },
      {
        id: "trip6",
        destination: "San Francisco",
        imageUrl: "/images/southwest-sanfrancisco.jpg",
        price: 799,
        description: "Experience the charm of San Francisco with Southwest Airlines. Iconic landmarks, diverse neighborhoods, and stunning bay views.",
        datesAvailable: ["2025-05-15", "2025-06-15", "2025-07-15"],
        hotels: [
          {
            id: "hotel6-1",
            name: "Golden Gate Hotel",
            location: "Fisherman's Wharf",
            pricePerNight: 299,
            rating: 4.4,
            amenities: ["Bay Views", "Restaurant", "Bike Rentals", "Concierge", "Walking Tours"],
            imageUrl: "/images/hotel-sf-1.jpg"
          },
          {
            id: "hotel6-2",
            name: "Urban Boutique SF",
            location: "Union Square",
            pricePerNight: 279,
            rating: 4.3,
            amenities: ["Rooftop Bar", "Fitness Center", "Free WiFi", "Business Center", "Restaurant"],
            imageUrl: "/images/hotel-sf-2.jpg"
          },
          {
            id: "hotel6-3",
            name: "Bay View Inn & Spa",
            location: "Nob Hill",
            pricePerNight: 329,
            rating: 4.7,
            amenities: ["Luxury Spa", "Fine Dining", "City Views", "Concierge", "Room Service"],
            imageUrl: "/images/hotel-sf-3.jpg"
          }
        ],
        carRentals: [
          {
            id: "car6-1",
            company: "Bay Area Rentals",
            model: "Toyota Prius",
            type: "economy",
            pricePerDay: 55,
            imageUrl: "/images/car-prius.jpg"
          },
          {
            id: "car6-2",
            company: "SF Luxury Wheels",
            model: "Tesla Model 3",
            type: "luxury",
            pricePerDay: 135,
            imageUrl: "/images/car-tesla.jpg"
          }
        ]
      }
    ],
    users: [],
    favorites: [],
    bookings: [],
    activities: []
  };
  
  // Write the default data to the file
  fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
  console.log('✅ Database initialized with seed data');
}

// Create a class that mimics the lowdb interface but uses the new Low API
class DB {
  private adapter: JSONFile<Schema>;
  private db: Low<Schema>;
  private data: Schema;

  constructor() {
    this.adapter = new JSONFile<Schema>(DB_PATH);
    this.db = new Low<Schema>(this.adapter);
    
    // Initialize with empty data
    this.data = { trips: [], users: [], favorites: [], bookings: [], activities: [] };
    
    // Load the data
    this.loadData();
  }

  private async loadData() {
    try {
      await this.db.read();
      
      // Initialize data if not set
      if (this.db.data === null) {
        this.db.data = { trips: [], users: [], favorites: [], bookings: [], activities: [] };
        await this.db.write();
      }
      
      this.data = this.db.data;
    } catch (error) {
      console.error('Error loading database:', error);
    }
  }

  get(collection: keyof Schema) {
    // Create a chainable API similar to lowdb
    return {
      value: () => this.data[collection],
      
      find: (query: Record<string, any>) => {
        const key = Object.keys(query)[0];
        const value = query[key];
        return {
          value: () => this.data[collection].find(item => (item as any)[key] === value),
          assign: (updates: Record<string, any>) => {
            const index = this.data[collection].findIndex(item => (item as any)[key] === value);
            if (index !== -1) {
              this.data[collection][index] = { ...this.data[collection][index], ...updates };
            }
            return { write: () => this.write() };
          }
        };
      },
      
      push: (item: any) => {
        this.data[collection].push(item);
        return { write: () => this.write() };
      },
      
      filter: (query: Record<string, any>) => {
        const key = Object.keys(query)[0];
        const value = query[key];
        return {
          value: () => this.data[collection].filter(item => (item as any)[key] === value)
        };
      },
      
      remove: (query: Record<string, any>) => {
        const key = Object.keys(query)[0];
        const value = query[key];
        const index = this.data[collection].findIndex(item => (item as any)[key] === value);
        if (index !== -1) {
          this.data[collection].splice(index, 1);
        }
        return { write: () => this.write() };
      },
      
      map: (mapFn: (item: any) => any) => {
        return {
          value: () => this.data[collection].map(mapFn)
        };
      }
    };
  }

  write() {
    this.db.write();
    return this;
  }
}

// Export the database instance
const db = new DB();
export default db; 