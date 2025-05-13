import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import { useAuthContext } from './AuthContext';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
  role?: string;
  isAdmin?: boolean;
}

interface AdminContextType {
  users: User[];
  isLoading: boolean;
  error: string | null;
  createUser: (
    username: string,
    email: string,
    password: string,
    role: string
  ) => Promise<User | null>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  fetchUsers: () => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  userThreads: any[];
  selectedThread: any | null;
  loadUserThreads: () => Promise<void>;
  selectThread: (thread: any) => void;
  adminAssistantId: string;
  adminAssistantThreads: any[];
  selectedAdminThread: any | null;
  loadAdminAssistantThreads: () => Promise<void>;
  selectAdminThread: (thread: any) => void;
  createAdminAssistantThread: (title: string) => Promise<any>;
  sendMessageToAdminAssistant: (threadId: string, message: string) => Promise<any>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [userThreads, setUserThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [adminAssistantThreads, setAdminAssistantThreads] = useState<any[]>([]);
  const [selectedAdminThread, setSelectedAdminThread] = useState<any | null>(null);

  // Admin-specific assistant ID
  const adminAssistantId = 'asst_hoKSs6GmjhQWSsvZPVvc3Qqv';

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || !user?.isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const createUser = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      role: string
    ): Promise<User | null> => {
      if (!isAuthenticated || !user?.isAdmin) {
        setError('Unauthorized: Admin access required');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, email, password, role }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create user');
        }

        const newUser = await response.json();
        setUsers(prevUsers => [...prevUsers, newUser]);
        return newUser;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error creating user:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  const resetUserPassword = useCallback(
    async (userId: string): Promise<boolean> => {
      if (!isAuthenticated || !user?.isAdmin) {
        setError('Unauthorized: Admin access required');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reset password');
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error resetting password:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<boolean> => {
      if (!isAuthenticated || !user?.isAdmin) {
        setError('Unauthorized: Admin access required');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete user');
        }

        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error deleting user:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user]
  );

  // Load user threads for admin review
  const loadUserThreads = async () => {
    if (!adminToken || !isAdmin) return;

    try {
      const response = await fetch('/api/admin/ai/threads', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserThreads(data);
      } else {
        console.error('Failed to load user threads');
      }
    } catch (error) {
      console.error('Error loading user threads:', error);
    }
  };

  // Load admin-specific assistant threads
  const loadAdminAssistantThreads = async () => {
    if (!adminToken || !isAdmin) return;

    try {
      const response = await fetch('/api/admin/ai/admin-threads', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminAssistantThreads(data);
      } else {
        console.error('Failed to load admin assistant threads');
      }
    } catch (error) {
      console.error('Error loading admin assistant threads:', error);
    }
  };

  // Select a user thread for review
  const selectThread = async (thread: any) => {
    if (!adminToken || !isAdmin) return;

    try {
      const response = await fetch(`/api/admin/ai/threads/${thread.id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const fullThread = await response.json();
        setSelectedThread(fullThread);
      } else {
        console.error('Failed to load thread details');
      }
    } catch (error) {
      console.error('Error loading thread details:', error);
    }
  };

  // Select an admin assistant thread
  const selectAdminThread = async (thread: any) => {
    if (!adminToken || !isAdmin) return;

    try {
      const response = await fetch(`/api/admin/ai/admin-threads/${thread.id}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const fullThread = await response.json();
        setSelectedAdminThread(fullThread);
      } else {
        console.error('Failed to load admin thread details');
      }
    } catch (error) {
      console.error('Error loading admin thread details:', error);
    }
  };

  // Create a new admin assistant thread
  const createAdminAssistantThread = async (title: string) => {
    if (!adminToken || !isAdmin) return null;

    try {
      const response = await fetch('/api/admin/ai/admin-threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const newThread = await response.json();
        setAdminAssistantThreads(prev => [newThread, ...prev]);
        return newThread;
      } else {
        console.error('Failed to create admin assistant thread');
        return null;
      }
    } catch (error) {
      console.error('Error creating admin assistant thread:', error);
      return null;
    }
  };

  // Send a message to the admin assistant
  const sendMessageToAdminAssistant = async (threadId: string, message: string) => {
    if (!adminToken || !isAdmin) return null;

    try {
      const response = await fetch(`/api/admin/ai/admin-threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ content: message }),
      });

      if (response.ok) {
        const updatedThread = await response.json();
        setAdminAssistantThreads(prev =>
          prev.map(t => (t.id === threadId ? { ...t, updatedAt: updatedThread.updatedAt } : t))
        );

        if (selectedAdminThread?.id === threadId) {
          setSelectedAdminThread(updatedThread);
        }

        return updatedThread;
      } else {
        console.error('Failed to send message to admin assistant');
        return null;
      }
    } catch (error) {
      console.error('Error sending message to admin assistant:', error);
      return null;
    }
  };

  // Refresh data when admin token changes
  useEffect(() => {
    if (adminToken && isAdmin) {
      loadUserThreads();
      loadAdminAssistantThreads();
    } else {
      setUserThreads([]);
      setSelectedThread(null);
      setAdminAssistantThreads([]);
      setSelectedAdminThread(null);
    }
  }, [adminToken, isAdmin]);

  const value = {
    users,
    isLoading,
    error,
    createUser,
    resetUserPassword,
    deleteUser,
    fetchUsers,
    isAdmin,
    setIsAdmin,
    adminToken,
    setAdminToken,
    userThreads,
    selectedThread,
    loadUserThreads,
    selectThread,
    adminAssistantId,
    adminAssistantThreads,
    selectedAdminThread,
    loadAdminAssistantThreads,
    selectAdminThread,
    createAdminAssistantThread,
    sendMessageToAdminAssistant,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
