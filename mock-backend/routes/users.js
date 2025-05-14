import express from 'express';
import db from '../db.js';
import { registerUser, loginUser, extractUserId, getUserById } from '../auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await registerUser(name, email, password);
    if (!user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Return success without sensitive data
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      membershipLevel: user.membershipLevel,
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
    
    console.log(`Login attempt for ${email}`);
    const result = await loginUser(email, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Return token and user info
    res.json(result);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user without password fields
    const { password, passwordHash, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user bookings for Manage Vacations page
router.get('/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = extractUserId(req);
    
    // Ensure user is authenticated and requesting their own bookings
    // Allow admins and agents to view any user's bookings
    const currentUser = await getUserById(currentUserId);
    const isEmployeeOrOwnBookings = 
      (currentUser && currentUser.isEmployee) || 
      (currentUserId === userId);

    if (!currentUserId || !isEmployeeOrOwnBookings) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    await db.read();
    
    // Get all bookings for this user
    const bookings = db.data.bookings.filter(booking => booking.userId === userId);
      
    // Get trip details for each booking
    const bookingsWithDetails = bookings.map(booking => {
      const trip = db.data.trips.find(trip => trip.id === booking.tripId);
        
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