import React from 'react';

const LoginDemoInfo: React.FC = () => {
  return (
    <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-lg mt-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Accounts</h3>
      <div className="space-y-2">
        <div className="bg-white p-3 rounded border border-yellow-100 shadow-sm">
          <h4 className="font-medium text-gray-800">Test User</h4>
          <div className="text-sm text-gray-600 mt-1">
            <p>Email: <span className="font-mono bg-gray-100 px-1">test@example.com</span></p>
            <p>Password: <span className="font-mono bg-gray-100 px-1">password123</span></p>
            <p className="text-xs text-gray-500 mt-1">Regular user with Bronze membership</p>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border border-yellow-100 shadow-sm">
          <h4 className="font-medium text-gray-800">Premium User</h4>
          <div className="text-sm text-gray-600 mt-1">
            <p>Email: <span className="font-mono bg-gray-100 px-1">premium@example.com</span></p>
            <p>Password: <span className="font-mono bg-gray-100 px-1">premium123</span></p>
            <p className="text-xs text-gray-500 mt-1">Premium user with Platinum membership</p>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border border-yellow-100 shadow-sm">
          <h4 className="font-medium text-gray-800">Admin User</h4>
          <div className="text-sm text-gray-600 mt-1">
            <p>Email: <span className="font-mono bg-gray-100 px-1">admin@southwest.com</span></p>
            <p>Password: <span className="font-mono bg-gray-100 px-1">admin123</span></p>
            <p className="text-xs text-gray-500 mt-1">Admin with full system access</p>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded border border-yellow-100 shadow-sm">
          <h4 className="font-medium text-gray-800">Booking Agent</h4>
          <div className="text-sm text-gray-600 mt-1">
            <p>Email: <span className="font-mono bg-gray-100 px-1">agent@southwest.com</span></p>
            <p>Password: <span className="font-mono bg-gray-100 px-1">agent123</span></p>
            <p className="text-xs text-gray-500 mt-1">Agent with booking management access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDemoInfo; 