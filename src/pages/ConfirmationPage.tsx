import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getBookingById } from '../api/bookings';

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery(['booking', bookingId], () => (bookingId ? getBookingById(bookingId) : null), {
    enabled: !!bookingId,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-4 h-12 w-12 rounded-full bg-gray-300"></div>
          <div className="mb-2 h-4 w-32 rounded bg-gray-300"></div>
          <div className="h-4 w-48 rounded bg-gray-300"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <h2 className="mb-2 text-xl font-semibold">Error Loading Booking</h2>
        <p>
          We couldn't load your booking details. Please try again later or contact customer support.
        </p>
        <div className="mt-4">
          <Link to="/" className="font-medium text-[#304CB2] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Success Message */}
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
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
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-green-700">Booking Confirmed!</h1>
          <p className="text-lg text-green-800">Your vacation has been booked successfully.</p>

          {booking && (
            <div className="mt-4 text-sm text-green-700">
              <p>
                Confirmation Number: <span className="font-bold">{booking.id}</span>
              </p>
            </div>
          )}
        </div>

        {/* Booking Details Card */}
        {booking ? (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
            <div className="bg-gradient-to-r from-[#304CB2] to-[#1a2a66] p-4 text-white">
              <h2 className="text-xl font-bold">Booking Details</h2>
            </div>

            <div className="p-6">
              <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trip</h3>
                  <p className="text-lg font-semibold">{booking.tripId}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Price</h3>
                  <p className="text-lg font-semibold">${booking.totalPrice.toFixed(2)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Traveler</h3>
                  <p className="text-lg">{booking.fullName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Number of Travelers</h3>
                  <p className="text-lg">{booking.travelers}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trip Type</h3>
                  <p className="text-lg capitalize">{booking.tripType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg capitalize">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Departure Date</h3>
                  <p className="text-lg">{new Date(booking.startDate).toLocaleDateString()}</p>
                </div>

                {booking.returnDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Return Date</h3>
                    <p className="text-lg">{new Date(booking.returnDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {booking.specialRequests && (
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Special Requests</h3>
                  <p className="text-gray-700">{booking.specialRequests}</p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap space-x-0 space-y-3 sm:space-x-4 sm:space-y-0">
                <Link
                  to="/bookings"
                  className="w-full rounded-lg bg-[#304CB2] px-6 py-2 font-bold text-white shadow-sm transition-colors hover:bg-[#1a2a66] sm:w-auto"
                >
                  View All Bookings
                </Link>

                <Link
                  to={`/bookings/${booking.id}/edit`}
                  className="w-full rounded-lg border border-[#304CB2] bg-white px-6 py-2 font-bold text-[#304CB2] shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  Modify Booking
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-md">
            <p className="text-gray-700">No booking details found.</p>
            <div className="mt-4">
              <Link
                to="/book"
                className="inline-block rounded-lg bg-[#304CB2] px-6 py-2 font-bold text-white shadow-sm transition-colors hover:bg-[#1a2a66]"
              >
                Book a Trip
              </Link>
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-[#304CB2]">What's Next?</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#304CB2] font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-medium">Check Your Email</h3>
                <p className="text-gray-600">
                  We've sent a detailed confirmation email to {booking?.email}. It contains your
                  itinerary and payment details.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#304CB2] font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-medium">Download the Southwest App</h3>
                <p className="text-gray-600">
                  Get real-time updates, mobile boarding passes, and easily manage your trip on the
                  go.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#304CB2] font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-medium">Pack Your Bags</h3>
                <p className="text-gray-600">
                  Remember that Southwest offers two free checked bags per passenger!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <Link to="/" className="font-medium text-[#304CB2] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
