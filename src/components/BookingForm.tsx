import React, { useState, useEffect } from 'react';
import { useBooking } from '../hooks/useBooking';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { TripType, Hotel, CarRental } from '../sharedTypes';
import { createMockBooking } from '../api/simpleClient';

// Time options for dropdowns
const TIME_OPTIONS = [
  { value: 'morning', label: 'Morning (6:00 AM - 11:59 AM)' },
  { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:59 PM)' },
  { value: 'evening', label: 'Evening (5:00 PM - 11:59 PM)' },
];

// Initial segment structure
const initialSegment = {
  from: '',
  to: '',
  departureDate: '',
  returnDate: '',
  flightNumbers: [],
};

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const { form, handleChange, handleTripTypeChange, submitBooking, isLoading } = useBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTooltips, setShowTooltips] = useState<Record<string, boolean>>({});

  // Add time selection state
  const [departureTime, setDepartureTime] = useState(TIME_OPTIONS[0].value);
  const [returnTime, setReturnTime] = useState(TIME_OPTIONS[0].value);

  // Add hotel and car rental state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<string | null>(null);
  const [includeHotel, setIncludeHotel] = useState(false);
  const [includeCar, setIncludeCar] = useState(false);

  // Multi-destination itinerary state
  const [isMultiDestination, setIsMultiDestination] = useState(false);
  const [segments, setSegments] = useState([{ ...initialSegment }]);
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);

  const navigate = useNavigate();

  // Fetch available destinations on component mount
  useEffect(() => {
    fetchAvailableDestinations();
  }, []);

  // Fetch trip details including hotels and car rentals when trip ID changes
  useEffect(() => {
    const tripId = searchParams.get('trip');
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [searchParams]);

  // Function to fetch available destinations
  const fetchAvailableDestinations = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      const data = await response.json();
      setAvailableDestinations(data.map((dest: any) => dest.name || dest));
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  // Function to fetch trip details
  const fetchTripDetails = async (tripId: string) => {
    try {
      const response = await fetch(`/trips/${tripId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trip details');
      }

      const tripData = await response.json();
      if (tripData.hotels) {
        setHotels(tripData.hotels);
      }

      if (tripData.carRentals) {
        setCarRentals(tripData.carRentals);
      }
    } catch (error) {
      console.error('Error fetching trip details:', error);
    }
  };

  // Add a new segment to the multi-destination itinerary
  const addSegment = () => {
    setSegments([...segments, { ...initialSegment }]);
  };

  // Remove a segment from the multi-destination itinerary
  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      const updatedSegments = [...segments];
      updatedSegments.splice(index, 1);
      setSegments(updatedSegments);
    }
  };

  // Update a segment's data
  const updateSegment = (index: number, field: string, value: string) => {
    const updatedSegments = [...segments];
    updatedSegments[index] = {
      ...updatedSegments[index],
      [field]: value,
    };
    setSegments(updatedSegments);
  };

  // Toggle multi-destination mode
  const toggleMultiDestination = () => {
    setIsMultiDestination(!isMultiDestination);
    if (!isMultiDestination) {
      // Switching to multi-destination mode
      // Initialize first segment with the current form data
      setSegments([
        {
          from: '',
          to: searchParams.get('trip') || '',
          departureDate: form.startDate,
          returnDate: form.returnDate || '',
          flightNumbers: [],
        },
      ]);
    }
  };

  // Handle form validation
  const validateForm = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validate full name
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate travelers
    if (!form.travelers) {
      newErrors.travelers = 'Number of travelers is required';
    } else if (form.travelers < 1) {
      newErrors.travelers = 'At least 1 traveler is required';
    } else if (form.travelers > 8) {
      newErrors.travelers = 'Maximum 8 travelers allowed per booking';
    }

    // Validate multi-destination segments if enabled
    if (isMultiDestination) {
      let hasSegmentErrors = false;
      segments.forEach((segment, index) => {
        if (!segment.from) {
          newErrors[`segment_${index}_from`] = 'Origin is required';
          hasSegmentErrors = true;
        }
        if (!segment.to) {
          newErrors[`segment_${index}_to`] = 'Destination is required';
          hasSegmentErrors = true;
        }
        if (!segment.departureDate) {
          newErrors[`segment_${index}_departureDate`] = 'Departure date is required';
          hasSegmentErrors = true;
        }
      });

      if (hasSegmentErrors) {
        newErrors.segments = 'Please fix errors in your travel segments';
      }
    } else {
      // Standard validation for single-destination bookings
      // Validate start date
      if (!form.startDate) {
        newErrors.startDate = 'Start date is required';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(form.startDate);

        if (selectedDate < today) {
          newErrors.startDate = 'Date cannot be in the past';
        }
      }

      // Validate return date if round trip
      if (form.tripType === 'round-trip') {
        if (!form.returnDate) {
          newErrors.returnDate = 'Return date is required for round trips';
        } else {
          const startDate = new Date(form.startDate);
          const returnDate = new Date(form.returnDate);

          if (returnDate <= startDate) {
            newErrors.returnDate = 'Return date must be after start date';
          }
        }
      }
    }

    // Validate hotel selection if hotel is included
    if (includeHotel && !selectedHotel) {
      newErrors.hotel = 'Please select a hotel';
    }

    // Validate car rental selection if car is included
    if (includeCar && !selectedCar) {
      newErrors.car = 'Please select a car rental';
    }

    setErrors(newErrors);

    // If no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      return true;
    }
    return false;
  };

  // Tooltip toggles
  const toggleTooltip = (field: string) => {
    setShowTooltips(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Update the handleSubmit function to use createMockBooking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (validateForm(e)) {
      try {
        setErrors({});

        // Show loading state
        const loadingToast = document.getElementById('loading-toast');
        if (loadingToast) {
          loadingToast.classList.remove('hidden');
        }

        // Prepare booking data
        const bookingData = {
          tripType: form.tripType,
          departureDate: form.startDate,
          returnDate: form.tripType === 'round-trip' ? form.returnDate : null,
          departureTime,
          returnTime: form.tripType === 'round-trip' ? returnTime : null,
          includeHotel,
          includeCar,
          hotelId: includeHotel ? selectedHotel : null,
          carId: includeCar ? selectedCar : null,
          passengers: form.travelers || 1,
          isMultiDestination,
          segments: isMultiDestination ? segments : null,
        };

        // Call the mock booking function
        const booking = await createMockBooking(bookingData);

        // Hide loading state
        if (loadingToast) {
          loadingToast.classList.add('hidden');
        }

        // Show success message
        alert('Booking successful! Confirmation code: ' + booking.confirmationCode);

        // Navigate to confirmation page
        navigate(`/confirmation?id=${booking.id}`);
      } catch (error) {
        console.error('Error submitting booking:', error);
        // Show error message
        alert('Error submitting booking. Please try again.');

        // Hide loading state
        const loadingToast = document.getElementById('loading-toast');
        if (loadingToast) {
          loadingToast.classList.add('hidden');
        }
      }
    }
  };

  return (
    <div
      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      data-testid="booking-form"
    >
      <h2 className="mb-6 text-2xl font-bold text-[#304CB2]" data-testid="booking-details-title">
        Booking Details
      </h2>

      {searchParams.get('trip') && (
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Selected Trip ID:</span> {searchParams.get('trip')}
          </p>
          {searchParams.get('date') && (
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-medium">Selected Date:</span> {searchParams.get('date')}
            </p>
          )}
        </div>
      )}

      {/* Loading toast */}
      <div
        id="loading-toast"
        className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 transform rounded-lg bg-blue-500 px-6 py-3 text-white shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span>Processing your booking...</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Multi-Destination Toggle */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              id="multi-destination"
              type="checkbox"
              checked={isMultiDestination}
              onChange={toggleMultiDestination}
              className="h-4 w-4 rounded border-gray-300 text-[#304CB2] focus:ring-[#304CB2]"
            />
            <label htmlFor="multi-destination" className="text-sm font-medium text-gray-700">
              Create multi-destination itinerary
            </label>
          </div>
          {isMultiDestination && (
            <p className="mt-1 text-sm text-gray-500">
              You can add multiple segments to create a complex itinerary
            </p>
          )}
        </div>

        {isMultiDestination ? (
          /* Multi-destination booking form */
          <div className="space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-800">Multi-Destination Itinerary</h3>

            {segments.map((segment, index) => (
              <div key={index} className="relative rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-700">Segment {index + 1}</h4>
                  {segments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSegment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      From <span className="text-[#E31837]">*</span>
                    </label>
                    <input
                      type="text"
                      list="origins"
                      value={segment.from}
                      onChange={e => updateSegment(index, 'from', e.target.value)}
                      className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#304CB2] focus:outline-none focus:ring-1 focus:ring-[#304CB2] sm:text-sm ${errors[`segment_${index}_from`] ? 'border-red-500' : ''}`}
                    />
                    <datalist id="origins">
                      {availableDestinations.map((dest, i) => (
                        <option key={`origin-${i}`} value={dest} />
                      ))}
                    </datalist>
                    {errors[`segment_${index}_from`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`segment_${index}_from`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      To <span className="text-[#E31837]">*</span>
                    </label>
                    <input
                      type="text"
                      list="destinations"
                      value={segment.to}
                      onChange={e => updateSegment(index, 'to', e.target.value)}
                      className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#304CB2] focus:outline-none focus:ring-1 focus:ring-[#304CB2] sm:text-sm ${errors[`segment_${index}_to`] ? 'border-red-500' : ''}`}
                    />
                    <datalist id="destinations">
                      {availableDestinations.map((dest, i) => (
                        <option key={`dest-${i}`} value={dest} />
                      ))}
                    </datalist>
                    {errors[`segment_${index}_to`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`segment_${index}_to`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Departure Date <span className="text-[#E31837]">*</span>
                    </label>
                    <input
                      type="date"
                      value={segment.departureDate}
                      onChange={e => updateSegment(index, 'departureDate', e.target.value)}
                      className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#304CB2] focus:outline-none focus:ring-1 focus:ring-[#304CB2] sm:text-sm ${errors[`segment_${index}_departureDate`] ? 'border-red-500' : ''}`}
                    />
                    {errors[`segment_${index}_departureDate`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`segment_${index}_departureDate`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Return Date</label>
                    <input
                      type="date"
                      value={segment.returnDate}
                      onChange={e => updateSegment(index, 'returnDate', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#304CB2] focus:outline-none focus:ring-1 focus:ring-[#304CB2] sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={addSegment}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Another Segment
              </button>
            </div>

            {errors.segments && (
              <div className="rounded-md bg-red-50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.segments}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Standard single-destination booking form */
          <>
            {/* Trip Type Selector */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                data-testid="trip-type-label"
              >
                Trip Type
              </label>
              <div className="mt-2 flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="one-way"
                    name="tripType"
                    type="radio"
                    checked={form.tripType === 'one-way'}
                    onChange={() => handleTripTypeChange('one-way')}
                    className="h-4 w-4 border-gray-300 text-[#304CB2] focus:ring-[#304CB2]"
                    data-testid="one-way-radio"
                  />
                  <label htmlFor="one-way" className="ml-2 block text-sm text-gray-700">
                    One Way
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="round-trip"
                    name="tripType"
                    type="radio"
                    checked={form.tripType === 'round-trip'}
                    onChange={() => handleTripTypeChange('round-trip')}
                    className="h-4 w-4 border-gray-300 text-[#304CB2] focus:ring-[#304CB2]"
                    data-testid="round-trip-radio"
                  />
                  <label htmlFor="round-trip" className="ml-2 block text-sm text-gray-700">
                    Round Trip
                  </label>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="startDate"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    Departure Date <span className="text-[#E31837]">*</span>
                    <button
                      type="button"
                      onClick={() => toggleTooltip('startDate')}
                      className="ml-1 text-gray-400 hover:text-gray-500"
                      aria-label="More information about departure date"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </label>

                  {showTooltips.startDate && (
                    <div className="mt-1 rounded-md bg-gray-100 p-2 text-xs text-gray-600">
                      Select the date you want to start your trip.
                    </div>
                  )}

                  <div
                    className={`relative mt-1 ${searchParams.get('date') ? 'date-selected' : ''}`}
                  >
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={handleChange}
                      className={`block w-full rounded-md border ${
                        searchParams.get('date') ? 'border-[#304CB2] bg-blue-50' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-[#304CB2] focus:outline-none focus:ring-1 focus:ring-[#304CB2] sm:text-sm ${
                        errors.startDate ? 'border-red-500' : ''
                      }`}
                      required
                      data-testid="departure-date-input"
                    />
                    {searchParams.get('date') && (
                      <div className="absolute right-2 top-2 text-[#304CB2]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600" data-testid="departure-date-error">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {form.tripType === 'round-trip' && (
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <label
                        htmlFor="returnDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Return Date <span className="text-[#E31837]">*</span>
                      </label>
                      <button
                        type="button"
                        className="flex items-center text-sm text-[#304CB2]"
                        onClick={() => toggleTooltip('returnDate')}
                        aria-label="Show information about return date field"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                      </button>
                    </div>

                    {showTooltips.returnDate && (
                      <div className="mb-2 rounded bg-gray-100 p-2 text-xs text-gray-700">
                        Select your return date. The date must be after your departure date.
                      </div>
                    )}

                    <input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      value={form.returnDate || ''}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-2 transition-colors focus:border-[#304CB2] focus:outline-none focus:ring-2 focus:ring-[#304CB2] ${
                        errors.returnDate ? 'border-[#E31837]' : 'border-gray-300'
                      }`}
                      data-testid="return-date-input"
                    />

                    {errors.returnDate && (
                      <p className="mt-1 text-sm text-[#E31837]" data-testid="return-date-error">
                        {errors.returnDate}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Rest of the booking form (traveler details, etc.) */}
        {/* ... (Keep existing form fields) ... */}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#304CB2] px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[#1a2a66] focus:outline-none focus:ring-2 focus:ring-[#304CB2] focus:ring-offset-2 disabled:opacity-50"
            data-testid="submit-booking-btn"
          >
            Book Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
