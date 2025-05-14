import React from 'react';

const LoginDemoInfo: React.FC = () => {
  return (
    <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-yellow-800">Demo Accounts</h3>
      <div className="space-y-2">
        <div className="rounded border border-yellow-100 bg-white p-3 shadow-sm">
          <h4 className="font-medium text-gray-800">Test User</h4>
          <div className="mt-1 text-sm text-gray-600">
            <p>
              Email: <span className="bg-gray-100 px-1 font-mono">test@southwestvacations.com</span>
            </p>
            <p>
              Password: <span className="bg-gray-100 px-1 font-mono">password123</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">Regular user with Bronze membership</p>
          </div>
        </div>

        <div className="rounded border border-yellow-100 bg-white p-3 shadow-sm">
          <h4 className="font-medium text-gray-800">Premium User</h4>
          <div className="mt-1 text-sm text-gray-600">
            <p>
              Email:{' '}
              <span className="bg-gray-100 px-1 font-mono">premium@southwestvacations.com</span>
            </p>
            <p>
              Password: <span className="bg-gray-100 px-1 font-mono">premium123</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">Premium user with Platinum membership</p>
          </div>
        </div>

        <div className="rounded border border-yellow-100 bg-white p-3 shadow-sm">
          <h4 className="font-medium text-gray-800">Admin User</h4>
          <div className="mt-1 text-sm text-gray-600">
            <p>
              Email:{' '}
              <span className="bg-gray-100 px-1 font-mono">admin@southwestvacations.com</span>
            </p>
            <p>
              Password: <span className="bg-gray-100 px-1 font-mono">admin123</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">Admin with full system access</p>
          </div>
        </div>

        <div className="rounded border border-yellow-100 bg-white p-3 shadow-sm">
          <h4 className="font-medium text-gray-800">Booking Agent</h4>
          <div className="mt-1 text-sm text-gray-600">
            <p>
              Email:{' '}
              <span className="bg-gray-100 px-1 font-mono">agent@southwestvacations.com</span>
            </p>
            <p>
              Password: <span className="bg-gray-100 px-1 font-mono">agent123</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">Agent with booking management access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDemoInfo;
