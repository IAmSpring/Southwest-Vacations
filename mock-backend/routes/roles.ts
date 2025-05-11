import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractUserId } from '../auth.js';
import { Permission, Role, UserRoleAssignment, UserRole } from '../../src/sharedTypes.js';

const router = express.Router();

// Mock permissions data
const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'view_bookings',
    description: 'View all bookings',
    resource: 'bookings',
    action: 'read',
  },
  {
    id: '2',
    name: 'create_booking',
    description: 'Create new bookings',
    resource: 'bookings',
    action: 'create',
  },
  {
    id: '3',
    name: 'update_booking',
    description: 'Update existing bookings',
    resource: 'bookings',
    action: 'update',
  },
  {
    id: '4',
    name: 'delete_booking',
    description: 'Delete bookings',
    resource: 'bookings',
    action: 'delete',
  },
  {
    id: '5',
    name: 'view_analytics',
    description: 'View analytics dashboard',
    resource: 'analytics',
    action: 'read',
  },
  {
    id: '6',
    name: 'export_reports',
    description: 'Export reports',
    resource: 'reports',
    action: 'export',
  },
  {
    id: '7',
    name: 'approve_discounts',
    description: 'Approve discount applications',
    resource: 'discounts',
    action: 'approve',
  },
  {
    id: '8',
    name: 'manage_users',
    description: 'Create and manage user accounts',
    resource: 'users',
    action: 'update',
  },
  {
    id: '9',
    name: 'assign_roles',
    description: 'Assign roles to users',
    resource: 'roles',
    action: 'update',
  },
  {
    id: '10',
    name: 'manage_training',
    description: 'Manage training courses and materials',
    resource: 'training',
    action: 'update',
  },
];

// Mock roles with assigned permissions
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'customer',
    displayName: 'Customer',
    description: 'Regular customer account with limited access',
    permissions: ['1'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'agent',
    displayName: 'Booking Agent',
    description: 'Booking agent with access to create and manage bookings',
    permissions: ['1', '2', '3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'supervisor',
    displayName: 'Supervisor',
    description: 'Team supervisor with expanded permissions',
    permissions: ['1', '2', '3', '4', '5', '6', '7'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'admin',
    displayName: 'Administrator',
    description: 'System administrator with full access',
    permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'system',
    displayName: 'System Service',
    description: 'System service account for automated operations',
    permissions: ['1', '2', '3', '4'],
    createdAt: new Date().toISOString(),
  },
];

// Mock role assignments
const mockUserRoleAssignments: UserRoleAssignment[] = [
  {
    userId: '1',
    roleId: '4', // Admin role
    assignedAt: new Date().toISOString(),
    assignedBy: 'system',
  },
  {
    userId: '2',
    roleId: '2', // Agent role
    assignedAt: new Date().toISOString(),
    assignedBy: '1',
  },
];

// Get all permissions
router.get('/permissions', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user's role to check if they can view permissions
    const userRoleAssignment = mockUserRoleAssignments.find(
      assignment => assignment.userId === userId
    );
    if (!userRoleAssignment) {
      return res.status(403).json({ error: 'Forbidden: No role assigned' });
    }

    const userRole = mockRoles.find(role => role.id === userRoleAssignment.roleId);
    if (!userRole || (userRole.name !== 'admin' && userRole.name !== 'supervisor')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    res.json(mockPermissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// Get all roles
router.get('/roles', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user's role to check if they can view roles
    const userRoleAssignment = mockUserRoleAssignments.find(
      assignment => assignment.userId === userId
    );
    if (!userRoleAssignment) {
      return res.status(403).json({ error: 'Forbidden: No role assigned' });
    }

    const userRole = mockRoles.find(role => role.id === userRoleAssignment.roleId);
    if (!userRole || userRole.name !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    res.json(mockRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get role by ID
router.get('/roles/:id', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const roleId = req.params.id;
    const role = mockRoles.find(r => r.id === roleId);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Get user's role to check if they can view roles
    const userRoleAssignment = mockUserRoleAssignments.find(
      assignment => assignment.userId === userId
    );
    if (!userRoleAssignment) {
      return res.status(403).json({ error: 'Forbidden: No role assigned' });
    }

    const userRole = mockRoles.find(r => r.id === userRoleAssignment.roleId);
    if (!userRole || userRole.name !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

// Get user's role
router.get('/users/:id/role', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const targetUserId = req.params.id;

    // Only admin can view other users' roles
    if (userId !== targetUserId) {
      const userRoleAssignment = mockUserRoleAssignments.find(
        assignment => assignment.userId === userId
      );
      if (!userRoleAssignment) {
        return res.status(403).json({ error: 'Forbidden: No role assigned' });
      }

      const userRole = mockRoles.find(role => role.id === userRoleAssignment.roleId);
      if (!userRole || userRole.name !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
    }

    const userRoleAssignment = mockUserRoleAssignments.find(
      assignment => assignment.userId === targetUserId
    );
    if (!userRoleAssignment) {
      return res.status(404).json({ error: 'Role assignment not found' });
    }

    const role = mockRoles.find(role => role.id === userRoleAssignment.roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({
      userId: targetUserId,
      role: role,
      assignedAt: userRoleAssignment.assignedAt,
      assignedBy: userRoleAssignment.assignedBy,
      expiresAt: userRoleAssignment.expiresAt,
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

// Assign role to user
router.post('/users/:id/role', async (req: Request, res: Response) => {
  try {
    const adminId = extractUserId(req);
    if (!adminId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if admin has permission to assign roles
    const adminRoleAssignment = mockUserRoleAssignments.find(
      assignment => assignment.userId === adminId
    );
    if (!adminRoleAssignment) {
      return res.status(403).json({ error: 'Forbidden: No role assigned' });
    }

    const adminRole = mockRoles.find(role => role.id === adminRoleAssignment.roleId);
    if (!adminRole || adminRole.name !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const targetUserId = req.params.id;
    const { roleId, expiresAt } = req.body;

    if (!roleId) {
      return res.status(400).json({ error: 'Role ID is required' });
    }

    // Validate role exists
    const role = mockRoles.find(r => r.id === roleId);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if user already has a role
    const existingAssignmentIndex = mockUserRoleAssignments.findIndex(
      assignment => assignment.userId === targetUserId
    );

    const assignment: UserRoleAssignment = {
      userId: targetUserId,
      roleId: roleId,
      assignedAt: new Date().toISOString(),
      assignedBy: adminId,
      expiresAt: expiresAt,
    };

    if (existingAssignmentIndex >= 0) {
      // Update existing assignment
      mockUserRoleAssignments[existingAssignmentIndex] = assignment;
    } else {
      // Create new assignment
      mockUserRoleAssignments.push(assignment);
    }

    res.status(200).json({
      userId: targetUserId,
      role: role,
      assignedAt: assignment.assignedAt,
      assignedBy: assignment.assignedBy,
      expiresAt: assignment.expiresAt,
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Failed to assign role' });
  }
});

// Check if user has specific permission
router.get('/users/:id/has-permission/:permissionName', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const targetUserId = req.params.id;
    const permissionName = req.params.permissionName;

    // Only admin or the user themselves can check permissions
    if (userId !== targetUserId) {
      const userRoleAssignment = mockUserRoleAssignments.find(
        assignment => assignment.userId === userId
      );
      if (!userRoleAssignment) {
        return res.status(403).json({ error: 'Forbidden: No role assigned' });
      }

      const userRole = mockRoles.find(role => role.id === userRoleAssignment.roleId);
      if (!userRole || userRole.name !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
    }

    // Get user's role assignment
    const userRoleAssignment = mockUserRoleAssignments.find(
      assignment => assignment.userId === targetUserId
    );
    if (!userRoleAssignment) {
      return res.json({ hasPermission: false });
    }

    // Get user's role
    const role = mockRoles.find(role => role.id === userRoleAssignment.roleId);
    if (!role) {
      return res.json({ hasPermission: false });
    }

    // Get permission
    const permission = mockPermissions.find(p => p.name === permissionName);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Check if user's role has the permission
    const hasPermission = role.permissions.includes(permission.id);

    res.json({ hasPermission });
  } catch (error) {
    console.error('Error checking permission:', error);
    res.status(500).json({ error: 'Failed to check permission' });
  }
});

export default router;
