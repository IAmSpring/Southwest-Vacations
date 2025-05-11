import { AuditLogEntry } from '../sharedTypes';

const API_URL = '/api/audit';

// Create a new audit log entry
export const createAuditLog = async (data: {
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  status?: 'success' | 'failure';
  reason?: string;
}): Promise<AuditLogEntry> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create audit log');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating audit log:', error);
    throw error;
  }
};

// Get audit logs with filtering
export const getAuditLogs = async (options?: {
  user?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'success' | 'failure';
  limit?: number;
  offset?: number;
}): Promise<{
  total: number;
  limit: number;
  offset: number;
  logs: AuditLogEntry[];
}> => {
  try {
    const queryParams = new URLSearchParams();

    if (options?.user) {
      queryParams.append('user', options.user);
    }

    if (options?.action) {
      queryParams.append('action', options.action);
    }

    if (options?.resource) {
      queryParams.append('resource', options.resource);
    }

    if (options?.resourceId) {
      queryParams.append('resourceId', options.resourceId);
    }

    if (options?.startDate) {
      queryParams.append('startDate', options.startDate);
    }

    if (options?.endDate) {
      queryParams.append('endDate', options.endDate);
    }

    if (options?.status) {
      queryParams.append('status', options.status);
    }

    if (options?.limit) {
      queryParams.append('limit', options.limit.toString());
    }

    if (options?.offset) {
      queryParams.append('offset', options.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audit logs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// Get audit logs for a specific resource
export const getResourceAuditLogs = async (
  resource: string,
  resourceId: string,
  limit?: number
): Promise<AuditLogEntry[]> => {
  try {
    let url = `${API_URL}/resource/${resource}/${resourceId}`;

    if (limit) {
      url += `?limit=${limit}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resource audit logs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching resource audit logs:', error);
    throw error;
  }
};

// Get audit logs for a specific user
export const getUserAuditLogs = async (
  userId: string,
  limit?: number
): Promise<AuditLogEntry[]> => {
  try {
    let url = `${API_URL}/user/${userId}`;

    if (limit) {
      url += `?limit=${limit}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user audit logs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user audit logs:', error);
    throw error;
  }
};
