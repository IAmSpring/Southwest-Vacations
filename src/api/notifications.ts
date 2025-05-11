// Notifications API module
import { Notification, NotificationPreference } from '../sharedTypes';

const API_URL = '/api/notifications';

// Fetch notifications with optional filters
export const fetchNotifications = async (options?: {
  status?: 'read' | 'unread';
  type?: 'booking' | 'system' | 'policy' | 'promotion' | 'training';
  limit?: number;
}): Promise<Notification[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (options?.status) {
      queryParams.append('status', options.status);
    }

    if (options?.type) {
      queryParams.append('type', options.type);
    }

    if (options?.limit) {
      queryParams.append('limit', options.limit.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Get notification counts
export const getNotificationCounts = async (): Promise<{
  total: number;
  unread: number;
  read: number;
}> => {
  try {
    const response = await fetch(`${API_URL}/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification counts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notification counts:', error);
    throw error;
  }
};

// Get a specific notification by ID
export const getNotificationById = async (id: string): Promise<Notification> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notification details:', error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  try {
    const response = await fetch(`${API_URL}/${id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/mark-all-read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Get notification preferences
export const getNotificationPreferences = async (): Promise<NotificationPreference> => {
  try {
    const response = await fetch(`${API_URL}/preferences`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notification preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (
  preferences: Partial<NotificationPreference>
): Promise<NotificationPreference> => {
  try {
    const response = await fetch(`${API_URL}/preferences`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};
