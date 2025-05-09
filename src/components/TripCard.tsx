import React, { useState, useEffect } from 'react';
import { Trip } from '../sharedTypes';
import { Link } from 'react-router-dom';

type Props = { trip: Trip; isLoading?: boolean };

const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative h-56 w-full overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300">
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300">
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
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
          </div>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
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
  <div className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
    <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
    <div className="space-y-3 p-5">
      <div className="h-6 w-3/4 rounded bg-gray-200"></div>
      <div className="h-10 space-y-2">
        <div className="h-3 rounded bg-gray-200"></div>
        <div className="h-3 w-5/6 rounded bg-gray-200"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
        <div className="h-8 w-1/4 rounded-full bg-gray-200"></div>
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
      className="group transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-[#304CB2]/20 hover:shadow-lg"
      data-testid="trip-card"
    >
      <div className="relative overflow-hidden">
        <Link to={`/trip/${trip.id}`} className="block">
          <ImageWithFallback
            src={trip.imageUrl}
            alt={`View of ${trip.destination}`}
            className="h-56 w-full transform object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Price tag overlay with wave animation */}
          <div className="absolute right-4 top-4 overflow-hidden rounded-full bg-[#FFBF27] px-3 py-1 font-bold text-[#304CB2] shadow-sm">
            <span className="relative z-10">${trip.price.toFixed(0)}</span>
            <div className="absolute bottom-0 left-0 h-full w-full">
              <div className="absolute inset-0 h-[20%] w-[200%] animate-wave-slow bg-white/20"></div>
              <div className="absolute inset-0 h-[30%] w-[200%] animate-wave bg-white/10"></div>
            </div>
          </div>
        </Link>
      </div>

      <div className="p-5">
        <h2 className="mb-2 truncate text-xl font-bold text-[#304CB2]" title={trip.destination}>
          {trip.destination}
        </h2>

        {/* Description section with proper type handling */}
        <div className="mb-4 h-10 text-sm text-gray-600">
          {hasDescription ? (
            <p className="line-clamp-2">
              {description.substring(0, 75)}
              {description.length > 75 ? '...' : ''}
            </p>
          ) : (
            <p>Discover this amazing destination with Southwest Vacations!</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/trip/${trip.id}`}
            className="flex items-center gap-1 text-sm font-medium text-[#304CB2] transition-all duration-300 hover:text-[#1a2a66] group-hover:underline"
            aria-label={`View details for ${trip.destination}`}
          >
            <span>View Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>

          <Link
            to={`/book?trip=${trip.id}`}
            className="group relative inline-block overflow-hidden rounded-full bg-[#E31837] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#c41230] hover:shadow-md"
            aria-label={`Book trip to ${trip.destination} now`}
          >
            <span className="relative z-10">Book Now</span>
            <div className="absolute inset-0 w-0 rounded-full bg-[#A30F27] transition-all duration-500 ease-out group-hover:w-full"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
