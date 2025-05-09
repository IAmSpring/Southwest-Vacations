// Auth helper functions for Southwest Vacations

// Use the /api route prefix so Vite can proxy requests to the backend
const API_URL = '/api';

// Login and retrieve auth token
export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      return data.token;
    } else {
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register a new user
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<{ id: string; username: string; email: string }> => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    return response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get user profile');
    }

    return response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Logout the current user
export const logout = (): void => {
  localStorage.removeItem('token');
};

// Check if the user is currently logged in
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
