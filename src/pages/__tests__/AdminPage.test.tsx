import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminPage from '../AdminPage';
import { AuthProvider } from '../../context/AuthContext';

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuthContext: jest.fn(),
}));

describe('AdminPage', () => {
  const mockUseAuthContext = require('../../context/AuthContext').useAuthContext;

  test('redirects to login when not authenticated', () => {
    // Mock not authenticated
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    // Use memory router to test navigation
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login page
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(container.textContent).toContain('Login Page');
  });

  test('redirects to login when authenticated but not admin', () => {
    // Mock authenticated but not admin
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        isAdmin: false,
      },
    });

    // Use memory router to test navigation
    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login page
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(container.textContent).toContain('Login Page');
  });

  test('displays admin dashboard when authenticated as admin', () => {
    // Mock authenticated as admin
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: {
        id: 'admin123',
        username: 'admin',
        email: 'admin@example.com',
        isAdmin: true,
      },
    });

    // Render admin page
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminPage />
      </MemoryRouter>
    );

    // Should display admin dashboard
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Booking Statistics')).toBeInTheDocument();
    expect(screen.getByTestId('user-table')).toBeInTheDocument();
    expect(screen.getByTestId('booking-stats')).toBeInTheDocument();
  });
});
