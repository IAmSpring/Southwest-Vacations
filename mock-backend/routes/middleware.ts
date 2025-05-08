import { Request, Response, NextFunction } from 'express';
import { extractUserId } from '../auth.js';

// Authentication middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = extractUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.body.userId = userId;
  next();
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  
  res.status(statusCode).json({
    error: message,
    status: 'error'
  });
};

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Not found middleware
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    status: 'error'
  });
}; 