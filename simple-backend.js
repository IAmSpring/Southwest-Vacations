// Simple Express server for testing Playwright tests
import express from 'express';
import cors from 'cors';
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
    role: 'user'
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'admin'
  }
];

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