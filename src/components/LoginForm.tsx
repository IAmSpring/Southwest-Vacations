import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import '../styles/LoginForm.css';

// Helper to detect if running on GitHub Pages
const isGitHubPages = () => {
  return (
    import.meta.env.VITE_MOCK_AUTH === 'true' || 
    import.meta.env.VITE_IS_GITHUB_PAGES === 'true' ||
    window.location.hostname.includes('github.io') ||
    (!window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1')
  );
};

// Declare environment variable types for Vite
declare global {
  interface ImportMeta {
    env: {
      VITE_MOCK_AUTH?: string;
      VITE_IS_GITHUB_PAGES?: string;
    };
  }
  
  interface Window {
    __adminContext?: {
      setIsAdmin: (value: boolean) => void;
      setAdminToken: (token: string | null) => void;
    };
  }
}

type LoginFormProps = {
  onSuccess?: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading: authLoading } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // Focus on error message when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      // For GitHub Pages, check credentials against known mock users
      if (isGitHubPages()) {
        console.log('Using mock authentication for manual login');
        
        let success = false;
        
        // Check credentials against known mock accounts
        if (
          (email === 'admin@southwestvacations.com' && password === 'admin123') ||
          (email === 'manager@southwestvacations.com' && password === 'password123') ||
          (email === 'test@southwestvacations.com' && password === 'password123')
        ) {
          // In GitHub Pages environment, simulate successful login
          console.log('Mock credentials accepted');
          success = true;
          
          // Manually store token in localStorage to simulate login
          localStorage.setItem('token', 'mock-jwt-token');
          
          // If it's admin login, set admin context
          if (email === 'admin@southwestvacations.com' && typeof window !== 'undefined') {
            try {
              const adminContext = window.__adminContext;
              if (adminContext) {
                adminContext.setIsAdmin(true);
                adminContext.setAdminToken('mock-jwt-token');
              }
            } catch (e) {
              console.error('Could not set admin context:', e);
            }
          }
          
          if (onSuccess) onSuccess();
          
          // Redirect based on user role
          if (email === 'admin@southwestvacations.com') {
            window.location.href = '/admin';
          } else if (email === 'manager@southwestvacations.com') {
            window.location.href = '/bookings/manage';
          } else {
            window.location.href = '/';
          }
          
          setIsLoading(false);
          return;
        } else {
          // Invalid mock credentials
          console.log('Invalid mock credentials');
          setError('Invalid credentials. Please check your email and password.');
          setIsLoading(false);
          return;
        }
      }
      
      // Normal backend authentication
      const success = await login(email, password);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again later or contact support.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (type: 'user' | 'manager' | 'admin') => {
    setError('');
    setIsLoading(true);
    try {
      let loginEmail = '';
      let loginPassword = '';

      switch (type) {
        case 'user':
          loginEmail = 'test@southwestvacations.com';
          loginPassword = 'password123';
          break;
        case 'manager':
          loginEmail = 'manager@southwestvacations.com';
          loginPassword = 'password123';
          break;
        case 'admin':
          loginEmail = 'admin@southwestvacations.com';
          loginPassword = 'admin123';
          break;
      }

      setEmail(loginEmail);
      setPassword(loginPassword);

      // Simulate form submission
      setFormSubmitted(true);

      // For GitHub Pages or any non-local environment, use mock authentication
      if (isGitHubPages()) {
        console.log(`Using mock authentication for quick login as ${type}`);
        
        // Store mock token in localStorage
        localStorage.setItem('token', 'mock-jwt-token');
        
        // Store user data in localStorage
        const mockUser = {
          id: type === 'admin' ? 'admin-123' : type === 'manager' ? 'manager-123' : 'user-123',
          email: loginEmail,
          name: type === 'admin' ? 'Admin User' : type === 'manager' ? 'Manager User' : 'Test User',
          role: type,
          isAdmin: type === 'admin',
          isManager: type === 'manager',
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Set the admin context state if it's an admin login
        if (type === 'admin' && typeof window !== 'undefined') {
          try {
            const adminContext = window.__adminContext;
            if (adminContext && adminContext.setIsAdmin && adminContext.setAdminToken) {
              adminContext.setIsAdmin(true);
              adminContext.setAdminToken('mock-jwt-token');
            }
          } catch (e) {
            console.error('Could not set admin context:', e);
          }
        }
        
        if (onSuccess) onSuccess();
        
        // Redirect based on user role
        const redirectPath = determineRedirectPath(type);
        if (redirectPath && redirectPath !== window.location.pathname) {
          window.location.href = redirectPath;
        }
        
        setIsLoading(false);
        return;
      }

      // For local development with backend
      console.log('Using backend authentication for quick login');
      const success = await login(loginEmail, loginPassword);
      
      if (success) {
        if (onSuccess) onSuccess();
        
        // Redirect based on user role
        const redirectPath = determineRedirectPath(type);
        if (redirectPath && window.location.pathname !== redirectPath) {
          window.location.href = redirectPath;
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine where to redirect after login based on user role
  const determineRedirectPath = (userType: string): string => {
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'manager':
        return '/bookings/manage';
      default:
        return '/';
    }
  };

  return (
    <div className="login-form" role="region" aria-label="Login form">
      <h2 id="login-heading">Login Required</h2>
      <p>Please login to continue with your booking</p>

      {error && (
        <div
          ref={errorRef}
          className="error-message"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate aria-labelledby="login-heading">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
            <span className="sr-only">required</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            aria-required="true"
            aria-describedby={email === '' && formSubmitted ? 'email-error' : undefined}
            aria-invalid={email === '' && formSubmitted ? 'true' : 'false'}
            className={email === '' && formSubmitted ? 'input-error' : ''}
            autoComplete="email"
          />
          {email === '' && formSubmitted && (
            <div id="email-error" className="field-error" role="alert">
              Email is required
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
            <span className="sr-only">required</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            aria-required="true"
            aria-describedby={password === '' && formSubmitted ? 'password-error' : undefined}
            aria-invalid={password === '' && formSubmitted ? 'true' : 'false'}
            className={password === '' && formSubmitted ? 'input-error' : ''}
            autoComplete="current-password"
          />
          {password === '' && formSubmitted && (
            <div id="password-error" className="field-error" role="alert">
              Password is required
            </div>
          )}
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="quick-login">
        <p id="quick-login-title" className="quick-login-title">
          Quick Login Options:
        </p>
        <div className="quick-login-buttons" role="group" aria-labelledby="quick-login-title">
          <button
            onClick={() => quickLogin('user')}
            className="quick-login-button"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label="Log in as regular user"
          >
            User Login
          </button>
          <button
            onClick={() => quickLogin('manager')}
            className="quick-login-button"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label="Log in as manager"
          >
            Manager Login
          </button>
          <button
            onClick={() => quickLogin('admin')}
            className="quick-login-button"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-label="Log in as administrator"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
