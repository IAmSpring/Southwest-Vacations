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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8 w-full">
              <div className="uppercase tracking-wide text-sm text-[#304CB2] font-semibold mb-1">Southwest Vacations</div>
              <h2 className="block mt-1 text-2xl leading-tight font-bold text-gray-900 mb-6">Login to Your Account</h2>
              
              <LoginForm onSuccess={() => window.location.href = '/'} />
              
              <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
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