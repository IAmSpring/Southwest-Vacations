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

// Get all bookings with filtering options
router.get('/', (req, res) => {
    try {
        const { status, startDate, endDate, search, sortBy = 'createdAt', sortOrder = 'desc', limit } = req.query;
        let bookings = db.data.bookings || [];

        // Apply filters
        if (status) {
            bookings = bookings.filter(booking => booking.status === status);
        }
        if (startDate) {
            bookings = bookings.filter(booking => booking.startDate >= String(startDate));
        }
        if (endDate) {
            bookings = bookings.filter(booking => booking.startDate <= String(endDate));
        }
        if (search) {
            const searchTerm = String(search).toLowerCase();
            bookings = bookings.filter(booking => {
                return (booking.fullName && booking.fullName.toLowerCase().includes(searchTerm)) ||
                    (booking.email && booking.email.toLowerCase().includes(searchTerm)) ||
                    (booking.confirmationCode && booking.confirmationCode.toLowerCase().includes(searchTerm)) ||
                    booking.id.toLowerCase().includes(searchTerm);
            });
        }

        // Apply sorting
        bookings.sort((a, b) => {
            let comparison = 0;
            const validSortByField = String(sortBy);

            // Handle date comparisons
            if (validSortByField === 'createdAt' || validSortByField === 'startDate') {
                const dateA = new Date(a[validSortByField]);
                const dateB = new Date(b[validSortByField]);
                comparison = dateA.getTime() - dateB.getTime();
            } else if (validSortByField === 'totalPrice') {
                // Handle number comparisons
                comparison = a.totalPrice - b.totalPrice;
            } else {
                // Default to created date
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                comparison = dateA.getTime() - dateB.getTime();
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        // Apply limit
        if (limit) {
            bookings = bookings.slice(0, Number(limit));
        }

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get booking by ID
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const booking = db.data.bookings.find(b => b.id === id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Create a new booking
router.post('/', (req, res) => {
    try {
        const bookingData = req.body;

        // Validate required fields
        if (!bookingData.tripId || !bookingData.fullName || !bookingData.email || !bookingData.startDate) {
            return res.status(400).json({ error: 'Missing required booking information' });
        }

        const newBooking = {
            id: uuidv4(),
            ...bookingData,
            status: 'pending',
            confirmedAt: '',
            createdAt: new Date().toISOString(),
            travelers: bookingData.travelers || 1,
            totalPrice: bookingData.totalPrice || 0
        };

        db.data.bookings.push(newBooking);
        db.write();

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Update booking status
router.put('/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'pending', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const bookingIndex = db.data.bookings.findIndex(b => b.id === id);
        if (bookingIndex === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = db.data.bookings[bookingIndex];
        const updatedBooking = {
            ...booking,
            status,
            updatedAt: new Date().toISOString()
        };

        // If status is being set to confirmed, add confirmation date
        if (status === 'confirmed' && booking.status !== 'confirmed') {
            updatedBooking.confirmedAt = new Date().toISOString();
        }

        db.data.bookings[bookingIndex] = updatedBooking;
        db.write();

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// Update booking details
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const bookingData = req.body;

        const bookingIndex = db.data.bookings.findIndex(b => b.id === id);
        if (bookingIndex === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = db.data.bookings[bookingIndex];

        // Don't allow changing these fields directly
        delete bookingData.id;
        delete bookingData.createdAt;
        delete bookingData.confirmedAt;

        const updatedBooking = {
            ...booking,
            ...bookingData,
            updatedAt: new Date().toISOString()
        };

        db.data.bookings[bookingIndex] = updatedBooking;
        db.write();

        res.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// Delete booking
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        const bookingIndex = db.data.bookings.findIndex(b => b.id === id);
        if (bookingIndex === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        db.data.bookings.splice(bookingIndex, 1);
        db.write();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

export default router;
