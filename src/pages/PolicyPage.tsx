import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { BookingPolicy } from '../sharedTypes';

const PolicyPage: React.FC = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const [policy, setPolicy] = useState<BookingPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAcknowledging, setIsAcknowledging] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Fetch policy data
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call with timeout
        setTimeout(() => {
          // Mock policy data based on the policyId
          const mockPolicies: Record<string, BookingPolicy> = {
            general: {
              id: 'general',
              title: 'General Booking Terms & Conditions',
              content: `
                <h2>Southwest Vacations General Booking Terms & Conditions</h2>
                <p>Version 2.1 - Effective from January 15, 2023</p>
                
                <h3>1. Introduction</h3>
                <p>These terms and conditions govern all bookings made through Southwest Vacations. By completing a booking, you agree to be bound by these terms and conditions. These terms apply to all employees accessing the Southwest Vacations booking system.</p>
                
                <h3>2. Booking Procedures</h3>
                <p>All bookings must be made through the official Southwest Vacations booking platform. Employees must verify customer identification and contact information before completing any booking. Each booking must include accurate passenger details exactly as they appear on government-issued identification.</p>
                
                <h3>3. Payment Processing</h3>
                <p>All payment information must be securely processed through the designated payment gateway. Employees are prohibited from manually recording customer payment details outside the system. All pricing must be verified before finalizing transactions.</p>
                
                <h3>4. Data Protection</h3>
                <p>All customer data must be handled in accordance with data protection regulations. Employees must not share or disclose customer information to unauthorized parties. All system credentials must be kept confidential and not shared with others.</p>
                
                <h3>5. Booking Modifications</h3>
                <p>Changes to existing bookings must be properly documented in the system. All modifications must be confirmed with customers via email. Fee waivers for changes must be approved by a supervisor.</p>
              `,
              version: '2.1',
              effectiveDate: '2023-01-15',
              category: 'general',
              isActive: true,
              acknowledgmentRequired: true,
            },
            refunds: {
              id: 'refunds',
              title: 'Refund & Cancellation Policy',
              content: `
                <h2>Southwest Vacations Refund & Cancellation Policy</h2>
                <p>Version 3.2 - Effective from March 10, 2023</p>
                
                <h3>1. Cancellation Windows</h3>
                <p>Customers may cancel their booking and receive a full refund within 24 hours of booking, regardless of the travel date. Bookings cancelled more than 14 days before departure are eligible for a 90% refund. Bookings cancelled between 3-14 days before departure are eligible for a 50% refund.</p>
                
                <h3>2. Non-refundable Bookings</h3>
                <p>Bookings cancelled within 72 hours of departure are generally non-refundable. Special promotional packages marked as "non-refundable" are not eligible for refunds under normal circumstances regardless of when cancelled.</p>
                
                <h3>3. Extenuating Circumstances</h3>
                <p>Refunds due to medical emergencies or bereavement require documentation and supervisor approval. Weather-related cancellations should follow the emergency procedures protocol.</p>
                
                <h3>4. Processing Refunds</h3>
                <p>All refunds must be processed through the system using the original payment method. Cash refunds are not permitted. Refunds typically process within 7-10 business days.</p>
                
                <h3>5. Future Travel Credits</h3>
                <p>Customers may opt for future travel credits instead of refunds in certain circumstances. Future travel credits carry a 12-month expiration from issue date. The application of future travel credits must be documented in the customer's profile.</p>
              `,
              version: '3.2',
              effectiveDate: '2023-03-10',
              category: 'refunds',
              isActive: true,
              acknowledgmentRequired: true,
            },
            'multi-destination': {
              id: 'multi-destination',
              title: 'Multi-destination Booking Guidelines',
              content: `
                <h2>Multi-destination Booking Guidelines</h2>
                <p>Version 1.5 - Effective from May 22, 2023</p>
                
                <h3>1. Segment Requirements</h3>
                <p>When booking multi-destination itineraries, each segment must have valid connecting options. Minimum connection time of 90 minutes must be observed for domestic connections and 3 hours for international connections. Maximum segments allowed in a single booking is 8.</p>
                
                <h3>2. Pricing Structure</h3>
                <p>Multi-destination packages must be priced using the segment calculator tool. Each segment should be individually validated before being added to the multi-destination package. The full pricing breakdown must be provided to customers before confirmation.</p>
                
                <h3>3. Documentation Requirements</h3>
                <p>All multi-destination bookings must include customer acknowledgment of the itinerary complexity. International segments require verification of valid passport and visa requirements. Booking notes must specify that the customer has been informed of all entry requirements.</p>
                
                <h3>4. Itinerary Changes</h3>
                <p>Changes to multi-destination bookings may affect the entire itinerary. Each segment change may incur individual change fees. When modifying a segment, all connecting segments must be reviewed and adjusted if necessary.</p>
                
                <h3>5. Cancellation Impact</h3>
                <p>Cancelling any segment in a multi-destination itinerary may result in recalculation of the entire package cost. Partial cancellations must be carefully processed to avoid system errors. A supervisor review is required for partial cancellations of multi-destination packages.</p>
              `,
              version: '1.5',
              effectiveDate: '2023-05-22',
              category: 'general',
              isActive: true,
              acknowledgmentRequired: true,
            },
          };

          if (policyId && policyId in mockPolicies) {
            setPolicy(mockPolicies[policyId]);
          } else if (!policyId) {
            // If no specific policy is requested, return all policies
            setPolicy(mockPolicies['general']); // Default to general policy
          } else {
            setError('Policy not found');
          }

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching policy:', error);
        setError('Failed to load policy. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, [policyId]);

  // Handle acknowledgment
  const handleAcknowledgment = async () => {
    try {
      setIsAcknowledging(true);

      // Simulate API call with timeout
      setTimeout(() => {
        setAcknowledged(true);
        setIsAcknowledging(false);
      }, 1500);
    } catch (error) {
      console.error('Error acknowledging policy:', error);
      setIsAcknowledging(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>
          {policy
            ? `${policy.title} | Southwest Vacations`
            : 'Booking Policy | Southwest Vacations'}
        </title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Links */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center text-sm text-gray-600">
            <Link to="/training" className="hover:text-blue-600">
              Training Portal
            </Link>
            <span className="mx-2">›</span>
            <Link to="/policies" className="hover:text-blue-600">
              Policies
            </Link>
            {policy && (
              <>
                <span className="mx-2">›</span>
                <span className="text-gray-800">{policy.title}</span>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        ) : policy ? (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            {/* Policy Header */}
            <div className="border-b border-blue-100 bg-blue-50 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{policy.title}</h1>
                <div className="mt-2 flex items-center sm:mt-0">
                  <span className="mr-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    Version {policy.version}
                  </span>
                  <span className="text-sm text-gray-600">
                    Effective: {formatDate(policy.effectiveDate)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Category: {policy.category.charAt(0).toUpperCase() + policy.category.slice(1)}
              </p>
            </div>

            {/* Policy Content */}
            <div className="p-6">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />
            </div>

            {/* Acknowledgment Section */}
            {policy.acknowledgmentRequired && (
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex flex-col items-center justify-between sm:flex-row">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">Acknowledgment Required</h3>
                    <p className="text-sm text-gray-600">
                      Please acknowledge that you have read and understood this policy.
                    </p>
                  </div>

                  {acknowledged ? (
                    <div className="flex items-center rounded-md border border-green-200 bg-green-50 px-4 py-2 text-green-800">
                      <svg
                        className="mr-2 h-5 w-5"
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
                      Acknowledged on {new Date().toLocaleDateString()}
                    </div>
                  ) : (
                    <button
                      onClick={handleAcknowledgment}
                      disabled={isAcknowledging}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isAcknowledging ? (
                        <>
                          <svg
                            className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
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
                        'Acknowledge Policy'
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            No policy selected. Please select a policy from the list.
          </div>
        )}

        {/* Policy Navigation */}
        <div className="mt-8 flex flex-wrap justify-between">
          <Link
            to="/policies"
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
            Back to All Policies
          </Link>

          <Link
            to="/training"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Return to Training Portal
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PolicyPage;
