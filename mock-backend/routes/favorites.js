"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var db_js_1 = __importDefault(require("../db.js"));
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Middleware to verify user is authenticated
var authMiddleware = function (req, res, next) {
    var userId = (0, auth_js_1.extractUserId)(req);
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    req.body.userId = userId;
    next();
};
// Add a trip to favorites
router.post('/', authMiddleware, function (req, res) {
    try {
        var _a = req.body, tripId = _a.tripId, userId = _a.userId;
        if (!tripId) {
            return res.status(400).json({ error: 'Trip ID is required' });
        }
        // Check if trip exists
        var trip = db_js_1.default.get('trips').find({ id: tripId }).value();
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // Check if already in favorites
        var existing = db_js_1.default.get('favorites')
            .find({ userId: userId, tripId: tripId })
            .value();
        if (existing) {
            return res.status(409).json({ error: 'Trip already in favorites' });
        }
        // Create favorite
        var favorite = {
            id: (0, uuid_1.v4)(),
            userId: userId,
            tripId: tripId,
            createdAt: new Date().toISOString()
        };
        // Save to database
        db_js_1.default.get('favorites')
            .push(favorite)
            .write();
        res.status(201).json(favorite);
    }
    catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user's favorites
router.get('/', authMiddleware, function (req, res) {
    try {
        var userId = req.body.userId;
        // Get favorite IDs
        var favorites = db_js_1.default.get('favorites')
            .filter({ userId: userId })
            .value();
        // Get the full trip details for each favorite
        var favoriteTrips = favorites.map(function (favorite) {
            var trip = db_js_1.default.get('trips')
                .find({ id: favorite.tripId })
                .value();
            return {
                favoriteId: favorite.id,
                createdAt: favorite.createdAt,
                trip: trip
            };
        });
        res.json(favoriteTrips);
    }
    catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Remove from favorites
router.delete('/:favoriteId', authMiddleware, function (req, res) {
    try {
        var userId = req.body.userId;
        var favoriteId = req.params.favoriteId;
        // Check if favorite exists and belongs to user
        var favorite = db_js_1.default.get('favorites')
            .find({ id: favoriteId, userId: userId })
            .value();
        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }
        // Remove from database
        db_js_1.default.get('favorites')
            .remove({ id: favoriteId })
            .write();
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
