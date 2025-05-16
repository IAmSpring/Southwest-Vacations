import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isGitHubPages, createFullPath } from '../utils/urlUtils';

// Types for our test users
type UserRole = 'user' | 'manager' | 'admin';

interface LoginTestButtonsProps {
  className?: string;
}

const LoginTestButtons: React.FC<LoginTestButtonsProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState<Record<UserRole, boolean>>({
    user: false,
    manager: false,
    admin: false,
  });
  const navigate = useNavigate();

  // Quick login function for test accounts
  const quickLogin = async (type: UserRole) => {
    // Set loading state for this button type
    setIsLoading(prev => ({ ...prev, [type]: true }));

    try {
      // Get login credentials based on user type
      const credentials = getUserCredentials(type);

      // For GitHub Pages deployments, use mock authentication
      if (isGitHubPages()) {
        console.log(`Using mock authentication for ${type} login`);

        // Create a mock token
        const token = `mock-token-${type}-${Date.now()}`;

        // Create a mock user object based on the user type
        const mockUser = {
          id: `${type}-user-${Math.floor(Math.random() * 1000)}`,
          username:
            type === 'admin' ? 'Admin User' : type === 'manager' ? 'Manager User' : 'Test User',
          email: credentials.email,
          role: type,
          isAdmin: type === 'admin',
          isManager: type === 'manager' || type === 'admin',
          membershipLevel: type === 'admin' ? 'Gold' : type === 'manager' ? 'Silver' : 'Bronze',
        };

        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Redirect based on user role
        redirectBasedOnRole(type);
        return;
      }

      // For non-GitHub Pages, make an API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on user role
      redirectBasedOnRole(type);
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to mock auth if API call fails
      if (!isGitHubPages()) {
        console.log('API login failed, falling back to mock authentication');
        quickLogin(type);
      }
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Get credentials based on user type
  const getUserCredentials = (type: UserRole) => {
    switch (type) {
      case 'admin':
        return {
          email: 'admin@southwestvacations.com',
          password: 'admin123',
        };
      case 'manager':
        return {
          email: 'manager@southwestvacations.com',
          password: 'password123',
        };
      case 'user':
      default:
        return {
          email: 'test@southwestvacations.com',
          password: 'password123',
        };
    }
  };

  // Redirect user based on role
  const redirectBasedOnRole = (type: UserRole) => {
    switch (type) {
      case 'admin':
        navigate(createFullPath('/admin'));
        break;
      case 'manager':
        navigate(createFullPath('/bookings/manage'));
        break;
      case 'user':
      default:
        navigate(createFullPath('/'));
        break;
    }
  };

  return (
    <div className={`quick-login-buttons ${className}`}>
      <button
        onClick={() => quickLogin('user')}
        className="quick-login-button mr-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
        disabled={isLoading.user}
        aria-busy={isLoading.user}
        aria-label="Log in as test user"
      >
        {isLoading.user ? 'Logging in...' : 'Test User Login'}
      </button>

      <button
        onClick={() => quickLogin('manager')}
        className="quick-login-button mr-2 rounded-md bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700 disabled:opacity-70"
        disabled={isLoading.manager}
        aria-busy={isLoading.manager}
        aria-label="Log in as manager"
      >
        {isLoading.manager ? 'Logging in...' : 'Manager Login'}
      </button>

      <button
        onClick={() => quickLogin('admin')}
        className="quick-login-button rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-70"
        disabled={isLoading.admin}
        aria-busy={isLoading.admin}
        aria-label="Log in as administrator"
      >
        {isLoading.admin ? 'Logging in...' : 'Admin Login'}
      </button>
    </div>
  );
};

export default LoginTestButtons;
