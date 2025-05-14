import React from 'react';
import LoginForm from '../components/LoginForm';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
          <div className="md:flex">
            <div className="w-full p-8">
              <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-[#304CB2]">
                Southwest Vacations
              </div>
              <h2 className="mb-6 mt-1 block text-2xl font-bold leading-tight text-gray-900">
                Login to Your Account
              </h2>

              <LoginForm onSuccess={() => (window.location.href = '/')} />

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Demo Accounts</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded border border-blue-100">
                    <h4 className="font-medium text-blue-800">Test User</h4>
                    <div className="text-sm mt-1">
                      <p>Email: <span className="font-mono bg-white px-1 rounded">test@example.com</span></p>
                      <p>Password: <span className="font-mono bg-white px-1 rounded">password123</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded border border-purple-100">
                    <h4 className="font-medium text-purple-800">Premium User</h4>
                    <div className="text-sm mt-1">
                      <p>Email: <span className="font-mono bg-white px-1 rounded">premium@example.com</span></p>
                      <p>Password: <span className="font-mono bg-white px-1 rounded">premium123</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <h4 className="font-medium text-red-800">Admin User</h4>
                    <div className="text-sm mt-1">
                      <p>Email: <span className="font-mono bg-white px-1 rounded">admin@southwest.com</span></p>
                      <p>Password: <span className="font-mono bg-white px-1 rounded">admin123</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded border border-green-100">
                    <h4 className="font-medium text-green-800">Booking Agent</h4>
                    <div className="text-sm mt-1">
                      <p>Email: <span className="font-mono bg-white px-1 rounded">agent@southwest.com</span></p>
                      <p>Password: <span className="font-mono bg-white px-1 rounded">agent123</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
