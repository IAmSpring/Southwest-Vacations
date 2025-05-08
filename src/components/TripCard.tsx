import React, { useState, useEffect } from 'react';
import { Trip } from '../sharedTypes';
import { Link } from 'react-router-dom';

type Props = { trip: Trip; isLoading?: boolean };

const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative w-full h-56 overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300">
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300">
          <div className="flex h-full items-center justify-center">
            <svg className="w-10 h-10 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">{alt}</p>
        </div>
      ) : (
        <img 
          src={imgSrc} 
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};

const TripCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
    <div className="p-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-10 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
      </div>
    </div>
  </div>
);

const TripCard = ({ trip, isLoading = false }: Props) => {
  // Safely check if description exists on the trip object
  const hasDescription = 'description' in trip && typeof (trip as any).description === 'string';
  const description = hasDescription ? (trip as any).description : '';
  
  if (isLoading) {
    return <TripCardSkeleton />;
  }
  
  return (
    <div 
      className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg transform hover:-translate-y-1 border border-gray-100 hover:border-[#304CB2]/20"
      data-testid="trip-card"
    >
      <div className="relative overflow-hidden">
        <Link to={`/trip/${trip.id}`} className="block">
          <ImageWithFallback 
            src={trip.imageUrl} 
            alt={`View of ${trip.destination}`}
            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Price tag overlay with wave animation */}
          <div className="absolute top-4 right-4 bg-[#FFBF27] text-[#304CB2] font-bold py-1 px-3 rounded-full shadow-sm overflow-hidden">
            <span className="relative z-10">${trip.price.toFixed(0)}</span>
            <div className="absolute bottom-0 left-0 w-full h-full">
              <div className="absolute inset-0 bg-white/20 h-[20%] w-[200%] animate-wave-slow"></div>
              <div className="absolute inset-0 bg-white/10 h-[30%] w-[200%] animate-wave"></div>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="p-5">
        <h2 className="text-xl font-bold text-[#304CB2] mb-2 truncate" title={trip.destination}>
          {trip.destination}
        </h2>
        
        {/* Description section with proper type handling */}
        <div className="text-gray-600 text-sm mb-4 h-10">
          {hasDescription ? (
            <p className="line-clamp-2">
              {description.substring(0, 75)}
              {description.length > 75 ? '...' : ''}
            </p>
          ) : (
            <p>Discover this amazing destination with Southwest Vacations!</p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/trip/${trip.id}`} 
            className="text-[#304CB2] hover:text-[#1a2a66] font-medium text-sm flex items-center gap-1 group-hover:underline transition-all duration-300"
            aria-label={`View details for ${trip.destination}`}
          >
            <span>View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
          
          <Link 
            to={`/book?trip=${trip.id}`} 
            className="inline-block bg-[#E31837] hover:bg-[#c41230] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden group"
            aria-label={`Book trip to ${trip.destination} now`}
          >
            <span className="relative z-10">Book Now</span>
            <div className="absolute inset-0 w-0 bg-[#A30F27] group-hover:w-full transition-all duration-500 ease-out rounded-full"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
