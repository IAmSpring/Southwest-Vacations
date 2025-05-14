import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/LoginForm.css';

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

  const quickLogin = async (type: 'user' | 'manager' | 'admin') => {
    setError('');
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
            onClick={() => quickLogin('user')}
            className="quick-login-button"
            disabled={isLoading}
          >
            User Login
          </button>
          <button
            onClick={() => quickLogin('manager')}
            className="quick-login-button"
            disabled={isLoading}
          >
            Manager Login
          </button>
          <button
            onClick={() => quickLogin('admin')}
            className="quick-login-button"
            disabled={isLoading}
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
