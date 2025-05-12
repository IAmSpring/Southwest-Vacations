// Simple Express server for testing Playwright tests
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Test users
const users = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'Password123',
    name: 'Test User',
    role: 'user',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00.000Z'
  }
];

// Store bookings in memory
const bookings = [];

// Helper function to extract user ID from token
const extractUserId = (token) => {
  if (!token) return null;
  const parts = token.split('-');
  return parts.length > 1 ? parts[2] : null;
};

// Routes
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      error: 'Invalid credentials',
      message: 'The email or password you entered is incorrect.'
    });
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token: `test-token-${user.id}`,
    message: 'Login successful'
  });
});

// Get user profile endpoint
app.get('/api/users/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  // Check for auth token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = extractUserId(token);
  
  // Find user
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: 'Not found',
      message: 'User not found'
    });
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
  const authHeader = req.headers.authorization;
  
  // Check for auth token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = extractUserId(token);
  
  // Check if user exists
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      error: 'Not found',
      message: 'User not found'
    });
  }
  
  // Create a new booking
  const bookingData = req.body;
  const newBooking = {
    id: uuidv4(),
    userId,
    ...bookingData,
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
    confirmationCode: `SW${Math.floor(Math.random() * 1000000)}`,
    totalPrice: 299.99,
    paymentStatus: 'paid'
  };
  
  // Add booking to memory storage
  bookings.push(newBooking);
  
  // Return the created booking
  res.status(201).json(newBooking);
});

// Get user's bookings
app.get('/api/bookings/my-bookings', (req, res) => {
  const authHeader = req.headers.authorization;
  
  // Check for auth token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = extractUserId(token);
  
  // Filter bookings for the user
  const userBookings = bookings.filter(booking => booking.userId === userId);
  
  res.json(userBookings);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Southwest Vacations Test Backend',
    endpoints: [
      '/api/users/login - POST: Login endpoint',
      '/api/users/me - GET: Get user profile',
      '/api/bookings - POST: Create a new booking',
      '/api/bookings/my-bookings - GET: Get user bookings',
      '/health - GET: Health check'
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`Simple backend server running at http://localhost:${port}`);
  console.log('Available test accounts:');
  console.log('- test@example.com / Password123 (user role)');
  console.log('- admin@example.com / Admin123 (admin role)');
}); 