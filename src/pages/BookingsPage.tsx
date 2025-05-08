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
    refetch 
  } = useQuery(['bookings'], getUserBookings, {
    retry: 1,
    onError: (err) => {
      console.error('Error fetching bookings:', err);
    }
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-[#304CB2] mb-8">Your Bookings</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-[#304CB2] mb-8">Your Bookings</h1>
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Error Loading Bookings</h2>
            <p>We couldn't load your bookings. Please try again later or contact customer support.</p>
            <div className="mt-4">
              <Link to="/" className="text-[#304CB2] font-medium hover:underline">Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-[#304CB2]">Your Bookings</h1>
            
            <Link 
              to="/book"
              className="inline-flex items-center bg-[#304CB2] hover:bg-[#1a2a66] text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book New Trip
            </Link>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div 
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-[#304CB2] to-[#1a2a66] text-white p-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold">Trip to {booking.tripId}</h2>
                      <p className="text-sm text-blue-100">Booking #{booking.id.substring(0, 8)}</p>
                    </div>
                    <span className={`inline-block px-3 py-1 text-xs rounded-full capitalize ${
                      booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm text-gray-500 font-medium">Traveler</h3>
                        <p className="text-lg font-medium">{booking.fullName}</p>
                        <p className="text-sm text-gray-600">{booking.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-500 font-medium">Travel Dates</h3>
                        <p className="text-lg font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                        {booking.returnDate && (
                          <p className="text-sm text-gray-600">Return: {new Date(booking.returnDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-500 font-medium">Details</h3>
                        <p className="text-lg font-medium">{booking.travelers} traveler{booking.travelers !== 1 ? 's' : ''}</p>
                        <p className="text-sm text-gray-600 capitalize">{booking.tripType}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                      <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="text-xl font-bold text-[#304CB2]">${booking.totalPrice.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link 
                          to={`/bookings/${booking.id}`}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </Link>
                        {booking.status !== 'cancelled' && (
                          <>
                            <Link 
                              to={`/bookings/${booking.id}/edit`}
                              className="px-4 py-2 bg-white border border-[#304CB2] rounded-lg text-[#304CB2] hover:bg-blue-50 transition-colors"
                            >
                              Modify
                            </Link>
                            <button 
                              onClick={() => openCancellationModal(booking.id)}
                              className="px-4 py-2 bg-white border border-red-500 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#304CB2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Found</h2>
              <p className="text-gray-600 mb-6">You haven't made any bookings yet. Start planning your next adventure!</p>
              <Link 
                to="/book"
                className="inline-block bg-[#304CB2] hover:bg-[#1a2a66] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm"
              >
                Book Your First Trip
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancellationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cancel Booking</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowCancellationModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 border border-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
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