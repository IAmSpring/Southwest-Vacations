"use strict";
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { extractUserId } from '../auth.js';

const router = express.Router();

// Middleware to verify user is authenticated
const authMiddleware = (req, res, next) => {
    const userId = extractUserId(req);
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    req.body.userId = userId;
    next();
};

// Get all favorites for a user
router.get('/:userId', (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Get user's favorites
        const favorites = db.get('favorites')
            .filter({ userId })
            .value();
        
        // For each favorite, fetch the trip details
        const favoritesWithDetails = favorites.map(favorite => {
            const trip = db.get('trips')
                .find({ id: favorite.tripId })
                .value();
            
            return {
                ...favorite,
                trip: trip || { note: 'Trip no longer available' }
            };
        });
        
        res.json(favoritesWithDetails);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a trip to favorites
router.post('/', authMiddleware, (req, res) => {
    try {
        const { userId, tripId } = req.body;
        
        // Validate required fields
        if (!userId || !tripId) {
            return res.status(400).json({ error: 'Missing userId or tripId' });
        }
        
        // Check if already in favorites
        const existingFavorite = db.get('favorites')
            .find({ userId, tripId })
            .value();
        
        if (existingFavorite) {
            return res.status(409).json({ 
                error: 'Already in favorites',
                favorite: existingFavorite 
            });
        }
        
        // Add to favorites
        const newFavorite = {
            id: uuidv4(),
            userId,
            tripId,
            addedAt: new Date().toISOString()
        };
        
        db.get('favorites')
            .push(newFavorite)
            .write();
        
        res.status(201).json(newFavorite);
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove a trip from favorites
router.delete('/:favoriteId', authMiddleware, (req, res) => {
    try {
        const favoriteId = req.params.favoriteId;
        
        // Check if favorite exists
        const favorite = db.get('favorites')
            .find({ id: favoriteId })
            .value();
        
        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }
        
        // Remove from favorites
        db.get('favorites')
            .remove({ id: favoriteId })
            .write();
        
        res.json({ message: 'Removed from favorites', favoriteId });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
