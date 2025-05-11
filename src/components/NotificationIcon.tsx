import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

interface NotificationIconProps {
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ className = '' }) => {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-full p-1 hover:bg-blue-700 ${className}`}
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-md bg-white p-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No new notifications</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {unreadNotifications.map(notification => (
                  <li key={notification.id} className="py-2">
                    <Link
                      to={notification.actions?.[0]?.url || '/notifications'}
                      className="block rounded-md p-2 hover:bg-gray-50"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="shrink-0">
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
                          <span className="ml-2 h-2 w-2 shrink-0 rounded-full bg-red-500"></span>
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
              className="block w-full rounded-md bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
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
