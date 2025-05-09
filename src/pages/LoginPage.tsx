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

              <div className="mt-6 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                <p>For testing, use:</p>
                <p className="font-medium">Regular User: test@example.com / Password123</p>
                <p className="font-medium">Admin User: admin@example.com / Admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
