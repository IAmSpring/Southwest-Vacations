import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { Favorite, TripDetail } from '../../src/sharedTypes.js';
import { extractUserId } from '../auth.js';

const router = express.Router();

// Middleware to verify user is authenticated
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const userId = extractUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.body.userId = userId;
  next();
};

// Add a trip to favorites
router.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { tripId, userId } = req.body;
    
    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required' });
    }
    
    // Check if trip exists
    const trip = db.get('trips').find({ id: tripId }).value() as TripDetail;
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Check if already in favorites
    const existing = db.get('favorites')
      .find({ userId, tripId })
      .value() as Favorite;
      
    if (existing) {
      return res.status(409).json({ error: 'Trip already in favorites' });
    }
    
    // Create favorite
    const favorite: Favorite = {
      id: uuidv4(),
      userId,
      tripId,
      createdAt: new Date().toISOString()
    };
    
    // Save to database
    db.get('favorites')
      .push(favorite)
      .write();
      
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's favorites
router.get('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    
    // Get favorite IDs
    const favorites = db.get('favorites')
      .filter({ userId })
      .value() as Favorite[];
      
    // Get the full trip details for each favorite
    const favoriteTrips = favorites.map(favorite => {
      const trip = db.get('trips')
        .find({ id: favorite.tripId })
        .value() as TripDetail;
        
      return {
        favoriteId: favorite.id,
        createdAt: favorite.createdAt,
        trip
      };
    });
    
    res.json(favoriteTrips);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from favorites
router.delete('/:favoriteId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { favoriteId } = req.params;
    
    // Check if favorite exists and belongs to user
    const favorite = db.get('favorites')
      .find({ id: favoriteId, userId })
      .value() as Favorite;
      
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    // Remove from database
    db.get('favorites')
      .remove({ id: favoriteId })
      .write();
      
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 