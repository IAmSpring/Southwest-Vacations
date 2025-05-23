import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { User } from '../../src/sharedTypes.js';
import { trackUserAction } from './activityTracker.js';

// Secret key for JWT
export const JWT_SECRET = 'southwest-vacations-secret-key';

// Extend Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Middleware to authenticate requests
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      
      // Get user from database
      const user = db.get('users')
        .find({ id: (decoded as any).id })
        .value() as User | undefined;
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Attach user to request for use in route handlers
      req.user = user;
      
      // Track user activity
      trackUserAction(
        user.id, 
        'view_trip', 
        `${req.method} ${req.originalUrl}`, 
        { ip: req.ip }
      );
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user is an admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    // Check if the authenticated user is an admin
    if (!req.user?.role || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // User is an admin, proceed
    next();
  });
};

// Middleware to check if user is an employee (admin or agent)
export const requireEmployee = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    // Check if the authenticated user is an employee
    if (!req.user?.isEmployee) {
      return res.status(403).json({ error: 'Employee access required' });
    }
    
    // User is an employee, proceed
    next();
  });
};

// Middleware to check if user is an agent
export const requireAgent = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    // Check if the authenticated user is an agent
    if (!req.user?.role || req.user.role !== 'agent') {
      return res.status(403).json({ error: 'Agent access required' });
    }
    
    // User is an agent, proceed
    next();
  });
}; 