import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, error, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeType, setActiveType] = useState<
    'all' | 'booking' | 'system' | 'policy' | 'promotion' | 'training'
  >('all');

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Filter notifications based on active filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus =
      activeFilter === 'all' ||
      (activeFilter === 'unread' && notification.status === 'unread') ||
      (activeFilter === 'read' && notification.status === 'read');

    const matchesType = activeType === 'all' || notification.type === activeType;

    return matchesStatus && matchesType;
  });

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-500">
            ✈️
          </span>
        );
      case 'system':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            🔧
          </span>
        );
      case 'policy':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
            📝
          </span>
        );
      case 'promotion':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
            🏷️
          </span>
        );
      case 'training':
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-500">
            📚
          </span>
        );
      default:
        return (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            📢
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your booking information and important updates
          </p>
        </div>

        <button
          onClick={() => markAllAsRead()}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Mark all as read
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeFilter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setActiveFilter('read')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeFilter === 'read'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Read
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveType('all')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => setActiveType('booking')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeType === 'booking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Booking
        </button>
        <button
          onClick={() => setActiveType('system')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeType === 'system'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          System
        </button>
        <button
          onClick={() => setActiveType('policy')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeType === 'policy'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Policy
        </button>
        <button
          onClick={() => setActiveType('promotion')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeType === 'promotion'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Promotion
        </button>
        <button
          onClick={() => setActiveType('training')}
          className={`rounded-full px-4 py-2 text-sm ${
            activeType === 'training'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Training
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
          <button
            onClick={() => fetchNotifications(true)}
            className="mt-2 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <p className="text-lg text-gray-600">No notifications found.</p>
          {activeFilter !== 'all' || activeType !== 'all' ? (
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <li
                key={notification.id}
                className={`
                  flex items-start gap-4 p-4 hover:bg-gray-50
                  ${notification.status === 'unread' ? 'bg-blue-50' : ''}
                `}
              >
                <div className="shrink-0">{getNotificationIcon(notification.type)}</div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="flex items-center text-sm font-medium text-gray-900">
                      {notification.title}
                      {notification.priority === 'high' && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}{' '}
                      {new Date(notification.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-gray-600">{notification.content}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {notification.actions && notification.actions.length > 0 && (
                      <Link
                        to={notification.actions[0].url}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        {notification.actions[0].label}
                      </Link>
                    )}

                    {notification.status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                      >
                        Mark as read
                      </button>
                    )}

                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {notification.type}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <Link
          to="/notifications/preferences"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Manage notification preferences
        </Link>
      </div>
    </div>
  );
};

export default NotificationsPage;
