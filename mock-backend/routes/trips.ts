import express, { Request, Response } from 'express';
import db from '../db.js';
import { Trip, TripDetail } from '../../src/sharedTypes.js';

const router = express.Router();

// Get all trips
router.get('/', (req: Request, res: Response) => {
  try {
    const tripsForDisplay = (db.get('trips').value() as TripDetail[])
      .map(({ description, datesAvailable, ...rest }: TripDetail) => rest);
    res.json(tripsForDisplay);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single trip details
router.get('/:tripId', (req: Request, res: Response) => {
  try {
    const trip = db.get('trips')
      .find({ id: req.params.tripId })
      .value() as TripDetail;
      
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search trips
router.get('/search', (req: Request, res: Response) => {
  try {
    const { destination, minPrice, maxPrice } = req.query;
    
    let filteredTrips = db.get('trips').value() as TripDetail[];
    
    if (destination) {
      const searchTerm = String(destination).toLowerCase();
      filteredTrips = filteredTrips.filter((trip) => 
        trip.destination.toLowerCase().includes(searchTerm)
      );
    }
    
    if (minPrice) {
      filteredTrips = filteredTrips.filter((trip) => 
        trip.price >= Number(minPrice)
      );
    }
    
    if (maxPrice) {
      filteredTrips = filteredTrips.filter((trip) => 
        trip.price <= Number(maxPrice)
      );
    }
    
    // Return summary info only
    const tripsForDisplay = filteredTrips.map(({ description, datesAvailable, ...rest }) => rest);
    
    res.json(tripsForDisplay);
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 