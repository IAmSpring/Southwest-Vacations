import { User } from '../sharedTypes';

const API_URL = '';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Login a user
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

// Register a new user
export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};

// Get current user based on token
export const getUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user information');
  }

  return response.json();
};

// Quick login for testing/development
export const quickLogin = async (isAdmin: boolean = false): Promise<LoginResponse> => {
  const credentials = isAdmin
    ? { email: 'admin@example.com', password: 'Admin123' }
    : { email: 'test@example.com', password: 'Password123' };

  return login(credentials);
};

// Log the user out (client-side only)
export const logout = (): void => {
  // Clear token from localStorage
  localStorage.removeItem('token');

  // For additional security, you might want to invalidate the token on the server
  // but this depends on your backend implementation
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};
