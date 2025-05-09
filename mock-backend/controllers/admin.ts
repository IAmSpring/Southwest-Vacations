import { Request, Response } from 'express';
import db from '../db.js';
import { AdminStats, UserAnalytics, User, Booking } from '../../src/sharedTypes.js';

// Get admin dashboard stats
export const getAdminStats = (req: Request, res: Response) => {
  try {
    // Get all users from database
    const users = db.get('users').value() as User[];
    const totalUsers = users.length;
    
    // Count active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = users.filter(user => {
      return user.lastLoginAt && new Date(user.lastLoginAt) > thirtyDaysAgo;
    }).length;
    
    // Get all bookings
    const bookings = db.get('bookings').value() as Booking[];
    const totalBookings = bookings.length;
    
    // Calculate revenue
    const allBookings = bookings || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const revenueToday = allBookings
      .filter(booking => new Date(booking.createdAt) >= today)
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    const revenueThisWeek = allBookings
      .filter(booking => new Date(booking.createdAt) >= startOfWeek)
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    const revenueThisMonth = allBookings
      .filter(booking => new Date(booking.createdAt) >= startOfMonth)
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    // Calculate popular destinations
    const destinationMap: Record<string, number> = {};
    allBookings.forEach(booking => {
      if (!destinationMap[booking.tripId]) {
        destinationMap[booking.tripId] = 0;
      }
      destinationMap[booking.tripId]++;
    });
    
    const popularDestinations = Object.entries(destinationMap)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Get booking statuses
    const bookingsByStatus: Record<Booking['status'], number> = {
      confirmed: 0,
      pending: 0,
      cancelled: 0
    };
    
    allBookings.forEach(booking => {
      bookingsByStatus[booking.status]++;
    });
    
    // Calculate conversion rate (simple estimate)
    // In a real app, this would use actual visitor analytics
    const activities = (db.get('activities').value() || []) as any[];
    const totalVisits = activities.filter(a => a.actionType === 'view_trip').length || 1; // Avoid division by zero
    const conversionRate = totalBookings / totalVisits;
    
    const stats: AdminStats = {
      totalUsers,
      activeUsers,
      totalBookings,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      popularDestinations,
      conversionRate,
      bookingsByStatus
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

// Get all users
export const getAllUsers = (req: Request, res: Response) => {
  try {
    const users = db.get('users').value() as User[];
    
    // Remove password hashes before sending to frontend
    const sanitizedUsers = users.map(({ passwordHash, ...user }) => user);
    
    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user analytics
export const getUserAnalytics = (req: Request, res: Response) => {
  try {
    const users = db.get('users').value() as User[];
    const bookings = db.get('bookings').value() as Booking[];
    const activities = (db.get('activities').value() || []) as any[];
    
    const analytics: UserAnalytics[] = users.map(user => {
      // Get user's bookings
      const userBookings = bookings.filter(b => b.userId === user.id);
      const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      
      // Get user's activities
      const userActivities = activities.filter(a => a.userId === user.id);
      
      // Calculate activity summary
      const activitySummary: Record<string, number> = {};
      userActivities.forEach(activity => {
        if (!activitySummary[activity.actionType]) {
          activitySummary[activity.actionType] = 0;
        }
        activitySummary[activity.actionType]++;
      });
      
      // Get latest activity timestamp
      let lastActivity = user.lastLoginAt || user.createdAt;
      if (userActivities.length > 0) {
        const latestActivity = userActivities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        lastActivity = latestActivity.timestamp;
      }
      
      return {
        userId: user.id,
        username: user.username,
        email: user.email,
        totalBookings: userBookings.length,
        totalSpent,
        lastActivity,
        registrationDate: user.createdAt,
        activitySummary: activitySummary as any
      };
    });
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
};

// Get recent bookings
export const getRecentBookings = (req: Request, res: Response) => {
  try {
    const bookings = db.get('bookings').value() as Booking[];
    
    // Sort by creation date, newest first
    const sortedBookings = [...bookings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Get the 20 most recent bookings
    const recentBookings = sortedBookings.slice(0, 20);
    
    res.json(recentBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ error: 'Failed to fetch recent bookings' });
  }
}; 