import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import fs from 'fs';
import path from 'path';
import { extractUserId } from '../auth.js';

const router = express.Router();

// Middleware to verify admin permissions
const adminMiddleware = (req: Request, res: Response, next: Function) => {
  const userId = extractUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = db.get('users').find({ id: userId }).value();
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Admin permissions required' });
  }

  next();
};

// Helper to get data file path
const getDataPath = (collection: string) => {
  return path.join(process.cwd(), 'mock-backend', 'data', `${collection}.json`);
};

// Helper to read data file
const readInventoryFile = (collection: string) => {
  try {
    const filePath = getDataPath(collection);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${collection} data:`, error);
    return [];
  }
};

// Helper to write data file
const writeInventoryFile = (collection: string, data: any[]) => {
  try {
    const filePath = getDataPath(collection);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${collection} data:`, error);
    return false;
  }
};

// Sync data between db.json and individual collection files
const syncInventoryData = () => {
  try {
    const collections = ['flights', 'hotels', 'vehicles'];

    for (const collection of collections) {
      // Read the collection file
      const collectionData = readInventoryFile(collection);

      // Update db.json with the collection data
      db.set(collection, collectionData).write();
    }

    return true;
  } catch (error) {
    console.error('Error syncing inventory data:', error);
    return false;
  }
};

// Initialize by syncing data
syncInventoryData();

// --- FLIGHT ROUTES ---

// Get all flights with filtering
router.get('/flights', async (req: Request, res: Response) => {
  try {
    const { origin, destination, date, tripId, limit = 50 } = req.query;

    let flights = db.get('flights').value();

    // Apply filters
    if (origin) {
      flights = flights.filter(
        flight => flight.origin.toLowerCase() === String(origin).toLowerCase()
      );
    }

    if (destination) {
      flights = flights.filter(
        flight => flight.destination.toLowerCase() === String(destination).toLowerCase()
      );
    }

    if (date) {
      flights = flights.filter(flight => flight.dates && flight.dates.includes(String(date)));
    }

    if (tripId) {
      flights = flights.filter(flight => flight.tripId === String(tripId));
    }

    // External API integration point would be here
    // This would call a real flight API and merge results

    // Apply limit
    if (limit) {
      flights = flights.slice(0, Number(limit));
    }

    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Get flight by ID
router.get('/flights/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const flight = db.get('flights').find({ id }).value();

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ error: 'Failed to fetch flight' });
  }
});

// Add a new flight (admin only)
router.post('/flights', adminMiddleware, (req: Request, res: Response) => {
  try {
    const flightData = req.body;

    // Validate required fields
    if (!flightData.flightNumber || !flightData.origin || !flightData.destination) {
      return res.status(400).json({ error: 'Missing required flight information' });
    }

    const newFlight = {
      id: `flight-${uuidv4().substring(0, 8)}`,
      ...flightData,
      createdAt: new Date().toISOString(),
    };

    // Add to database
    db.get('flights').push(newFlight).write();

    // Update the collection file
    const flights = db.get('flights').value();
    writeInventoryFile('flights', flights);

    res.status(201).json(newFlight);
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ error: 'Failed to create flight' });
  }
});

// --- HOTEL ROUTES ---

// Get all hotels with filtering
router.get('/hotels', (req: Request, res: Response) => {
  try {
    const { location, tripId, dates, priceMin, priceMax, limit = 50 } = req.query;

    let hotels = db.get('hotels').value();

    // Apply filters
    if (location) {
      hotels = hotels.filter(hotel =>
        hotel.location.toLowerCase().includes(String(location).toLowerCase())
      );
    }

    if (tripId) {
      hotels = hotels.filter(hotel => hotel.tripId === String(tripId));
    }

    if (dates) {
      const dateStr = String(dates);
      hotels = hotels.filter(
        hotel => hotel.availabilityDates && hotel.availabilityDates.includes(dateStr)
      );
    }

    if (priceMin) {
      hotels = hotels.filter(hotel => hotel.pricePerNight >= Number(priceMin));
    }

    if (priceMax) {
      hotels = hotels.filter(hotel => hotel.pricePerNight <= Number(priceMax));
    }

    // External API integration point for real hotel data
    // This would call hotel provider APIs like Expedia, Booking.com, etc.

    // Apply limit
    if (limit) {
      hotels = hotels.slice(0, Number(limit));
    }

    res.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get hotel by ID
router.get('/hotels/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hotel = db.get('hotels').find({ id }).value();

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

// --- VEHICLE ROUTES ---

// Get all vehicles with filtering
router.get('/vehicles', (req: Request, res: Response) => {
  try {
    const { location, tripId, dates, type, priceMin, priceMax, limit = 50 } = req.query;

    let vehicles = db.get('vehicles').value();

    // Apply filters
    if (location) {
      vehicles = vehicles.filter(
        vehicle =>
          vehicle.rentalLocations &&
          vehicle.rentalLocations.some(loc =>
            loc.toLowerCase().includes(String(location).toLowerCase())
          )
      );
    }

    if (tripId) {
      vehicles = vehicles.filter(vehicle => vehicle.tripId === String(tripId));
    }

    if (dates) {
      const dateStr = String(dates);
      vehicles = vehicles.filter(
        vehicle => vehicle.availability && vehicle.availability.includes(dateStr)
      );
    }

    if (type) {
      vehicles = vehicles.filter(
        vehicle => vehicle.type.toLowerCase() === String(type).toLowerCase()
      );
    }

    if (priceMin) {
      vehicles = vehicles.filter(vehicle => vehicle.pricePerDay >= Number(priceMin));
    }

    if (priceMax) {
      vehicles = vehicles.filter(vehicle => vehicle.pricePerDay <= Number(priceMax));
    }

    // External API integration point for real car rental data
    // This would connect to Hertz, Enterprise, Avis, Budget, etc.

    // Apply limit
    if (limit) {
      vehicles = vehicles.slice(0, Number(limit));
    }

    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID
router.get('/vehicles/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = db.get('vehicles').find({ id }).value();

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Get partner rental companies
router.get('/rental-partners', (req: Request, res: Response) => {
  try {
    // Simulated rental partner data (in a real app, this would be from a database)
    const rentalPartners = [
      {
        id: 'hertz',
        name: 'Hertz',
        logo: '/images/logos/hertz-logo.png',
        apiEndpoint: 'https://api.hertz.com/v1',
        isActive: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        logo: '/images/logos/enterprise-logo.png',
        apiEndpoint: 'https://api.enterprise.com/v1',
        isActive: true,
      },
      {
        id: 'avis',
        name: 'Avis',
        logo: '/images/logos/avis-logo.png',
        apiEndpoint: 'https://api.avis.com/v1',
        isActive: true,
      },
      {
        id: 'budget',
        name: 'Budget',
        logo: '/images/logos/budget-logo.png',
        apiEndpoint: 'https://api.budget.com/v1',
        isActive: true,
      },
    ];

    res.json(rentalPartners);
  } catch (error) {
    console.error('Error fetching rental partners:', error);
    res.status(500).json({ error: 'Failed to fetch rental partners' });
  }
});

// Get hotel chains
router.get('/hotel-chains', (req: Request, res: Response) => {
  try {
    // Simulated hotel chain data (in a real app, this would be from a database)
    const hotelChains = [
      {
        id: 'marriott',
        name: 'Marriott International',
        logo: '/images/logos/marriott-logo.png',
        apiEndpoint: 'https://api.marriott.com/v1',
        isActive: true,
      },
      {
        id: 'hilton',
        name: 'Hilton Hotels & Resorts',
        logo: '/images/logos/hilton-logo.png',
        apiEndpoint: 'https://api.hilton.com/v1',
        isActive: true,
      },
      {
        id: 'hyatt',
        name: 'Hyatt Hotels Corporation',
        logo: '/images/logos/hyatt-logo.png',
        apiEndpoint: 'https://api.hyatt.com/v1',
        isActive: true,
      },
      {
        id: 'ihg',
        name: 'InterContinental Hotels Group',
        logo: '/images/logos/ihg-logo.png',
        apiEndpoint: 'https://api.ihg.com/v1',
        isActive: true,
      },
    ];

    res.json(hotelChains);
  } catch (error) {
    console.error('Error fetching hotel chains:', error);
    res.status(500).json({ error: 'Failed to fetch hotel chains' });
  }
});

// Sync inventory data (admin only)
router.post('/sync', adminMiddleware, (req: Request, res: Response) => {
  try {
    const success = syncInventoryData();

    if (success) {
      res.json({ message: 'Inventory data synced successfully' });
    } else {
      res.status(500).json({ error: 'Failed to sync inventory data' });
    }
  } catch (error) {
    console.error('Error syncing inventory data:', error);
    res.status(500).json({ error: 'Failed to sync inventory data' });
  }
});

export default router;
