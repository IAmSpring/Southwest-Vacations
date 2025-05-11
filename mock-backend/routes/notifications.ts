import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { Notification, NotificationPreference } from '../../src/sharedTypes.js';
import { extractUserId } from '../auth.js';

const router = express.Router();

// Mock notifications data for testing
const mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    userId: '1',
    title: 'Booking Confirmed',
    content: 'Booking #B12345 has been confirmed successfully.',
    type: 'booking',
    status: 'unread',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    priority: 'high',
    actions: [
      {
        label: 'View Booking',
        url: '/bookings/B12345',
      },
    ],
    relatedId: 'B12345',
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'New Policy Update',
    content: 'The refund policy has been updated. Please review the changes.',
    type: 'policy',
    status: 'unread',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    priority: 'medium',
    actions: [
      {
        label: 'View Policy',
        url: '/policies/refunds',
      },
    ],
    relatedId: 'refunds',
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'System Maintenance',
    content:
      'The system will be undergoing maintenance on Sunday, June 30th from 2:00 AM to 5:00 AM CDT.',
    type: 'system',
    status: 'read',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    priority: 'low',
    actions: [
      {
        label: 'Learn More',
        url: '/announcements',
      },
    ],
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'Training Certification Expiring',
    content:
      'Your "Booking System Fundamentals" certification will expire in 30 days. Please renew it.',
    type: 'training',
    status: 'unread',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    priority: 'medium',
    actions: [
      {
        label: 'Renew Certification',
        url: '/training/course/1',
      },
    ],
    relatedId: '1',
  },
  {
    id: uuidv4(),
    userId: '1',
    title: 'New Caribbean Promotions',
    content: 'New promotional offers available for Caribbean destinations. Use code CARIBBEAN2023.',
    type: 'promotion',
    status: 'read',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    priority: 'low',
    actions: [
      {
        label: 'View Promotions',
        url: '/search?category=beach',
      },
    ],
  },
];

// Default notification preferences
const defaultPreference: NotificationPreference = {
  userId: '1',
  emailEnabled: true,
  inAppEnabled: true,
  categories: {
    booking: true,
    system: true,
    policy: true,
    promotion: true,
    training: true,
  },
  emailFrequency: 'daily',
};

// Get notifications for current user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Filter by status if provided
    const status = req.query.status as 'unread' | 'read' | undefined;
    const type = req.query.type as string;
    const limit = parseInt(req.query.limit as string) || 10;

    // Filter notifications by user ID and optional filters
    let userNotifications = mockNotifications.filter(n => n.userId === userId);

    if (status) {
      userNotifications = userNotifications.filter(n => n.status === status);
    }

    if (type) {
      userNotifications = userNotifications.filter(n => n.type === type);
    }

    // Sort by creation date (newest first) and limit results
    userNotifications = userNotifications
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    // Return notifications
    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get notification count by status
router.get('/count', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userNotifications = mockNotifications.filter(n => n.userId === userId);

    const counts = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => n.status === 'unread').length,
      read: userNotifications.filter(n => n.status === 'read').length,
    };

    res.json(counts);
  } catch (error) {
    console.error('Error fetching notification counts:', error);
    res.status(500).json({ error: 'Failed to fetch notification counts' });
  }
});

// Get notification by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const notification = mockNotifications.find(n => n.id === req.params.id && n.userId === userId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const notificationIndex = mockNotifications.findIndex(
      n => n.id === req.params.id && n.userId === userId
    );

    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update notification status
    const updatedNotification = {
      ...mockNotifications[notificationIndex],
      status: 'read' as 'unread' | 'read',
    };

    // In a real implementation, we would update the database
    // For now, we just update our mock data
    mockNotifications[notificationIndex] = updatedNotification;

    res.json(updatedNotification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In a real implementation, we would update the database
    // For now, we just update our mock data
    for (let i = 0; i < mockNotifications.length; i++) {
      if (mockNotifications[i].userId === userId && mockNotifications[i].status === 'unread') {
        mockNotifications[i] = {
          ...mockNotifications[i],
          status: 'read' as 'unread' | 'read',
        };
      }
    }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Get notification preferences
router.get('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In a real implementation, we would query the database
    // For now, we just return our mock data
    res.json(defaultPreference);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences
router.put('/preferences', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updatedPreferences = req.body;

    // Validate preferences
    if (!updatedPreferences) {
      return res.status(400).json({ error: 'Invalid preferences' });
    }

    // In a real implementation, we would update the database
    // For now, we just update our mock data
    const newPreferences = {
      ...defaultPreference,
      ...updatedPreferences,
      userId,
    };

    res.json(newPreferences);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

export default router;
