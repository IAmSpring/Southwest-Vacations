// Simple backend for testing purposes with AI Assistant support
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
const dbFiles = ['users.json', 'trips.json', 'bookings.json', 'favorites.json', 'aiThreads.json'];
dbFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    const initialData = file === 'users.json' 
      ? JSON.stringify([
          {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: '$2a$10$XvjzWhU12pFlM1gfz9i5qekPkwxal3sI9dDdU2PaWRZPNz.MsIEqG', // Password123
            createdAt: new Date().toISOString(),
            isAdmin: false,
            role: 'agent'
          },
          {
            id: '2',
            username: 'admin',
            email: 'admin@example.com',
            passwordHash: '$2a$10$7j9uOJh0TYIVJ51f.KLfKO6z5g8z6G0H7uiP7Mmz0DrvuKfHW31oe', // Admin123
            createdAt: new Date().toISOString(),
            isAdmin: true,
            role: 'admin'
          }
        ]) 
      : JSON.stringify([]);
    fs.writeFileSync(filePath, initialData);
  }
});

// Simple in-memory database for testing
const db = {
  users: JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8')),
  trips: JSON.parse(fs.readFileSync(path.join(dataDir, 'trips.json'), 'utf8')),
  bookings: JSON.parse(fs.readFileSync(path.join(dataDir, 'bookings.json'), 'utf8')),
  favorites: JSON.parse(fs.readFileSync(path.join(dataDir, 'favorites.json'), 'utf8')),
  aiThreads: JSON.parse(fs.readFileSync(path.join(dataDir, 'aiThreads.json'), 'utf8')),
};

// Save changes to disk
const saveDB = () => {
  Object.keys(db).forEach(collection => {
    fs.writeFileSync(
      path.join(dataDir, `${collection}.json`),
      JSON.stringify(db[collection], null, 2)
    );
  });
};

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // For tests, we'll use a simple token verification
  try {
    // In a real app, verify JWT here
    // For tests, we'll use the token as the user ID or set it to 1
    req.user = {
      id: token === 'fake-jwt-token' ? '1' : token,
      role: token === 'fake-jwt-token' ? 'user' : 'admin'
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // For tests, accept any valid-looking credentials
  if (email && password) {
    // Return fake JWT token
    const isAdmin = email.includes('admin');
    const token = isAdmin ? 'admin-token' : 'fake-jwt-token';
    
    res.json({
      token,
      user: {
        id: isAdmin ? '2' : '1',
        name: isAdmin ? 'Admin User' : 'Test User',
        email: email,
        role: isAdmin ? 'admin' : 'user'
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/users/profile', authMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return user info without sensitive data
  const { passwordHash, ...userInfo } = user;
  res.json(userInfo);
});

// Trip routes
app.get('/api/trips', (req, res) => {
  // Return trips with optional filtering
  res.json(db.trips);
});

app.get('/api/trips/:id', (req, res) => {
  const trip = db.trips.find(t => t.id === req.params.id);
  
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  
  res.json(trip);
});

// Booking routes
app.post('/api/bookings', authMiddleware, (req, res) => {
  const bookingData = req.body;
  
  // Create a new booking
  const newBooking = {
    id: `booking-${Date.now()}`,
    userId: req.user.id,
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  
  db.bookings.push(newBooking);
  saveDB();
  
  res.status(201).json(newBooking);
});

app.get('/api/bookings', authMiddleware, (req, res) => {
  // Get user's bookings
  const userBookings = db.bookings.filter(b => b.userId === req.user.id);
  res.json(userBookings);
});

// Favorites routes
app.post('/api/favorites', authMiddleware, (req, res) => {
  const { tripId } = req.body;
  
  if (!tripId) {
    return res.status(400).json({ error: 'Trip ID is required' });
  }
  
  // Check if already in favorites
  const existing = db.favorites.find(f => f.userId === req.user.id && f.tripId === tripId);
  if (existing) {
    return res.status(409).json({ error: 'Trip already in favorites' });
  }
  
  // Add to favorites
  const newFavorite = {
    id: `fav-${Date.now()}`,
    userId: req.user.id,
    tripId,
    createdAt: new Date().toISOString(),
  };
  
  db.favorites.push(newFavorite);
  saveDB();
  
  res.status(201).json(newFavorite);
});

app.get('/api/favorites', authMiddleware, (req, res) => {
  // Get user's favorites
  const userFavorites = db.favorites.filter(f => f.userId === req.user.id);
  res.json(userFavorites);
});

// AI Assistant Routes
// Get all threads for the authenticated user
app.get('/api/ai/threads', authMiddleware, (req, res) => {
  // Get user's threads
  const userThreads = db.aiThreads.filter(t => t.userId === req.user.id);
  
  // Sort by most recent update
  userThreads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  // Return threads with limited message preview
  const threadsWithPreview = userThreads.map(thread => ({
    ...thread,
    messages: thread.messages.slice(-2)
  }));
  
  res.json(threadsWithPreview);
});

// Get a specific thread
app.get('/api/ai/threads/:threadId', authMiddleware, (req, res) => {
  const thread = db.aiThreads.find(
    thread => thread.id === req.params.threadId && thread.userId === req.user.id
  );

  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  res.json(thread);
});

// Create a new thread
app.post('/api/ai/threads', authMiddleware, (req, res) => {
  const { title = 'New Conversation' } = req.body;
  
  const newThread = {
    id: uuidv4(),
    userId: req.user.id,
    title,
    messages: [
      {
        id: uuidv4(),
        role: 'system',
        content: 'I am an AI assistant for Southwest Vacations. I can help you find destinations, answer questions about bookings, and provide travel recommendations.',
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.aiThreads.push(newThread);
  saveDB();

  res.status(201).json(newThread);
});

// Send a message to a thread and get AI response
app.post('/api/ai/threads/:threadId/messages', authMiddleware, (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Message content is required' });
  }

  // Find the thread
  const threadIndex = db.aiThreads.findIndex(
    thread => thread.id === req.params.threadId && thread.userId === req.user.id
  );

  if (threadIndex === -1) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  const thread = db.aiThreads[threadIndex];

  // Add user message
  const userMessage = {
    id: uuidv4(),
    role: 'user',
    content,
    createdAt: new Date().toISOString()
  };
  
  thread.messages.push(userMessage);
  thread.updatedAt = new Date().toISOString();

  // Generate AI response
  const jsonResponse = {
    message: '',
    suggestions: [],
    status: 'success',
    timestamp: new Date().toISOString()
  };
  
  const lowercaseMessage = content.toLowerCase();
  
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
    jsonResponse.message = 'Hello! How can I help you with your Southwest Vacations plans today?';
    jsonResponse.suggestions = [
      'Tell me about popular destinations',
      'How do I book a flight?',
      'What deals are available now?'
    ];
  } else if (lowercaseMessage.includes('booking') || lowercaseMessage.includes('reservation')) {
    jsonResponse.message = 'I can help you with your booking. What specific information do you need about your reservation?';
    jsonResponse.suggestions = [
      'How do I modify my booking?',
      'Can I add hotel to my flight reservation?',
      "What's your cancellation policy?"
    ];
  } else if (lowercaseMessage.includes('flight') || lowercaseMessage.includes('flights')) {
    jsonResponse.message = 'Southwest Airlines offers flights to many destinations. When are you planning to travel and where would you like to go?';
    jsonResponse.suggestions = [
      'Show me flights to Hawaii',
      "What's included in my flight?",
      'Do you offer international flights?'
    ];
  } else {
    jsonResponse.message = 'Thank you for your message. How else can I assist you with your Southwest Vacations experience?';
    jsonResponse.suggestions = [
      'Tell me about your services',
      'I need help with a booking',
      'What destinations do you offer?'
    ];
  }
  
  // Create the AI message
  const aiMessage = {
    id: uuidv4(),
    role: 'assistant',
    content: JSON.stringify(jsonResponse, null, 2),
    createdAt: new Date().toISOString()
  };
  
  thread.messages.push(aiMessage);
  
  // Update the thread in the database
  db.aiThreads[threadIndex] = thread;
  saveDB();

  res.json(thread);
});

// Admin routes for AI threads
app.get('/api/admin/ai/threads', authMiddleware, adminMiddleware, (req, res) => {
  // Get all threads (admin access)
  const allThreads = db.aiThreads;
  
  // Sort by most recent update
  allThreads.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  // Return threads with limited message preview
  const threadsWithPreview = allThreads.map(thread => ({
    ...thread,
    messages: thread.messages.slice(-1)
  }));
  
  res.json(threadsWithPreview);
});

app.get('/api/admin/ai/threads/:threadId', authMiddleware, adminMiddleware, (req, res) => {
  // Get specific thread (admin access)
  const thread = db.aiThreads.find(thread => thread.id === req.params.threadId);

  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  res.json(thread);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Southwest Vacations Test API with AI Support' });
});

// Create sample data if needed
if (db.trips.length === 0) {
  // Add some sample trips
  const sampleTrips = [
    {
      id: 'trip-1',
      destination: 'Cancun, Mexico',
      image: 'https://example.com/cancun.jpg',
      price: 599.99,
      duration: 7,
      description: 'Enjoy the beautiful beaches of Cancun',
      departingFrom: 'Phoenix, AZ',
    },
    {
      id: 'trip-2',
      destination: 'Las Vegas, USA',
      image: 'https://example.com/vegas.jpg',
      price: 399.99,
      duration: 3,
      description: 'Experience the excitement of Las Vegas',
      departingFrom: 'Dallas, TX',
    },
    {
      id: 'trip-3',
      destination: 'Orlando, USA',
      image: 'https://example.com/orlando.jpg',
      price: 499.99,
      duration: 5,
      description: 'Visit the world-famous theme parks',
      departingFrom: 'Chicago, IL',
    },
  ];
  
  db.trips.push(...sampleTrips);
  saveDB();
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Test backend server with AI support running on port ${PORT}`);
}); 