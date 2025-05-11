import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationPreference } from '../sharedTypes';
import * as NotificationAPI from '../api/notifications';
import { useAuthContext } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (refresh?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  preferences: NotificationPreference | null;
  updatePreferences: (prefs: Partial<NotificationPreference>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const { isAuthenticated } = useAuthContext();

  // Fetch notification counts to update the unread badge
  const fetchUnreadCount = async () => {
    try {
      if (!isAuthenticated) return;

      const counts = await NotificationAPI.getNotificationCounts();
      setUnreadCount(counts.unread);
    } catch (err) {
      console.error('Error fetching notification counts:', err);
    }
  };

  // Fetch notifications
  const fetchNotifications = async (refresh = false) => {
    try {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(null);

      const notificationsData = await NotificationAPI.fetchNotifications();
      setNotifications(notificationsData);

      // Update unread count
      await fetchUnreadCount();
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error in fetchNotifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      if (!isAuthenticated) return;

      await NotificationAPI.markNotificationAsRead(id);

      // Update local state - mark the notification as read
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, status: 'read' } : notification
        )
      );

      // Update unread count
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      if (!isAuthenticated) return;

      await NotificationAPI.markAllNotificationsAsRead();

      // Update local state - mark all notifications as read
      setNotifications(prev => prev.map(notification => ({ ...notification, status: 'read' })));

      // Update unread count (should be 0 now)
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Fetch notification preferences
  const fetchPreferences = async () => {
    try {
      if (!isAuthenticated) return;

      const prefsData = await NotificationAPI.getNotificationPreferences();
      setPreferences(prefsData);
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }
  };

  // Update notification preferences
  const updatePreferences = async (prefs: Partial<NotificationPreference>) => {
    try {
      if (!isAuthenticated) return;

      const updatedPrefs = await NotificationAPI.updateNotificationPreferences(prefs);
      setPreferences(updatedPrefs);
    } catch (err) {
      console.error('Error updating notification preferences:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchPreferences();

      // Set up polling for new notifications (every 30 seconds)
      const pollingInterval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(pollingInterval);
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    preferences,
    updatePreferences,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
