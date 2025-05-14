// Simple backend for testing purposes (TypeScript version)
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define types for our data
interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  isAdmin: boolean;
  role: string;
}

interface Trip {
  id: string;
  destination: string;
  price: number;
  description: string;
  imageUrl: string;
  datesAvailable: string[];
  [key: string]: any;
}

interface Booking {
  id: string;
  userId: string;
  tripId: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  [key: string]: any;
}

interface Favorite {
  id: string;
  userId: string;
  tripId: string;
  createdAt: string;
}

interface Database {
  users: User[];
  trips: Trip[];
  bookings: Booking[];
  favorites: Favorite[];
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
const dbFiles = ['users.json', 'trips.json', 'bookings.json', 'favorites.json'];
dbFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    const initialData = file === 'users.json' 
      ? JSON.stringify([
          {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: '$2a$10$XvjzWhU12pFlM1gfz9i5qekPkwxal3sI9dDdU2PaWRZPNz.MsIEqG', // Password123
            createdAt: new Date().toISOString(),
            isAdmin: false,
            role: 'agent'
          },
          {
            id: '2',
            username: 'admin',
            email: 'admin@example.com',
            passwordHash: '$2a$10$7j9uOJh0TYIVJ51f.KLfKO6z5g8z6G0H7uiP7Mmz0DrvuKfHW31oe', // Admin123
            createdAt: new Date().toISOString(),
            isAdmin: true,
            role: 'admin'
          }
        ]) 
      : JSON.stringify([]);
    fs.writeFileSync(filePath, initialData);
  }
});

// Simple in-memory database for testing
const db: Database = {
  users: JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8')),
  trips: JSON.parse(fs.readFileSync(path.join(dataDir, 'trips.json'), 'utf8')),
  bookings: JSON.parse(fs.readFileSync(path.join(dataDir, 'bookings.json'), 'utf8')),
  favorites: JSON.parse(fs.readFileSync(path.join(dataDir, 'favorites.json'), 'utf8')),
};

// Save changes to disk
const saveDB = (): void => {
  Object.keys(db).forEach(collection => {
    fs.writeFileSync(
      path.join(dataDir, `${collection}.json`),
      JSON.stringify(db[collection as keyof Database], null, 2)
    );
  });
};

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Extend the Request type to include userId
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  // For tests, we'll use a simple token verification
  try {
    // In a real app, verify JWT here
    // For tests, we'll use the token as the user ID or set it to 1
    req.userId = token === 'fake-jwt-token' ? '1' : token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.post('/api/users/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // For tests, accept any valid-looking credentials
  if (email && password) {
    // Return fake JWT token
    res.json({
      token: 'fake-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: email,
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/users/profile', authMiddleware, (req: Request, res: Response) => {
  const user = db.users.find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user info without sensitive data
  const { passwordHash, ...userInfo } = user;
  res.json(userInfo);
});

// Trip routes
app.get('/api/trips', (req: Request, res: Response) => {
  // Return trips with optional filtering
  res.json(db.trips);
});

app.get('/api/trips/:id', (req: Request, res: Response) => {
  const trip = db.trips.find(t => t.id === req.params.id);
  
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  
  res.json(trip);
});

// Booking routes
app.post('/api/bookings', authMiddleware, (req: Request, res: Response) => {
  const bookingData = req.body;
  
  // Create a new booking
  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    userId: req.userId!,
    tripId: bookingData.tripId,
    status: 'confirmed',
    totalPrice: bookingData.totalPrice || 0,
    createdAt: new Date().toISOString(),
    ...bookingData
  };
  
  db.bookings.push(newBooking);
  saveDB();
  
  res.status(201).json(newBooking);
});

app.get('/api/bookings', authMiddleware, (req: Request, res: Response) => {
  // Get user's bookings
  const userBookings = db.bookings.filter(b => b.userId === req.userId);
  res.json(userBookings);
});

// Favorites routes
app.post('/api/favorites', authMiddleware, (req: Request, res: Response) => {
  const { tripId } = req.body;
  
  if (!tripId) {
    return res.status(400).json({ error: 'Trip ID is required' });
  }
  
  // Check if already in favorites
  const existing = db.favorites.find(f => f.userId === req.userId && f.tripId === tripId);
  if (existing) {
    return res.status(409).json({ error: 'Trip already in favorites' });
  }
  
  // Add to favorites
  const newFavorite: Favorite = {
    id: `fav-${Date.now()}`,
    userId: req.userId!,
    tripId,
    createdAt: new Date().toISOString(),
  };
  
  db.favorites.push(newFavorite);
  saveDB();
  
  res.status(201).json(newFavorite);
});

app.get('/api/favorites', authMiddleware, (req: Request, res: Response) => {
  // Get user's favorites
  const userFavorites = db.favorites.filter(f => f.userId === req.userId);
  res.json(userFavorites);
});

app.delete('/api/favorites/:id', authMiddleware, (req: Request, res: Response) => {
  const favoriteId = req.params.id;
  
  // Find the favorite
  const index = db.favorites.findIndex(f => f.id === favoriteId && f.userId === req.userId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  
  // Remove from favorites
  db.favorites.splice(index, 1);
  saveDB();
  
  res.json({ message: 'Favorite removed' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple test backend (TypeScript) server running on port ${PORT}`);
}); 