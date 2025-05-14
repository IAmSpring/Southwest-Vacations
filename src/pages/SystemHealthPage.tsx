import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface SystemMetric {
  name: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'degraded' | 'offline';
  lastChecked: string;
}

const SystemHealthPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthContext();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated || user?.role !== 'admin') {
      setShouldRedirect(true);
      return;
    }

    const fetchSystemHealth = async () => {
      setIsLoading(true);

      // This would normally be an API call to the backend
      // For demo purposes, we're using mock data
      setTimeout(() => {
        setMetrics([
          { name: 'CPU Usage', value: '23%', status: 'good' },
          { name: 'Memory Usage', value: '45%', status: 'good' },
          { name: 'API Response Time', value: '120ms', status: 'good' },
          { name: 'Database Connections', value: 12, status: 'good' },
          { name: 'Error Rate', value: '0.05%', status: 'good' },
          { name: 'Disk Space', value: '78%', status: 'warning' },
        ]);

        setServices([
          { name: 'Web Server', status: 'online', lastChecked: new Date().toISOString() },
          { name: 'API Gateway', status: 'online', lastChecked: new Date().toISOString() },
          { name: 'Database', status: 'online', lastChecked: new Date().toISOString() },
          { name: 'Authentication Service', status: 'online', lastChecked: new Date().toISOString() },
          { name: 'Email Service', status: 'degraded', lastChecked: new Date().toISOString() },
          { name: 'Payment Gateway', status: 'online', lastChecked: new Date().toISOString() },
          { name: 'Search Service', status: 'online', lastChecked: new Date().toISOString() },
          { name: 'AI Assistant', status: 'online', lastChecked: new Date().toISOString() },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    fetchSystemHealth();
  }, [isAuthenticated, user]);

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  // Render status indicator
  const renderStatusIndicator = (status: 'online' | 'degraded' | 'offline' | 'good' | 'warning' | 'error') => {
    const colors = {
      online: 'bg-green-500',
      good: 'bg-green-500',
      degraded: 'bg-yellow-500',
      warning: 'bg-yellow-500',
      offline: 'bg-red-500',
      error: 'bg-red-500',
    };

    return (
      <span className={`inline-block w-3 h-3 rounded-full ${colors[status]} mr-2`}></span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">System Health Dashboard</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Metrics Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Metrics</h2>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    {renderStatusIndicator(metric.status)}
                    <span className="text-gray-700">{metric.name}</span>
                  </div>
                  <span className={`font-medium ${
                    metric.status === 'good' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Services Status Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Services Status</h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    {renderStatusIndicator(service.status)}
                    <span className="text-gray-700">{service.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-medium ${
                      service.status === 'online' ? 'text-green-600' : 
                      service.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Last checked: {new Date(service.lastChecked).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs Panel */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent System Logs</h2>
              <div>
                <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                  <option>All Levels</option>
                  <option>Info</option>
                  <option>Warning</option>
                  <option>Error</option>
                </select>
              </div>
            </div>
            <div className="bg-gray-800 rounded p-4 font-mono text-sm text-gray-200 h-64 overflow-y-auto">
              <div className="text-green-400">[2023-05-13 19:24:15] [INFO] Server started successfully on port 4000</div>
              <div className="text-green-400">[2023-05-13 19:24:16] [INFO] Connected to database successfully</div>
              <div className="text-green-400">[2023-05-13 19:25:02] [INFO] User login: admin@southwest.com</div>
              <div className="text-yellow-400">[2023-05-13 19:26:18] [WARN] High memory usage detected (75%)</div>
              <div className="text-green-400">[2023-05-13 19:27:45] [INFO] API request: GET /api/trips</div>
              <div className="text-green-400">[2023-05-13 19:28:12] [INFO] API request: GET /api/users/me</div>
              <div className="text-green-400">[2023-05-13 19:29:30] [INFO] Booking created: booking-12345</div>
              <div className="text-red-400">[2023-05-13 19:31:14] [ERROR] Failed to send email notification: Connection timeout</div>
              <div className="text-green-400">[2023-05-13 19:32:05] [INFO] API request: GET /api/bookings/user</div>
              <div className="text-green-400">[2023-05-13 19:33:52] [INFO] User logout: admin@southwest.com</div>
              <div className="text-green-400">[2023-05-13 19:35:10] [INFO] API request: GET /health</div>
              <div className="text-green-400">[2023-05-13 19:36:23] [INFO] Database backup completed successfully</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-right">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default SystemHealthPage; 