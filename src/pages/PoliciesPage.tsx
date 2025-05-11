import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { BookingPolicy, PolicyAcknowledgment } from '../sharedTypes';
import { getBookingPolicies, getPolicyAcknowledgments, acknowledgePolicy } from '../api/training';

const PoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<BookingPolicy[]>([]);
  const [acknowledgments, setAcknowledgments] = useState<PolicyAcknowledgment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<BookingPolicy | null>(null);
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [acknowledgmentSuccess, setAcknowledgmentSuccess] = useState(false);

  // Fetch policies and acknowledgments on component mount
  useEffect(() => {
    const fetchPoliciesData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch policies and acknowledgments data from API
        const [policiesData, acknowledgementsData] = await Promise.all([
          getBookingPolicies(),
          getPolicyAcknowledgments(),
        ]);

        setPolicies(policiesData);
        setAcknowledgments(acknowledgementsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching policies data:', error);
        setError('Failed to load policies data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPoliciesData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if a policy has been acknowledged
  const isPolicyAcknowledged = (policyId: string): boolean => {
    return acknowledgments.some(ack => ack.policyId === policyId);
  };

  // Check if a policy needs acknowledgment
  const needsAcknowledgment = (policy: BookingPolicy): boolean => {
    return policy.acknowledgmentRequired && policy.isActive && !isPolicyAcknowledged(policy.id);
  };

  // Handle policy acknowledgment
  const handleAcknowledgePolicy = async (policyId: string) => {
    try {
      setIsAcknowledging(true);
      setAcknowledgmentSuccess(false);

      const acknowledgment = await acknowledgePolicy(policyId);

      // Add the new acknowledgment to the list
      setAcknowledgments([...acknowledgments, acknowledgment]);

      setIsAcknowledging(false);
      setAcknowledgmentSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setAcknowledgmentSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error acknowledging policy:', error);
      setIsAcknowledging(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Booking Policies | Southwest Vacations</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Booking Policies</h1>
            <Link to="/training" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              ← Back to Training Portal
            </Link>
          </div>
          <p className="max-w-3xl text-gray-600">
            Review and acknowledge Southwest Vacations booking policies. All booking agents must
            acknowledge the required policies before using the booking system.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Policy List */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="border-b border-gray-200 bg-gray-50 p-4">
                  <h2 className="font-medium text-gray-900">All Policies</h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {policies.map(policy => (
                    <button
                      key={policy.id}
                      onClick={() => setSelectedPolicy(policy)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                        selectedPolicy?.id === policy.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{policy.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Version {policy.version} • {formatDate(policy.effectiveDate)}
                          </p>
                        </div>
                        <div>
                          {needsAcknowledgment(policy) ? (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Action Required
                            </span>
                          ) : isPolicyAcknowledged(policy.id) ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Acknowledged
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              {policy.isActive ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:col-span-2">
              {selectedPolicy ? (
                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                  <div className="border-b border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-medium text-gray-900">{selectedPolicy.title}</h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Version {selectedPolicy.version}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {selectedPolicy.category
                            .replace('-', ' ')
                            .replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Effective Date:</span>{' '}
                        {formatDate(selectedPolicy.effectiveDate)}
                      </p>
                      {selectedPolicy.acknowledgmentRequired && (
                        <p className="text-sm font-medium text-red-600">
                          * Acknowledgment Required
                        </p>
                      )}
                    </div>

                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedPolicy.content }} />
                    </div>

                    {needsAcknowledgment(selectedPolicy) && (
                      <div className="mt-8 border-t border-gray-200 pt-6">
                        {acknowledgmentSuccess ? (
                          <div className="rounded-md border border-green-200 bg-green-50 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-green-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                  Policy successfully acknowledged!
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-gray-700">
                              By clicking "Acknowledge", you confirm that you have read and
                              understood this policy.
                            </p>
                            <button
                              onClick={() => handleAcknowledgePolicy(selectedPolicy.id)}
                              disabled={isAcknowledging}
                              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                              {isAcknowledging ? (
                                <>
                                  <svg
                                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                'Acknowledge'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-white p-8 text-center shadow-md">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 font-medium text-gray-900">Select a policy</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a booking policy from the list to view its details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PoliciesPage;
