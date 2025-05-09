import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthContext();

  // If not authenticated or not admin, redirect to login
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">User Management</h2>
          <div data-testid="user-table" className="overflow-auto">
            {/* User management table would go here */}
            <p>User management functionality will be implemented here.</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Booking Statistics</h2>
          <div data-testid="booking-stats" className="overflow-auto">
            {/* Booking statistics would go here */}
            <p>Booking statistics will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
