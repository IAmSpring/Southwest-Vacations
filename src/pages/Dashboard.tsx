import React from 'react';
import Dashboard from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
