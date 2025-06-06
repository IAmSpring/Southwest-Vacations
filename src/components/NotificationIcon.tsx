import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

interface NotificationIconProps {
  className?: string;
  dropdownPosition?: 'top' | 'bottom';
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  className = '',
  dropdownPosition = 'bottom',
}) => {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Get unread notifications only, limited to 5
  const unreadNotifications = notifications
    .filter(notification => notification.status === 'unread')
    .slice(0, 5);

  // Handle notification click
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  // Handle "Mark all as read" button click
  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    markAllAsRead();
  };

  // Position classes based on dropdown position
  const dropdownPositionClasses = dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-full p-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className}`}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            aria-hidden="true"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-10 w-80 rounded-md bg-white p-2 shadow-lg ${dropdownPositionClasses}`}
          role="dialog"
          aria-label="Notifications panel"
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium" id="notification-heading">
              Notifications
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 focus:underline focus:outline-none"
                aria-label="Mark all notifications as read"
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div
            className="max-h-80 overflow-y-auto"
            aria-labelledby="notification-heading"
            role="region"
          >
            {unreadNotifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No new notifications</div>
            ) : (
              <ul className="divide-y divide-gray-100" role="list">
                {unreadNotifications.map(notification => (
                  <li key={notification.id} className="py-2">
                    <Link
                      to={notification.actions?.[0]?.url || '/notifications'}
                      className="block rounded-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => handleNotificationClick(notification.id)}
                      aria-label={`${notification.title}: ${notification.content}`}
                    >
                      <div className="flex items-start">
                        <div className="shrink-0" aria-hidden="true">
                          {notification.type === 'booking' && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                              ✈️
                            </span>
                          )}
                          {notification.type === 'system' && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                              🔧
                            </span>
                          )}
                          {notification.type === 'policy' && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                              📝
                            </span>
                          )}
                          {notification.type === 'promotion' && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-500">
                              🏷️
                            </span>
                          )}
                          {notification.type === 'training' && (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-500">
                              📚
                            </span>
                          )}
                        </div>
                        <div className="ml-3 w-full">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {notification.content}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleDateString()}{' '}
                            {new Date(notification.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {notification.priority === 'high' && (
                          <span
                            className="ml-2 h-2 w-2 shrink-0 rounded-full bg-red-500"
                            aria-label="High priority"
                          ></span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2">
            <Link
              to="/notifications"
              className="block w-full rounded-md bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setIsOpen(false)}
              aria-label="View all notifications"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
