import express from 'express';
import db from '../db.js';
import { registerUser, loginUser, extractUserId, getUserById } from '../auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await registerUser(username, email, password);
    if (!user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Return success without sensitive data
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    
    const token = await loginUser(email, password);
    if (!token) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Return token
    res.json({ token: token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/me', (req, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user without password hash
    const { passwordHash, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user bookings for Manage Vacations page
router.get('/:userId/bookings', (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = extractUserId(req);
    
    // Ensure user is authenticated and requesting their own bookings
    if (!currentUserId || (currentUserId !== userId && currentUserId !== 'admin')) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    // Get all bookings for this user
    const bookings = db.get('bookings')
      .filter({ userId: userId })
      .value();
      
    // Get trip details for each booking
    const bookingsWithDetails = bookings.map(booking => {
      const trip = db.get('trips')
        .find({ id: booking.tripId })
        .value();
        
      return {
        ...booking,
        destination: trip ? trip.destination : 'Unknown Destination',
        imageUrl: trip ? trip.imageUrl : '',
        duration: trip ? trip.duration || 0 : 0
      };
    });
    
    res.json(bookingsWithDetails);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 