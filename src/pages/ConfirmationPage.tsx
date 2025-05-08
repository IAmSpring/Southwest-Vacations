import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getBookingById } from '../api/bookings';

const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  
  const { data: booking, isLoading, error } = useQuery(
    ['booking', bookingId],
    () => bookingId ? getBookingById(bookingId) : null,
    {
      enabled: !!bookingId,
      retry: false
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-300 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <h2 className="text-xl font-semibold mb-2">Error Loading Booking</h2>
        <p>We couldn't load your booking details. Please try again later or contact customer support.</p>
        <div className="mt-4">
          <Link to="/" className="text-[#304CB2] font-medium hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-green-700 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-green-800">Your vacation has been booked successfully.</p>
          
          {booking && (
            <div className="mt-4 text-sm text-green-700">
              <p>Confirmation Number: <span className="font-bold">{booking.id}</span></p>
            </div>
          )}
        </div>

        {/* Booking Details Card */}
        {booking ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#304CB2] to-[#1a2a66] text-white p-4">
              <h2 className="text-xl font-bold">Booking Details</h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Trip</h3>
                  <p className="text-lg font-semibold">{booking.tripId}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Total Price</h3>
                  <p className="text-lg font-semibold">${booking.totalPrice.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Traveler</h3>
                  <p className="text-lg">{booking.fullName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Number of Travelers</h3>
                  <p className="text-lg">{booking.travelers}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Trip Type</h3>
                  <p className="text-lg capitalize">{booking.tripType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Status</h3>
                  <p className="text-lg capitalize">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Departure Date</h3>
                  <p className="text-lg">{new Date(booking.startDate).toLocaleDateString()}</p>
                </div>
                
                {booking.returnDate && (
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">Return Date</h3>
                    <p className="text-lg">{new Date(booking.returnDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {booking.specialRequests && (
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h3 className="text-sm text-gray-500 font-medium mb-2">Special Requests</h3>
                  <p className="text-gray-700">{booking.specialRequests}</p>
                </div>
              )}
              
              <div className="mt-8 flex flex-wrap space-x-0 space-y-3 sm:space-x-4 sm:space-y-0">
                <Link 
                  to="/bookings"
                  className="w-full sm:w-auto bg-[#304CB2] hover:bg-[#1a2a66] text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                  View All Bookings
                </Link>
                
                <Link 
                  to={`/bookings/${booking.id}/edit`}
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#304CB2] font-bold py-2 px-6 rounded-lg border border-[#304CB2] transition-colors shadow-sm"
                >
                  Modify Booking
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center">
            <p className="text-gray-700">No booking details found.</p>
            <div className="mt-4">
              <Link 
                to="/book"
                className="inline-block bg-[#304CB2] hover:bg-[#1a2a66] text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
              >
                Book a Trip
              </Link>
            </div>
          </div>
        )}
        
        {/* What's Next Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#304CB2] mb-4">What's Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#304CB2] rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium">Check Your Email</h3>
                <p className="text-gray-600">We've sent a detailed confirmation email to {booking?.email}. It contains your itinerary and payment details.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#304CB2] rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium">Download the Southwest App</h3>
                <p className="text-gray-600">Get real-time updates, mobile boarding passes, and easily manage your trip on the go.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[#304CB2] rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium">Pack Your Bags</h3>
                <p className="text-gray-600">Remember that Southwest offers two free checked bags per passenger!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-[#304CB2] font-medium hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
