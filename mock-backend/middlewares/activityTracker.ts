import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { UserActivity, UserActionType, User } from '../../src/sharedTypes.js';

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to track user activity in the system
 */
export const trackActivity = (actionType: UserActionType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store original end method
    const originalEnd = res.end;
    
    // Override end method to log activity after response is sent
    res.end = function(chunk?: any, encoding?: BufferEncoding | (() => void), callback?: () => void): Response {
      // Call original end method
      originalEnd.call(this, chunk, encoding as BufferEncoding, callback);
      
      // Log user activity only if request was successful (status < 400)
      if (res.statusCode < 400 && req.user) {
        const userId = req.user.id;
        const timestamp = new Date().toISOString();
        
        // Create activity entry
        const activity: UserActivity = {
          id: uuidv4(),
          userId,
          actionType,
          timestamp,
          details: req.originalUrl,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: {
            method: req.method,
            params: req.params,
            query: req.query,
            // Don't log sensitive body data like passwords
            body: actionType === 'login' ? { email: req.body.email } : req.body
          }
        };
        
        // Save to database
        try {
          // Add the activity to a custom db collection
          // Using a separate db API to avoid schema type issues
          const activities = db.get('activities');
          if (activities && typeof activities.push === 'function') {
            activities.push(activity).write();
          } else {
            console.error('Activities collection not available');
          }
        } catch (error) {
          console.error('Error tracking user activity:', error);
        }
      }
      
      return this;
    };
    
    next();
  };
};

/**
 * Track specific user action programmatically (not through middleware)
 */
export const trackUserAction = (
  userId: string, 
  actionType: UserActionType, 
  details?: string, 
  metadata?: Record<string, any>
) => {
  try {
    const activity: UserActivity = {
      id: uuidv4(),
      userId,
      actionType,
      timestamp: new Date().toISOString(),
      details,
      metadata
    };
    
    // Add the activity to a custom db collection
    // Using a separate db API to avoid schema type issues
    const activities = db.get('activities');
    if (activities && typeof activities.push === 'function') {
      activities.push(activity).write();
      return true;
    } else {
      console.error('Activities collection not available');
      return false;
    }
  } catch (error) {
    console.error('Error tracking user action:', error);
    return false;
  }
}; 