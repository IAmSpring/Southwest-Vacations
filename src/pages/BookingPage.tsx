import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);

  // Handle successful login
  const handleLoginSuccess = () => {
    setShowLoginForm(false);
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="flex items-center transition-colors hover:text-[#304CB2]">
                <span>Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li aria-current="page" className="font-medium text-[#304CB2]">
              Book Your Trip
            </li>
          </ol>
        </nav>

        {/* Page header */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-[#304CB2] to-[#1a2a66] p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E31837]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Book Your Trip</h1>
              <p className="mt-1 text-blue-100">
                Complete the form below to begin your Southwest Vacations adventure
              </p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
                <p>Loading authentication status...</p>
              </div>
            ) : showLoginForm ? (
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
                <LoginForm onSuccess={handleLoginSuccess} />
              </div>
            ) : (
              <BookingForm />
            )}
          </div>

          {/* Sidebar with help information */}
          <div className="self-start rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-[#304CB2]">Booking Information</h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h3 className="mb-2 flex items-center font-medium text-[#304CB2]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Need Assistance?
                </h3>
                <p className="text-sm text-gray-700">
                  Our Southwest Representatives are available 24/7 to help with your booking needs.
                </p>
                <a
                  href="tel:+18005551212"
                  className="mt-2 block font-medium text-[#304CB2] hover:underline"
                >
                  Call 1-800-555-1212
                </a>
              </div>

              {showLoginForm && (
                <div className="mt-4 rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                  <h3 className="mb-2 flex items-center font-medium text-yellow-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Authentication Required
                  </h3>
                  <p className="text-sm text-gray-700">
                    You must be logged in to book a trip. Please use the login form to continue with
                    your booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
