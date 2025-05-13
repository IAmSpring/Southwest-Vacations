import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
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
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const value = {
    users,
    isLoading,
    error,
    createUser,
    resetUserPassword,
    deleteUser,
    fetchUsers,
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
