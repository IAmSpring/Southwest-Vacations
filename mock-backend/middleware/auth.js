import jwt from 'jsonwebtoken';
import db from '../db.js';

// Secret key for JWT
const JWT_SECRET = 'southwest-vacations-secret-key';

// Middleware to authenticate requests
export const authenticate = (req, res, next) => {
  // Get the token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = db.data.users.find(user => user.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token: User not found' });
    }
    
    // Add user to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,
      role: user.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
  next();
}; 