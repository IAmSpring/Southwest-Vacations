import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Simple in-memory "database"
const users = [
  {
    id: 'user-1',
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
    role: 'user'
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    isAdmin: true
  }
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Southwest Vacations Simple Auth API',
    endpoints: {
      login: 'POST /users/login - { email, password }',
      health: 'GET /health'
    } 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // In a real app, you would generate a JWT here
    const token = `dummy-${user.role}-token-${Date.now()}`;
    
    // Don't send the password back
    const { password, ...userWithoutPassword } = user;
    
    res.json({ 
      token,
      user: userWithoutPassword
    });
    
    console.log(`User logged in: ${user.email} (${user.role})`);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
    console.log(`Failed login attempt for: ${email}`);
  }
});

// Trips endpoint (just returns empty array for now)
app.get('/trips', (req, res) => {
  res.json([]);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Simple Auth Server running on port ${PORT}`);
  console.log(`✅ Server URL: http://localhost:${PORT}/`);
}); 