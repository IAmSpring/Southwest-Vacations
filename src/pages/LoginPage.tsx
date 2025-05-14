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
                <h3 className="mb-2 text-lg font-semibold text-gray-800">Demo Accounts</h3>
                <div className="space-y-4">
                  <div className="rounded border border-blue-100 bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-800">Regular User</h4>
                    <div className="mt-1 text-sm">
                      <p>
                        Email:{' '}
                        <span className="rounded bg-white px-1 font-mono">
                          test@southwestvacations.com
                        </span>
                      </p>
                      <p>
                        Password:{' '}
                        <span className="rounded bg-white px-1 font-mono">password123</span>
                      </p>
                      <p className="mt-1 text-blue-700">Access to booking and user features</p>
                    </div>
                  </div>

                  <div className="rounded border border-green-100 bg-green-50 p-3">
                    <h4 className="font-medium text-green-800">Manager Account</h4>
                    <div className="mt-1 text-sm">
                      <p>
                        Email:{' '}
                        <span className="rounded bg-white px-1 font-mono">
                          manager@southwestvacations.com
                        </span>
                      </p>
                      <p>
                        Password:{' '}
                        <span className="rounded bg-white px-1 font-mono">password123</span>
                      </p>
                      <p className="mt-1 text-green-700">Can manage multiple users and bookings</p>
                    </div>
                  </div>

                  <div className="rounded border border-red-100 bg-red-50 p-3">
                    <h4 className="font-medium text-red-800">System Administrator</h4>
                    <div className="mt-1 text-sm">
                      <p>
                        Email:{' '}
                        <span className="rounded bg-white px-1 font-mono">
                          admin@southwestvacations.com
                        </span>
                      </p>
                      <p>
                        Password: <span className="rounded bg-white px-1 font-mono">admin123</span>
                      </p>
                      <p className="mt-1 text-red-700">
                        Full system access, analytics, and architecture documentation
                      </p>
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
