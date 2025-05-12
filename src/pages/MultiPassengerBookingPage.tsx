import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MultiCustomerBookingForm from '../components/MultiCustomerBookingForm';
import { useAuthContext } from '../context/AuthContext';

interface Trip {
  id: string;
  name: string;
  price: number;
  description: string;
  destination: string;
  imageUrl?: string;
  duration?: number;
}

const MultiPassengerBookingPage: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTravelers = parseInt(queryParams.get('travelers') || '1', 10);
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch trip details
  useEffect(() => {
    if (tripId) {
      // In a real application, this would be a real API call
      // For now, we'll mock the data
      setTrip({
        id: tripId,
        name: 'Las Vegas Adventure',
        price: 599,
        description: 'Experience the magic of Las Vegas with this all-inclusive package',
        destination: 'Las Vegas, Nevada',
        imageUrl: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d',
        duration: 5,
      });
    }
  }, [tripId]);

  const handleSubmit = async (bookingData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to create the booking
      console.log('Booking data submitted:', bookingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to confirmation page
      navigate('/confirmation', { 
        state: { 
          bookingId: 'BOOK-' + Math.floor(Math.random() * 10000),
          passengers: bookingData.passengerDetails.length,
          destination: trip?.destination,
          departureDate: bookingData.startDate,
          returnDate: bookingData.returnDate
        } 
      });
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!trip) {
    return (
      <div className="container mx-auto mt-8 px-4">
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Multi-Passenger Booking</h1>
        <p className="text-gray-600">Create a booking with multiple passengers</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MultiCustomerBookingForm
            tripId={trip.id}
            tripName={trip.name}
            defaultTravelers={defaultTravelers}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">{trip.name}</h2>
            <div className="mb-4 aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
              {trip.imageUrl && (
                <img 
                  src={trip.imageUrl}
                  alt={trip.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">${trip.price}</span>
              <span className="text-gray-500"> / person</span>
            </div>
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-medium">Trip Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Destination: {trip.destination}
                </li>
                {trip.duration && (
                  <li className="flex items-center">
                    <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Duration: {trip.duration} days
                  </li>
                )}
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All-inclusive package
                </li>
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-2 text-lg font-medium">Price Calculation</h3>
              <div className="flex justify-between text-sm">
                <span>Base price per person:</span>
                <span>${trip.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Number of passengers:</span>
                <span>{defaultTravelers}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-medium">
                <span>Total price:</span>
                <span>${trip.price * defaultTravelers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiPassengerBookingPage; 