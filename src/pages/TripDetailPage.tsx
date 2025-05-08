import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTripDetails } from '../hooks/useTripDetails';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTripDetails(id!);

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loading />
    </div>
  );
  
  if (error || !data) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <ErrorMessage message="Trip details could not be loaded. Please try again later." />
      <button 
        onClick={() => navigate(-1)} 
        className="mt-4 text-[#304CB2] hover:text-[#1a2a66] font-medium flex items-center"
        aria-label="Return to previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-[#304CB2] transition-colors flex items-center">
                <span>Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link to="/trips" className="hover:text-[#304CB2] transition-colors flex items-center">
                <span>Destinations</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li aria-current="page" className="font-medium text-[#304CB2] truncate max-w-[180px]">{data.destination}</li>
          </ol>
        </nav>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero image with overlay */}
          <div className="relative h-[40vh] lg:h-[50vh]">
            <img 
              src={data.imageUrl} 
              alt={`View of ${data.destination}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 sm:p-8 text-white w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{data.destination}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="bg-[#FFBF27] text-[#304CB2] font-bold py-1 px-3 rounded-full text-sm">
                    ${data.price.toFixed(0)}
                  </div>
                  <span className="text-sm sm:text-base opacity-90">per person</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="grid lg:grid-cols-3 gap-8 p-6 sm:p-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#304CB2] mb-4">About This Destination</h2>
                <div className="prose text-gray-700">
                  <p>{data.description}</p>
                </div>
              </div>
              
              {/* Available dates */}
              {data.datesAvailable && data.datesAvailable.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#304CB2] mb-4">Available Dates</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {data.datesAvailable.map((date, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:border-[#304CB2] hover:bg-blue-50 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`Select date: ${date}`}
                      >
                        <span className="block text-gray-900 font-medium">{date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trip amenities */}
              <div>
                <h2 className="text-2xl font-bold text-[#304CB2] mb-4">What's Included</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E31837] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Round-trip flights</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E31837] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Hotel accommodations</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E31837] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Airport transfers</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E31837] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All resort fees</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E31837] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E31837] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Two free checked bags</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Sidebar with booking options */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 self-start">
              <h2 className="text-xl font-bold text-[#304CB2] mb-4">Book Your Trip</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-bold text-lg">${data.price.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-medium">Total from</span>
                    <span className="font-bold text-xl text-[#E31837]">${data.price.toFixed(0)}</span>
                  </div>
                </div>
                
                <Link 
                  to={`/book?trip=${data.id}`}
                  className="w-full bg-[#E31837] hover:bg-[#c41230] text-white text-center font-bold py-3 px-6 rounded-full shadow-sm transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:ring-offset-2"
                  aria-label={`Book trip to ${data.destination} now`}
                >
                  <span>Book Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                
                <button 
                  className="w-full bg-white hover:bg-gray-50 text-[#304CB2] font-medium py-3 px-6 rounded-full shadow-sm border border-[#304CB2] transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#304CB2] focus:ring-offset-2"
                  aria-label="Save this trip to favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Save to Favorites</span>
                </button>
                
                {/* Southwest advantage banner */}
                <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-[#304CB2] mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Southwest Advantage
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Travel with confidence knowing you have:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFBF27] mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>No change fees</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFBF27] mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Two free checked bags</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFBF27] mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Low fare guarantee</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom call to action */}
          <div className="border-t border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-[#304CB2]">Ready to explore {data.destination}?</h2>
              <p className="text-gray-600 mt-1">Book now and start your adventure!</p>
            </div>
            <Link 
              to={`/book?trip=${data.id}`}
              className="mt-4 sm:mt-0 bg-[#E31837] hover:bg-[#c41230] text-white text-center font-bold py-3 px-6 rounded-full shadow-sm transition-colors inline-flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:ring-offset-2"
              aria-label={`Proceed to book your trip to ${data.destination}`}
            >
              <span>Book This Trip</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
