import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationIcon from './NotificationIcon';

interface FloatingActionButtonsProps {
  showNotifications?: boolean;
  showQuickActions?: boolean;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  showNotifications = true,
  showQuickActions = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      {/* Notifications */}
      {showNotifications && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
          <NotificationIcon className="text-white" dropdownPosition="top" />
        </div>
      )}

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="flex flex-col items-end space-y-2">
          {/* Main button */}
          <button
            aria-label="Quick actions menu"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            onClick={toggleMenu}
          >
            {showMenu ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          {/* Quick actions menu */}
          {showMenu && (
            <div className="flex flex-col items-end space-y-2">
              {/* Book Trip */}
              <Link
                to="/book"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                aria-label="Book a trip"
                onClick={() => setShowMenu(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="absolute right-full mr-2 hidden whitespace-nowrap rounded bg-black/75 px-2 py-1 text-xs text-white group-hover:block">
                  Book Trip
                </span>
              </Link>

              {/* My Bookings */}
              <Link
                to="/bookings"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                aria-label="View my bookings"
                onClick={() => setShowMenu(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </Link>

              {/* Support */}
              <Link
                to="/help"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white shadow-md transition-all hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
                aria-label="Get help"
                onClick={() => setShowMenu(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingActionButtons;
