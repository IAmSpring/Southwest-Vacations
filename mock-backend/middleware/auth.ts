import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import db from '../db.js';

// Secret key for JWT
const JWT_SECRET = 'southwest-vacations-secret-key';

// Extended Request interface with user property
export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    isEmployee: boolean;
    role: string;
    membershipLevel?: string;
    employeeId?: string;
  };
}

// Middleware to authenticate requests
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Get the token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Find user
    const user = db.data.users.find((user: any) => user.id === decoded.id);

    if (!user) {
      res.status(401).json({ error: 'Invalid token: User not found' });
      return;
    }

    // Add user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmployee: user.isEmployee || false,
      role: user.role || 'user',
      membershipLevel: user.membershipLevel,
      employeeId: user.employeeId,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: Admin privileges required' });
    return;
  }
  next();
};

// Middleware to check if user is an employee (admin or agent)
export const isEmployee = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.isEmployee) {
    res.status(403).json({ error: 'Access denied: Employee privileges required' });
    return;
  }
  next();
};

// Middleware to check if user is an agent
export const isAgent = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'agent') {
    res.status(403).json({ error: 'Access denied: Agent privileges required' });
    return;
  }
  next();
};
