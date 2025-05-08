import React, { useState, useEffect } from 'react';
import { useBooking } from '../hooks/useBooking';
import { useSearchParams } from 'react-router-dom';
import { TripType, Hotel, CarRental } from '../sharedTypes';

// Time options for dropdowns
const TIME_OPTIONS = [
  { value: "morning", label: "Morning (6:00 AM - 11:59 AM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM - 4:59 PM)" },
  { value: "evening", label: "Evening (5:00 PM - 11:59 PM)" }
];

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
  
  // Fetch trip details including hotels and car rentals when trip ID changes
  useEffect(() => {
    const tripId = searchParams.get('trip');
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [searchParams]);
  
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
      // Add time, hotel, and car rental selections to the form data before submitting
      const updatedForm = {
        ...form,
        departureTime,
        returnTime: form.tripType === 'round-trip' ? returnTime : undefined,
        hotelId: includeHotel ? selectedHotel : undefined,
        carRentalId: includeCar ? selectedCar : undefined
      };
      
      // Call the submitBooking function from the hook with the enhanced form data
      try {
        submitBooking(event, updatedForm);
      } catch (error) {
        console.error('Error submitting booking:', error);
      }
    }
  };
  
  // Tooltip toggles
  const toggleTooltip = (field: string) => {
    setShowTooltips(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-[#304CB2] mb-6">Booking Details</h2>
      
      {searchParams.get('trip') && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Selected Trip ID:</span> {searchParams.get('trip')}
          </p>
        </div>
      )}
      
      <form onSubmit={validateForm} className="space-y-5" noValidate>
        {/* Trip Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Type <span className="text-[#E31837]">*</span>
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleTripTypeChange('one-way')}
              className={`px-4 py-2 rounded-lg flex-1 ${
                form.tripType === 'one-way'
                  ? 'bg-[#304CB2] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeChange('round-trip')}
              className={`px-4 py-2 rounded-lg flex-1 ${
                form.tripType === 'round-trip'
                  ? 'bg-[#304CB2] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* Full Name Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-[#E31837]">*</span>
            </label>
            <button 
              type="button" 
              className="text-[#304CB2] text-sm flex items-center"
              onClick={() => toggleTooltip('fullName')}
              aria-label="Show information about full name field"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {showTooltips.fullName && (
            <div className="text-xs bg-gray-100 p-2 rounded mb-2 text-gray-700">
              Enter your full name as it appears on your government-issued ID.
            </div>
          )}
          
          <input 
            id="fullName"
            name="fullName" 
            value={form.fullName} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors ${
              errors.fullName ? 'border-[#E31837]' : 'border-gray-300'
            }`}
            placeholder="e.g. John Smith"
            aria-required="true"
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={errors.fullName ? "fullNameError" : undefined}
          />
          
          {errors.fullName && (
            <p id="fullNameError" className="mt-1 text-[#E31837] text-sm" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>
        
        {/* Email Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-[#E31837]">*</span>
            </label>
            <button 
              type="button" 
              className="text-[#304CB2] text-sm flex items-center"
              onClick={() => toggleTooltip('email')}
              aria-label="Show information about email field"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {showTooltips.email && (
            <div className="text-xs bg-gray-100 p-2 rounded mb-2 text-gray-700">
              We'll use this email to send your booking confirmation and itinerary details.
            </div>
          )}
          
          <input 
            id="email"
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors ${
              errors.email ? 'border-[#E31837]' : 'border-gray-300'
            }`}
            placeholder="e.g. your.email@example.com"
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "emailError" : undefined}
          />
          
          {errors.email && (
            <p id="emailError" className="mt-1 text-[#E31837] text-sm" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        
        {/* Number of Travelers */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">
              Number of Travelers <span className="text-[#E31837]">*</span>
            </label>
            <button 
              type="button" 
              className="text-[#304CB2] text-sm flex items-center"
              onClick={() => toggleTooltip('travelers')}
              aria-label="Show information about travelers field"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {showTooltips.travelers && (
            <div className="text-xs bg-gray-100 p-2 rounded mb-2 text-gray-700">
              Specify the total number of travelers (including children). Maximum 8 travelers per booking.
            </div>
          )}
          
          <input 
            id="travelers"
            name="travelers" 
            type="number"
            min="1"
            max="8"
            value={form.travelers} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors ${
              errors.travelers ? 'border-[#E31837]' : 'border-gray-300'
            }`}
            placeholder="e.g. 2"
            aria-required="true"
            aria-invalid={errors.travelers ? "true" : "false"}
            aria-describedby={errors.travelers ? "travelersError" : undefined}
          />
          
          {errors.travelers && (
            <p id="travelersError" className="mt-1 text-[#E31837] text-sm" role="alert">
              {errors.travelers}
            </p>
          )}
        </div>
        
        {/* Start Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date <span className="text-[#E31837]">*</span>
              </label>
              <button 
                type="button" 
                className="text-[#304CB2] text-sm flex items-center"
                onClick={() => toggleTooltip('startDate')}
                aria-label="Show information about start date field"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            {showTooltips.startDate && (
              <div className="text-xs bg-gray-100 p-2 rounded mb-2 text-gray-700">
                Select the first day of your trip. Dates must be in the future.
              </div>
            )}
            
            <input 
              id="startDate"
              name="startDate" 
              type="date"
              value={form.startDate} 
              onChange={handleChange} 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors ${
                errors.startDate ? 'border-[#E31837]' : 'border-gray-300'
              }`}
              aria-required="true"
              aria-invalid={errors.startDate ? "true" : "false"}
              aria-describedby={errors.startDate ? "startDateError" : undefined}
            />
            
            {errors.startDate && (
              <p id="startDateError" className="mt-1 text-[#E31837] text-sm" role="alert">
                {errors.startDate}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time <span className="text-[#E31837]">*</span>
            </label>
            <select
              id="departureTime"
              name="departureTime"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors"
            >
              {TIME_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Return Date and Time - Shown only for round-trip */}
        {form.tripType === 'round-trip' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                  Return Date <span className="text-[#E31837]">*</span>
                </label>
                <button 
                  type="button" 
                  className="text-[#304CB2] text-sm flex items-center"
                  onClick={() => toggleTooltip('returnDate')}
                  aria-label="Show information about return date field"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              
              {showTooltips.returnDate && (
                <div className="text-xs bg-gray-100 p-2 rounded mb-2 text-gray-700">
                  Select the last day of your trip. Return date must be after your start date.
                </div>
              )}
              
              <input 
                id="returnDate"
                name="returnDate" 
                type="date"
                value={form.returnDate} 
                onChange={handleChange} 
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors ${
                  errors.returnDate ? 'border-[#E31837]' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={errors.returnDate ? "true" : "false"}
                aria-describedby={errors.returnDate ? "returnDateError" : undefined}
              />
              
              {errors.returnDate && (
                <p id="returnDateError" className="mt-1 text-[#E31837] text-sm" role="alert">
                  {errors.returnDate}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="returnTime" className="block text-sm font-medium text-gray-700 mb-1">
                Return Time <span className="text-[#E31837]">*</span>
              </label>
              <select
                id="returnTime"
                name="returnTime"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors"
              >
                {TIME_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Special Requests - Optional */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
              Special Requests
            </label>
            <button 
              type="button" 
              className="text-[#304CB2] text-sm flex items-center"
              onClick={() => toggleTooltip('specialRequests')}
              aria-label="Show information about special requests field"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {showTooltips.specialRequests && (
            <div className="text-xs bg-gray-100 p-2 rounded mb-2 text-gray-700">
              Let us know if you have any special requests or accommodations needed.
            </div>
          )}
          
          <textarea 
            id="specialRequests"
            name="specialRequests" 
            value={form.specialRequests} 
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#304CB2] focus:border-[#304CB2] focus:outline-none transition-colors resize-none"
            placeholder="Optional - Enter any special requests here"
          />
        </div>
        
        {/* Hotel Selection */}
        <div className="border-t pt-5 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Accommodations</h3>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="includeHotel" 
                className="h-4 w-4 text-[#304CB2] focus:ring-[#304CB2] border-gray-300 rounded"
                checked={includeHotel}
                onChange={() => setIncludeHotel(!includeHotel)}
              />
              <label htmlFor="includeHotel" className="ml-2 block text-sm font-medium text-gray-700">
                Include hotel with my booking
              </label>
            </div>
          </div>
          
          {includeHotel && hotels.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select a hotel from the available options:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotels.map(hotel => (
                  <div 
                    key={hotel.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedHotel === hotel.id 
                        ? 'border-[#304CB2] ring-2 ring-[#304CB2] bg-blue-50' 
                        : 'border-gray-200 hover:border-[#304CB2]'
                    }`}
                    onClick={() => setSelectedHotel(hotel.id)}
                  >
                    <div className="h-32 bg-gray-200 overflow-hidden">
                      <img 
                        src={hotel.imageUrl} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=Hotel+Image';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800">{hotel.name}</h4>
                      <p className="text-sm text-gray-600">{hotel.location}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[#304CB2] font-medium">${hotel.pricePerNight}/night</span>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                          <span className="text-sm text-gray-700">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          {hotel.amenities.slice(0, 3).join(' • ')}
                          {hotel.amenities.length > 3 && '...'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.hotel && (
                <p className="text-[#E31837] text-sm" role="alert">
                  {errors.hotel}
                </p>
              )}
            </div>
          )}
          
          {includeHotel && hotels.length === 0 && (
            <p className="text-sm text-gray-600">No hotels available for this destination.</p>
          )}
        </div>
        
        {/* Car Rental Selection */}
        <div className="border-t pt-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Transportation</h3>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="includeCar" 
                className="h-4 w-4 text-[#304CB2] focus:ring-[#304CB2] border-gray-300 rounded"
                checked={includeCar}
                onChange={() => setIncludeCar(!includeCar)}
              />
              <label htmlFor="includeCar" className="ml-2 block text-sm font-medium text-gray-700">
                Include car rental with my booking
              </label>
            </div>
          </div>
          
          {includeCar && carRentals.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select a vehicle from the available options:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carRentals.map(car => (
                  <div 
                    key={car.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedCar === car.id 
                        ? 'border-[#304CB2] ring-2 ring-[#304CB2] bg-blue-50' 
                        : 'border-gray-200 hover:border-[#304CB2]'
                    }`}
                    onClick={() => setSelectedCar(car.id)}
                  >
                    <div className="h-32 bg-gray-200 overflow-hidden">
                      <img 
                        src={car.imageUrl} 
                        alt={car.model} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=Car+Image';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-800">{car.model}</h4>
                      <p className="text-sm text-gray-600">{car.company}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[#304CB2] font-medium">${car.pricePerDay}/day</span>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded text-gray-700 capitalize">
                          {car.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {errors.car && (
                <p className="text-[#E31837] text-sm" role="alert">
                  {errors.car}
                </p>
              )}
            </div>
          )}
          
          {includeCar && carRentals.length === 0 && (
            <p className="text-sm text-gray-600">No car rentals available for this destination.</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="pt-3">
          <button 
            type="submit" 
            className="w-full bg-[#E31837] hover:bg-[#c41230] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : "Complete Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
