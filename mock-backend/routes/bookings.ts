import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { Booking, BookingRequest, TripDetail } from '../../src/sharedTypes.js';
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

// Create a new booking
router.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { tripId, fullName, email, travelers, startDate, userId, returnDate, tripType = 'one-way', specialRequests } = req.body;
    
    // Validate required fields
    if (!tripId || !fullName || !email || !travelers || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get trip details to calculate price
    const trip = db.get('trips').find({ id: tripId }).value() as TripDetail;
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Calculate total price based on number of travelers
    const totalPrice = trip.price * travelers;
    
    // Create booking record
    const booking: Booking = {
      id: uuidv4(),
      userId,
      tripId,
      fullName,
      email,
      travelers,
      startDate,
      returnDate,
      tripType, 
      specialRequests,
      totalPrice,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Save to database
    db.get('bookings')
      .push(booking)
      .write();
      
    // Return booking confirmation
    res.status(201).json({
      bookingId: booking.id,
      tripId: booking.tripId,
      confirmedAt: booking.confirmedAt,
      totalPrice: booking.totalPrice
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's bookings
router.get('/user', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    
    const bookings = db.get('bookings')
      .filter({ userId })
      .value();
      
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get booking details
router.get('/:bookingId', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { bookingId } = req.params;
    
    const booking = db.get('bookings')
      .find({ id: bookingId, userId })
      .value();
      
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel booking
router.patch('/:bookingId/cancel', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { bookingId } = req.params;
    
    const booking = db.get('bookings')
      .find({ id: bookingId, userId })
      .value();
      
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update booking status
    db.get('bookings')
      .find({ id: bookingId })
      .assign({ status: 'cancelled' })
      .write();
      
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 