import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { BookingPolicy, PolicyAcknowledgment } from '../sharedTypes';

const PoliciesListPage: React.FC = () => {
  const [policies, setPolicies] = useState<BookingPolicy[]>([]);
  const [acknowledgments, setAcknowledgments] = useState<PolicyAcknowledgment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Fetch policies data
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call with timeout
        setTimeout(() => {
          // Mock policy data
          const mockPolicies: BookingPolicy[] = [
            {
              id: 'general',
              title: 'General Booking Terms & Conditions',
              content:
                'These terms and conditions govern all bookings made through Southwest Vacations...',
              version: '2.1',
              effectiveDate: '2023-01-15',
              category: 'general',
              isActive: true,
              acknowledgmentRequired: true,
            },
            {
              id: 'refunds',
              title: 'Refund & Cancellation Policy',
              content:
                'Customers may cancel their booking and receive a full refund within 24 hours of booking...',
              version: '3.2',
              effectiveDate: '2023-03-10',
              category: 'refunds',
              isActive: true,
              acknowledgmentRequired: true,
            },
            {
              id: 'multi-destination',
              title: 'Multi-destination Booking Guidelines',
              content:
                'When booking multi-destination itineraries, each segment must have valid connecting options...',
              version: '1.5',
              effectiveDate: '2023-05-22',
              category: 'general',
              isActive: true,
              acknowledgmentRequired: true,
            },
            {
              id: 'customer-service',
              title: 'Customer Service Standards',
              content:
                'All customer interactions must meet the Southwest Airlines standard of hospitality...',
              version: '2.0',
              effectiveDate: '2023-04-01',
              category: 'customer-service',
              isActive: true,
              acknowledgmentRequired: true,
            },
            {
              id: 'changes',
              title: 'Booking Change Procedures',
              content:
                'All changes to existing bookings must follow these standardized procedures...',
              version: '1.3',
              effectiveDate: '2023-02-10',
              category: 'changes',
              isActive: true,
              acknowledgmentRequired: true,
            },
            {
              id: 'pricing',
              title: 'Pricing and Discounts Guidelines',
              content:
                'These guidelines govern how pricing and discounts should be applied to vacation packages...',
              version: '2.5',
              effectiveDate: '2023-03-15',
              category: 'pricing',
              isActive: true,
              acknowledgmentRequired: true,
            },
          ];

          // Mock acknowledgment data
          const mockAcknowledgments: PolicyAcknowledgment[] = [
            {
              id: '1',
              userId: '1',
              policyId: 'general',
              acknowledgedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
              version: '2.1',
            },
            {
              id: '2',
              userId: '1',
              policyId: 'refunds',
              acknowledgedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
              version: '3.2',
            },
          ];

          setPolicies(mockPolicies);
          setAcknowledgments(mockAcknowledgments);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching policies:', error);
        setError('Failed to load policies. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  // Get status of a policy
  const getPolicyStatus = (policyId: string): 'acknowledged' | 'pending' | 'outdated' => {
    const acknowledgment = acknowledgments.find(a => a.policyId === policyId);
    const policy = policies.find(p => p.id === policyId);

    if (!acknowledgment) {
      return 'pending';
    }

    if (acknowledgment.version !== policy?.version) {
      return 'outdated';
    }

    return 'acknowledged';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get all categories
  const getCategories = () => {
    const categories = new Set<string>();
    policies.forEach(policy => categories.add(policy.category));
    return Array.from(categories);
  };

  // Filter policies based on active category
  const getFilteredPolicies = () => {
    if (activeCategory === 'all') {
      return policies;
    }

    return policies.filter(policy => policy.category === activeCategory);
  };

  return (
    <>
      <Helmet>
        <title>Booking Policies | Southwest Vacations</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
          <div className="p-6 md:p-8">
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">Booking Policies</h1>
            <p className="max-w-3xl text-blue-100">
              All Southwest Vacations booking policies that govern how bookings are created,
              modified, and managed.
            </p>
          </div>

          {/* Policies Stats */}
          <div className="border-t border-blue-900 bg-white px-6 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="text-sm font-medium text-blue-700">Total Policies</h3>
                <p className="text-2xl font-bold text-blue-900">{policies.length}</p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="text-sm font-medium text-green-700">Acknowledged</h3>
                <p className="text-2xl font-bold text-green-900">
                  {policies.filter(p => getPolicyStatus(p.id) === 'acknowledged').length}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <h3 className="text-sm font-medium text-yellow-700">Pending Acknowledgment</h3>
                <p className="text-2xl font-bold text-yellow-900">
                  {
                    policies.filter(
                      p =>
                        getPolicyStatus(p.id) === 'pending' || getPolicyStatus(p.id) === 'outdated'
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/training" className="hover:text-blue-600">
              Training Portal
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800">Policies</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 overflow-x-auto">
              <button
                className={`whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium ${
                  activeCategory === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                All Policies
              </button>

              {getCategories().map(category => (
                <button
                  key={category}
                  className={`whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium ${
                    activeCategory === category
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Policies List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        ) : getFilteredPolicies().length === 0 ? (
          <div className="rounded-md bg-gray-50 p-12 text-center">
            <p className="text-lg text-gray-500">No policies found matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <ul className="divide-y divide-gray-200">
              {getFilteredPolicies().map(policy => {
                const status = getPolicyStatus(policy.id);

                return (
                  <li key={policy.id} className="hover:bg-gray-50">
                    <Link to={`/policies/${policy.id}`} className="block">
                      <div className="px-6 py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{policy.title}</h3>
                            <div className="mt-1 flex items-center">
                              <span className="mr-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                v{policy.version}
                              </span>
                              <span className="text-sm text-gray-500">
                                Effective: {formatDate(policy.effectiveDate)}
                              </span>
                            </div>
                            <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                              {policy.content}
                            </p>
                          </div>

                          <div className="ml-6 flex-shrink-0">
                            {status === 'acknowledged' ? (
                              <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Acknowledged
                              </div>
                            ) : status === 'outdated' ? (
                              <div className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                                <svg
                                  className="mr-1 h-4 w-4"
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
                                Update Required
                              </div>
                            ) : (
                              <div className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                                Action Required
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Return Button */}
        <div className="mt-8">
          <Link
            to="/training"
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
            Return to Training Portal
          </Link>
        </div>
      </div>
    </>
  );
};

export default PoliciesListPage;
