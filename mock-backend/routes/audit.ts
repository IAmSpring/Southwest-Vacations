import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractUserId } from '../auth.js';
import { AuditLogEntry } from '../../src/sharedTypes.js';

const router = express.Router();

// Mock audit log entries
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: uuidv4(),
    userId: '1',
    action: 'login',
    resource: 'auth',
    resourceId: '1',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    details: {},
    status: 'success',
  },
  {
    id: uuidv4(),
    userId: '1',
    action: 'create',
    resource: 'booking',
    resourceId: 'B12345',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    details: {
      bookingId: 'B12345',
      customerName: 'John Doe',
      destination: 'Miami',
      amount: 1250.0,
    },
    status: 'success',
  },
  {
    id: uuidv4(),
    userId: '2',
    action: 'update',
    resource: 'booking',
    resourceId: 'B12345',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.2',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    details: {
      bookingId: 'B12345',
      changes: {
        departureDate: '2023-07-15',
        previousDepartureDate: '2023-07-10',
      },
    },
    status: 'success',
  },
  {
    id: uuidv4(),
    userId: '1',
    action: 'approve',
    resource: 'discount',
    resourceId: 'D5678',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    details: {
      discountId: 'D5678',
      bookingId: 'B12345',
      discountAmount: 200.0,
    },
    status: 'success',
  },
  {
    id: uuidv4(),
    userId: '3',
    action: 'delete',
    resource: 'booking',
    resourceId: 'B98765',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.3',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
    details: {
      bookingId: 'B98765',
      reason: 'Customer request',
    },
    status: 'success',
  },
  {
    id: uuidv4(),
    userId: '2',
    action: 'update',
    resource: 'user',
    resourceId: '4',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.2',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    details: {
      userId: '4',
      changes: {
        email: 'new.email@example.com',
        previousEmail: 'old.email@example.com',
      },
    },
    status: 'success',
  },
  {
    id: uuidv4(),
    userId: '3',
    action: 'login',
    resource: 'auth',
    resourceId: '3',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.4',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    details: {},
    status: 'failure',
    reason: 'Invalid password',
  },
];

// Create a new audit log entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { action, resource, resourceId, details, status, reason } = req.body;

    // Validate required fields
    if (!action || !resource || !resourceId) {
      return res.status(400).json({ error: 'Action, resource, and resourceId are required' });
    }

    // Get client IP address and user agent
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const newLogEntry: AuditLogEntry = {
      id: uuidv4(),
      userId,
      action,
      resource,
      resourceId,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent,
      details: details || {},
      status: status || 'success',
      reason,
    };

    // Add to mock database
    mockAuditLogs.unshift(newLogEntry);

    res.status(201).json(newLogEntry);
  } catch (error) {
    console.error('Error creating audit log:', error);
    res.status(500).json({ error: 'Failed to create audit log' });
  }
});

// Get audit logs with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has permission to view logs
    // For this mock, we'll assume only admin and supervisor roles can view logs
    // In a real implementation, use the role-based permission check

    // Parse query parameters for filtering
    const {
      user,
      action,
      resource,
      resourceId,
      startDate,
      endDate,
      status,
      limit = '50',
      offset = '0',
    } = req.query;

    // Filter logs based on query parameters
    let filteredLogs = [...mockAuditLogs];

    if (user) {
      filteredLogs = filteredLogs.filter(log => log.userId === user);
    }

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    if (resource) {
      filteredLogs = filteredLogs.filter(log => log.resource === resource);
    }

    if (resourceId) {
      filteredLogs = filteredLogs.filter(log => log.resourceId === resourceId);
    }

    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }

    if (startDate) {
      const start = new Date(startDate as string).getTime();
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate as string).getTime();
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp).getTime() <= end);
    }

    // Apply pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    const paginatedLogs = filteredLogs.slice(offsetNum, offsetNum + limitNum);

    res.json({
      total: filteredLogs.length,
      limit: limitNum,
      offset: offsetNum,
      logs: paginatedLogs,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get audit logs for a specific resource
router.get('/resource/:resource/:resourceId', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { resource, resourceId } = req.params;
    const limit = parseInt((req.query.limit as string) || '10', 10);

    // Filter logs for the specified resource
    const resourceLogs = mockAuditLogs
      .filter(log => log.resource === resource && log.resourceId === resourceId)
      .slice(0, limit);

    res.json(resourceLogs);
  } catch (error) {
    console.error('Error fetching resource audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch resource audit logs' });
  }
});

// Get audit logs for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const requesterId = extractUserId(req);
    if (!requesterId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const targetUserId = req.params.userId;
    const limit = parseInt((req.query.limit as string) || '50', 10);

    // Check if user is requesting their own logs or if they have admin permissions
    // In a real implementation, check roles and permissions

    // Filter logs for the specified user
    const userLogs = mockAuditLogs.filter(log => log.userId === targetUserId).slice(0, limit);

    res.json(userLogs);
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch user audit logs' });
  }
});

export default router;
