import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

type LoginFormProps = {
  onSuccess?: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const quickLogin = async (type: 'test' | 'admin') => {
    setError('');
    try {
      let loginEmail = 'test@example.com';
      let loginPassword = 'Password123';

      if (type === 'admin') {
        loginEmail = 'admin@example.com';
        loginPassword = 'Admin123';
      }

      setEmail(loginEmail);
      setPassword(loginPassword);

      const success = await login(loginEmail, loginPassword);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Quick login failed. Invalid credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-form">
      <h2>Login Required</h2>
      <p>Please login to continue with your booking</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="quick-login">
        <p className="quick-login-title">Quick Login Options:</p>
        <div className="quick-login-buttons">
          <button
            onClick={() => quickLogin('test')}
            className="quick-login-button test-button"
            disabled={isLoading}
          >
            Test User Login
          </button>
          <button
            onClick={() => quickLogin('admin')}
            className="quick-login-button admin-button"
            disabled={isLoading}
          >
            Admin Login
          </button>
        </div>
      </div>

      <div className="note" id="test-credentials">
        <h3>Test Account</h3>
        <p>Email: test@example.com</p>
        <p>Password: Password123</p>
      </div>

      <style jsx>{`
        .login-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        h2 {
          margin-top: 0;
          color: #304050;
        }

        .error-message {
          background-color: #fff0f0;
          color: #e74c3c;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border: 1px solid #e74c3c;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .submit-button {
          width: 100%;
          padding: 10px;
          background-color: #0d6efd;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }

        .submit-button:disabled {
          background-color: #77a7e0;
          cursor: not-allowed;
        }

        .quick-login {
          margin-top: 20px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }

        .quick-login-title {
          margin-bottom: 10px;
          font-weight: 500;
          color: #304050;
        }

        .quick-login-buttons {
          display: flex;
          gap: 10px;
        }

        .quick-login-button {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .test-button {
          background-color: #28a745;
          color: white;
        }

        .test-button:hover {
          background-color: #218838;
        }

        .admin-button {
          background-color: #dc3545;
          color: white;
        }

        .admin-button:hover {
          background-color: #c82333;
        }

        .quick-login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .note {
          margin-top: 20px;
          padding: 15px;
          background-color: #ffffdd;
          border-radius: 4px;
          font-size: 14px;
          border: 1px solid #e6e600;
        }

        .note h3 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
