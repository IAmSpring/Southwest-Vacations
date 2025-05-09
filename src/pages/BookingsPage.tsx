import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getUserBookings, cancelBooking } from '../api/bookings';

const BookingsPage = () => {
  const [cancellationId, setCancellationId] = useState<string | null>(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const {
    data: bookings,
    isLoading,
    error,
    refetch,
  } = useQuery(['bookings'], getUserBookings, {
    retry: 1,
    onError: err => {
      console.error('Error fetching bookings:', err);
    },
  });

  const handleCancelBooking = async () => {
    if (!cancellationId) return;

    try {
      await cancelBooking(cancellationId);
      setShowCancellationModal(false);
      setCancellationId(null);
      // Refetch bookings after cancellation
      refetch();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('There was an error cancelling your booking. Please try again.');
    }
  };

  const openCancellationModal = (bookingId: string) => {
    setCancellationId(bookingId);
    setShowCancellationModal(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-[#304CB2]">Your Bookings</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-4 h-6 w-1/4 rounded bg-gray-200"></div>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-[#304CB2]">Your Bookings</h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
            <h2 className="mb-2 text-xl font-semibold">Error Loading Bookings</h2>
            <p>
              We couldn't load your bookings. Please try again later or contact customer support.
            </p>
            <div className="mt-4">
              <Link to="/" className="font-medium text-[#304CB2] hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#304CB2]">Your Bookings</h1>

            <Link
              to="/book"
              className="inline-flex items-center rounded-lg bg-[#304CB2] px-4 py-2 font-bold text-white transition-colors hover:bg-[#1a2a66]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Book New Trip
            </Link>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between bg-gradient-to-r from-[#304CB2] to-[#1a2a66] p-4 text-white">
                    <div>
                      <h2 className="text-lg font-bold">Trip to {booking.tripId}</h2>
                      <p className="text-sm text-blue-100">Booking #{booking.id.substring(0, 8)}</p>
                    </div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs capitalize ${
                        booking.status === 'confirmed'
                          ? 'bg-green-200 text-green-800'
                          : booking.status === 'pending'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 grid gap-6 md:grid-cols-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Traveler</h3>
                        <p className="text-lg font-medium">{booking.fullName}</p>
                        <p className="text-sm text-gray-600">{booking.email}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Travel Dates</h3>
                        <p className="text-lg font-medium">
                          {new Date(booking.startDate).toLocaleDateString()}
                        </p>
                        {booking.returnDate && (
                          <p className="text-sm text-gray-600">
                            Return: {new Date(booking.returnDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Details</h3>
                        <p className="text-lg font-medium">
                          {booking.travelers} traveler{booking.travelers !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm capitalize text-gray-600">{booking.tripType}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="text-xl font-bold text-[#304CB2]">
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        {booking.status !== 'cancelled' && (
                          <>
                            <Link
                              to={`/bookings/${booking.id}/edit`}
                              className="rounded-lg border border-[#304CB2] bg-white px-4 py-2 text-[#304CB2] transition-colors hover:bg-blue-50"
                            >
                              Modify
                            </Link>
                            <button
                              onClick={() => openCancellationModal(booking.id)}
                              className="rounded-lg border border-red-500 bg-white px-4 py-2 text-red-500 transition-colors hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#304CB2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">No Bookings Found</h2>
              <p className="mb-6 text-gray-600">
                You haven't made any bookings yet. Start planning your next adventure!
              </p>
              <Link
                to="/book"
                className="inline-block rounded-lg bg-[#304CB2] px-6 py-3 font-bold text-white shadow-sm transition-colors hover:bg-[#1a2a66]"
              >
                Book Your First Trip
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancellationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Cancel Booking</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancellationModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
