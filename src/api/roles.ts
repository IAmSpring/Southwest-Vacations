import { Permission, Role, UserRole } from '../sharedTypes';

const API_URL = '/api/roles';

// Get all permissions (admin/supervisor only)
export const getPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await fetch(`${API_URL}/permissions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// Get all roles (admin only)
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await fetch(`${API_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Get role by ID (admin only)
export const getRoleById = async (roleId: string): Promise<Role> => {
  try {
    const response = await fetch(`${API_URL}/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch role');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

// Get user's role
export const getUserRole = async (
  userId: string
): Promise<{
  userId: string;
  role: Role;
  assignedAt: string;
  assignedBy: string;
  expiresAt?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

// Assign role to user (admin only)
export const assignRole = async (
  userId: string,
  roleId: string,
  expiresAt?: string
): Promise<{
  userId: string;
  role: Role;
  assignedAt: string;
  assignedBy: string;
  expiresAt?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roleId, expiresAt }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign role');
    }

    return await response.json();
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
};

// Check if user has specific permission
export const hasPermission = async (userId: string, permissionName: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/has-permission/${permissionName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check permission');
    }

    const result = await response.json();
    return result.hasPermission;
  } catch (error) {
    console.error('Error checking permission:', error);
    throw error;
  }
};
