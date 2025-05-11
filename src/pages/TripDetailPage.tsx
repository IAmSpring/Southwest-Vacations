import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTripDetails } from '../hooks/useTripDetails';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatDateForDisplay, getDayOfWeek, groupDatesByMonth } from '../utils/dateUtils';

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTripDetails(id!);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [groupedDates, setGroupedDates] = useState<Record<string, string[]>>({});

  // Function to handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // For testing, log the selected date to console
    console.log('Selected date:', date);
  };

  // Set default selected date once data is loaded
  useEffect(() => {
    if (data && data.datesAvailable && data.datesAvailable.length > 0 && !selectedDate) {
      setSelectedDate(data.datesAvailable[0]);
    }
  }, [data, selectedDate]);

  // Group dates by month when data changes
  useEffect(() => {
    if (data?.datesAvailable?.length) {
      setGroupedDates(groupDatesByMonth(data.datesAvailable));
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading />
      </div>
    );

  if (error || !data)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ErrorMessage message="Trip details could not be loaded. Please try again later." />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center font-medium text-[#304CB2] hover:text-[#1a2a66]"
          aria-label="Return to previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
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
              <Link to="/" className="flex items-center transition-colors hover:text-[#304CB2]">
                <span>Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li>
              <Link
                to="/trips"
                className="flex items-center transition-colors hover:text-[#304CB2]"
              >
                <span>Destinations</span>
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li aria-current="page" className="max-w-[180px] truncate font-medium text-[#304CB2]">
              {data.destination}
            </li>
          </ol>
        </nav>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Hero image with overlay */}
          <div className="relative h-[40vh] lg:h-[50vh]">
            <img
              src={data.imageUrl}
              alt={`View of ${data.destination}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
              <div className="w-full p-6 text-white sm:p-8">
                <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:text-5xl">
                  {data.destination}
                </h1>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="rounded-full bg-[#FFBF27] px-3 py-1 text-sm font-bold text-[#304CB2]">
                    ${data.price.toFixed(0)}
                  </div>
                  <span className="text-sm opacity-90 sm:text-base">per person</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="space-y-6 lg:col-span-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-[#304CB2]">About This Destination</h2>
                <div className="prose text-gray-700">
                  <p>{data.description}</p>
                </div>
              </div>

              {/* Available dates - Updated to group by month */}
              {data.datesAvailable && data.datesAvailable.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-[#304CB2]">Available Dates</h2>

                  {Object.entries(groupedDates).map(([month, dates]) => (
                    <div key={month} className="mb-6">
                      <h3 className="mb-3 text-lg font-medium text-gray-700">{month}</h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {dates.map((date, index) => {
                          const formattedDate = formatDateForDisplay(date);
                          const dayOfWeek = getDayOfWeek(date);
                          const dateIndex = data.datesAvailable.indexOf(date);

                          return (
                            <div
                              key={date}
                              className={`cursor-pointer rounded-lg border p-3 text-center transition-colors ${
                                selectedDate === date
                                  ? 'border-[#304CB2] bg-blue-100 text-[#304CB2]'
                                  : 'border-gray-200 bg-gray-50 hover:border-[#304CB2] hover:bg-blue-50'
                              }`}
                              onClick={() => handleDateSelect(date)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleDateSelect(date);
                                }
                              }}
                              aria-label={`Select date: ${formattedDate}`}
                              aria-selected={selectedDate === date}
                              data-testid={`date-option-${dateIndex}`}
                            >
                              <span className="block text-sm text-gray-500">{dayOfWeek}</span>
                              <span className="block font-medium">{formattedDate}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trip amenities */}
              <div>
                <h2 className="mb-4 text-2xl font-bold text-[#304CB2]">What's Included</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-[#E31837]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Round-trip flights</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-[#E31837]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Hotel accommodations</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-[#E31837]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Airport transfers</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-[#E31837]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>All resort fees</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-[#E31837]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5 flex-shrink-0 text-[#E31837]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Two free checked bags</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar with booking options */}
            <div className="self-start rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-xl font-bold text-[#304CB2]">Book Your Trip</h2>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span className="text-lg font-bold">${data.price.toFixed(0)}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">Included</span>
                  </div>
                  {selectedDate && (
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">Selected date</span>
                      <span className="font-medium">{formatDateForDisplay(selectedDate)}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                    <span className="font-medium">Total from</span>
                    <span className="text-xl font-bold text-[#E31837]">
                      ${data.price.toFixed(0)}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/book?trip=${data.id}${selectedDate ? `&date=${selectedDate}` : ''}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-full bg-[#E31837] px-6 py-3 text-center font-bold text-white shadow-sm transition-colors hover:bg-[#c41230] focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:ring-offset-2"
                  aria-label={`Book trip to ${data.destination} now`}
                >
                  <span>Book Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>

                <button
                  className="flex w-full items-center justify-center space-x-2 rounded-full border border-[#304CB2] bg-white px-6 py-3 font-medium text-[#304CB2] shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#304CB2] focus:ring-offset-2"
                  aria-label="Save this trip to favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Save to Favorites</span>
                </button>

                {/* Southwest advantage banner */}
                <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <h3 className="mb-2 flex items-center font-medium text-[#304CB2]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Southwest Advantage
                  </h3>
                  <p className="mb-2 text-sm text-gray-700">
                    Travel with confidence knowing you have:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4 flex-shrink-0 text-[#FFBF27]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>No change fees</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4 flex-shrink-0 text-[#FFBF27]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Two free checked bags</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4 flex-shrink-0 text-[#FFBF27]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Low fare guarantee</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom call to action */}
          <div className="flex flex-col border-t border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-[#304CB2]">
                Ready to explore {data.destination}?
              </h2>
              <p className="mt-1 text-gray-600">Book now and start your adventure!</p>
            </div>
            <Link
              to={`/book?trip=${data.id}${selectedDate ? `&date=${selectedDate}` : ''}`}
              className="mt-4 inline-flex items-center justify-center space-x-2 rounded-full bg-[#E31837] px-6 py-3 text-center font-bold text-white shadow-sm transition-colors hover:bg-[#c41230] focus:outline-none focus:ring-2 focus:ring-[#E31837] focus:ring-offset-2 sm:mt-0"
              aria-label={`Proceed to book your trip to ${data.destination}`}
            >
              <span>Book This Trip</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
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
      </div>
    </div>
  );
};

export default TripDetailPage;
