import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import NotificationIcon from './NotificationIcon';

const Header = () => {
  const { isAuthenticated, user } = useAuthContext();
  const isAdmin = user?.isAdmin;

  // Generate avatar with user initials or default icon
  const getAvatar = () => {
    if (!user?.username) return '👤';

    const initials = user.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return initials;
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <Link to="/" className="transition-colors hover:text-blue-200">
            ✈️ Southwest Vacations
          </Link>
        </h1>
        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
          >
            Home
          </Link>
          <Link
            to="/trips"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
          >
            Trips
          </Link>
          <Link
            to="/book"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-700"
          >
            Book a Trip
          </Link>

          {isAuthenticated ? (
            <>
              <NotificationIcon />
              <div className="group relative">
                <div
                  className="flex cursor-pointer items-center space-x-2"
                  data-testid="user-profile"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFBF27] font-bold text-[#304CB2]">
                    {getAvatar()}
                  </div>
                  <span className="hidden text-sm md:inline">{user?.username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                <div className="absolute right-0 z-10 mt-2 hidden w-48 rounded-md bg-white py-1 shadow-lg group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    data-testid="profile-link"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      My Profile
                    </div>
                  </Link>

                  <Link
                    to="/bookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    data-testid="dashboard-link"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      My Bookings
                    </div>
                  </Link>

                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    data-testid="notifications-link"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Notifications
                    </div>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        data-testid="admin-link"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Admin Dashboard
                        </div>
                      </Link>

                      <Link
                        to="/test-visualization"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        data-testid="test-visualization-link"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Test Dashboard
                        </div>
                      </Link>

                      <Link
                        to="/testing"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        data-testid="testing-dashboard-link"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                          </svg>
                          Test Screenshots
                        </div>
                      </Link>

                      <Link
                        to="/system-health"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        data-testid="system-health-link"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          System Health
                        </div>
                      </Link>

                      <Link
                        to="/aid"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        data-testid="aid-link"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Application Docs (AID)
                        </div>
                      </Link>

                      <Link
                        to="/support"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        data-testid="support-center-link"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          Support Center
                        </div>
                      </Link>
                    </>
                  )}

                  <div className="my-1 border-t border-gray-100"></div>

                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.reload();
                    }}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium shadow-md transition-colors hover:bg-blue-800"
              data-testid="login-button"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
