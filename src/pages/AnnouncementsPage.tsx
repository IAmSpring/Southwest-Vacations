import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// Announcement type definition
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'policy' | 'system' | 'promotion' | 'general' | 'urgent';
  isNew?: boolean;
}

const AnnouncementsPage: React.FC = () => {
  // Generate a list of dummy announcements going back 6 months
  const now = new Date();
  const announcements: Announcement[] = [
    // Current month announcements
    {
      id: '1',
      title: 'New Cancellation Policy Update',
      content:
        'The updated cancellation policy for all vacation packages goes into effect on July 1st. All bookings must adhere to the new guidelines. Review the policy in the Training Portal.',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
      category: 'policy',
      isNew: true,
    },
    {
      id: '2',
      title: 'System Maintenance Schedule',
      content:
        'The booking system will be down for scheduled maintenance on Sunday, June 30th from 2:00 AM to 5:00 AM CDT. Please plan accordingly.',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5).toISOString(),
      category: 'system',
      isNew: true,
    },
    {
      id: '3',
      title: 'Summer Promotions Now Available',
      content:
        'New summer promotion codes have been added to the system. Use code SUMMER2023 for additional 15% off selected destinations.',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString(),
      category: 'promotion',
      isNew: true,
    },
    // Last month
    {
      id: '4',
      title: 'Multi-destination Booking Enhancement',
      content:
        'The multi-destination booking tool has been enhanced with new connecting flight options and improved hotel room allocation. Try it out with your next complex booking!',
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15).toISOString(),
      category: 'system',
    },
    {
      id: '5',
      title: 'Caribbean Packages Discount Extended',
      content:
        'The spring Caribbean package discount has been extended through the summer. Apply code CARIBBEAN2023 for an additional 10% off all Caribbean destinations.',
      date: new Date(now.getFullYear(), now.getMonth() - 1, 10).toISOString(),
      category: 'promotion',
    },
    // 2 months ago
    {
      id: '6',
      title: 'New Corporate Client Onboarding',
      content:
        'Welcome to our newest corporate client, TechGlobal Inc. Their employees are now eligible for the Business Select rates. See the Corporate Portal for details.',
      date: new Date(now.getFullYear(), now.getMonth() - 2, 22).toISOString(),
      category: 'general',
    },
    {
      id: '7',
      title: 'Hawaii Volcano Activity Alert',
      content:
        'Due to increased volcanic activity on the Big Island, some tours and activities may be modified or unavailable. Please check with local operators before confirming activities for customers traveling in the next 30 days.',
      date: new Date(now.getFullYear(), now.getMonth() - 2, 15).toISOString(),
      category: 'urgent',
    },
    // 3 months ago
    {
      id: '8',
      title: 'New Payment Processing System',
      content:
        'We have upgraded our payment processing system for improved security and faster transaction times. All agents should review the updated payment handling guidelines in the Training Portal.',
      date: new Date(now.getFullYear(), now.getMonth() - 3, 18).toISOString(),
      category: 'system',
    },
    {
      id: '9',
      title: 'Agent Performance Recognition',
      content:
        'Congratulations to our top-performing agents for Q1. Special recognition to Maria Lopez for highest customer satisfaction scores and David Kim for most vacation packages booked.',
      date: new Date(now.getFullYear(), now.getMonth() - 3, 5).toISOString(),
      category: 'general',
    },
    // 4 months ago
    {
      id: '10',
      title: 'Spring Break Training Session',
      content:
        'Mandatory training session for all agents on handling Spring Break bookings. Learn about popular destinations, inventory management, and special group booking options.',
      date: new Date(now.getFullYear(), now.getMonth() - 4, 25).toISOString(),
      category: 'general',
    },
    {
      id: '11',
      title: 'Updated Terms and Conditions',
      content:
        'Our legal team has updated the Terms and Conditions for all vacation packages. The changes include modified language regarding weather-related cancellations and force majeure events.',
      date: new Date(now.getFullYear(), now.getMonth() - 4, 12).toISOString(),
      category: 'policy',
    },
    // 5 months ago
    {
      id: '12',
      title: 'New Hotel Partners in Mexico',
      content:
        'We have added 15 new hotel partners in Cancun, Cabo San Lucas, and Puerto Vallarta. Expanded inventory is now available in the booking system with special introductory rates.',
      date: new Date(now.getFullYear(), now.getMonth() - 5, 20).toISOString(),
      category: 'promotion',
    },
    {
      id: '13',
      title: 'Customer Feedback System Update',
      content:
        'The customer feedback system has been updated with new questions about the booking experience. Please encourage customers to complete the post-booking survey to help improve our services.',
      date: new Date(now.getFullYear(), now.getMonth() - 5, 8).toISOString(),
      category: 'system',
    },
  ];

  // Filtering state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Announcements' },
    { id: 'policy', name: 'Policy Updates' },
    { id: 'system', name: 'System Updates' },
    { id: 'promotion', name: 'Promotions' },
    { id: 'general', name: 'General' },
    { id: 'urgent', name: 'Urgent' },
  ];

  // Filter announcements based on active category
  const getFilteredAnnouncements = () => {
    if (activeCategory === 'all') {
      return announcements;
    }

    return announcements.filter(announcement => announcement.category === activeCategory);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get time elapsed
  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <>
      <Helmet>
        <title>Company Announcements | Southwest Vacations</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
          <div className="p-6 md:p-8">
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              Southwest Vacations Announcements
            </h1>
            <p className="max-w-3xl text-blue-100">
              Stay up to date with important company announcements, policy changes, and system
              updates.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Announcements</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium ${
                    activeCategory === category.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Announcements List */}
        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
          <ul className="divide-y divide-gray-200">
            {getFilteredAnnouncements().map(announcement => (
              <li key={announcement.id} className="hover:bg-gray-50">
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                          announcement.category === 'urgent'
                            ? 'bg-red-100'
                            : announcement.category === 'policy'
                              ? 'bg-purple-100'
                              : announcement.category === 'system'
                                ? 'bg-blue-100'
                                : announcement.category === 'promotion'
                                  ? 'bg-green-100'
                                  : 'bg-gray-100'
                        }`}
                      >
                        {announcement.category === 'urgent' && (
                          <svg
                            className="h-5 w-5 text-red-600"
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
                        )}
                        {announcement.category === 'policy' && (
                          <svg
                            className="h-5 w-5 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        )}
                        {announcement.category === 'system' && (
                          <svg
                            className="h-5 w-5 text-blue-600"
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
                        )}
                        {announcement.category === 'promotion' && (
                          <svg
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {announcement.category === 'general' && (
                          <svg
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {announcement.title}
                          </h3>
                          {announcement.isNew && (
                            <span className="ml-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatDate(announcement.date)} • {getTimeElapsed(announcement.date)} •
                          <span className="ml-1 capitalize">{announcement.category}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">{announcement.content}</p>
                  </div>
                  {announcement.category === 'policy' && (
                    <div className="mt-4 flex">
                      <Link
                        to="/policies"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Related Policies
                      </Link>
                    </div>
                  )}
                  {announcement.category === 'system' && (
                    <div className="mt-4 flex">
                      <Link
                        to="/training"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Related Training
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Return Button */}
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
};

export default AnnouncementsPage;
