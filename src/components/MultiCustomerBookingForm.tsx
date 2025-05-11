import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Passenger, TripType } from '../sharedTypes';

interface MultiCustomerBookingFormProps {
  tripId: string;
  tripName: string;
  defaultTravelers?: number;
  onSubmit: (bookingData: any) => void;
  isLoading?: boolean;
}

const MultiCustomerBookingForm: React.FC<MultiCustomerBookingFormProps> = ({
  tripId,
  tripName,
  defaultTravelers = 1,
  onSubmit,
  isLoading = false,
}) => {
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [bookingInfo, setBookingInfo] = useState({
    startDate: '',
    returnDate: '',
    tripType: 'round-trip' as TripType,
    specialRequests: '',
    discountCode: '',
    isBusinessBooking: false,
  });

  const emptyPassenger: Passenger = {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    specialRequests: '',
    frequentFlyerNumber: '',
    seatPreference: 'window' as 'window' | 'middle' | 'aisle',
    mealPreference: '',
  };

  const [passengers, setPassengers] = useState<Passenger[]>([]);

  // Initialize with default number of passengers
  useEffect(() => {
    if (defaultTravelers > 0) {
      const initialPassengers: Passenger[] = [];
      for (let i = 0; i < defaultTravelers; i++) {
        initialPassengers.push({ ...emptyPassenger, id: uuidv4() });
      }
      setPassengers(initialPassengers);
    }
  }, [defaultTravelers]);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setBookingInfo(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setBookingInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, { ...emptyPassenger, id: uuidv4() }]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      tripId,
      fullName: contactInfo.fullName,
      email: contactInfo.email,
      phone: contactInfo.phone,
      travelers: passengers.length,
      startDate: bookingInfo.startDate,
      returnDate: bookingInfo.returnDate,
      tripType: bookingInfo.tripType,
      specialRequests: bookingInfo.specialRequests,
      isBusinessBooking: bookingInfo.isBusinessBooking,
      discountCode: bookingInfo.discountCode,
      passengerDetails: passengers,
      employeeId: 'current-employee-id', // Should be retrieved from auth context
      multiDestination: false, // This form handles single destination bookings
    };

    onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="booking-form">
      <div className="rounded-lg bg-blue-50 p-4">
        <h2 className="mb-4 text-xl font-semibold">Booking for: {tripName}</h2>
        <p className="text-sm text-gray-600">Enter customer information to create a new booking.</p>
      </div>

      {/* Trip Type Selection */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-medium">Trip Type</h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="tripType"
              value="round-trip"
              checked={bookingInfo.tripType === 'round-trip'}
              onChange={handleBookingChange}
              className="mr-2"
              data-testid="round-trip-btn"
            />
            Round Trip
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={bookingInfo.tripType === 'one-way'}
              onChange={handleBookingChange}
              className="mr-2"
              data-testid="one-way-btn"
            />
            One Way
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Departure Date</label>
            <input
              type="date"
              name="startDate"
              value={bookingInfo.startDate}
              onChange={handleBookingChange}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          {bookingInfo.tripType === 'round-trip' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={bookingInfo.returnDate}
                onChange={handleBookingChange}
                className="w-full rounded border px-3 py-2"
                required={bookingInfo.tripType === 'round-trip'}
              />
            </div>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-medium">Customer Contact Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={contactInfo.fullName}
              onChange={handleContactChange}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleContactChange}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={contactInfo.phone}
              onChange={handleContactChange}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Passenger Details ({passengers.length})</h3>
          <button
            type="button"
            onClick={addPassenger}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Add Passenger
          </button>
        </div>

        {passengers.map((passenger, index) => (
          <div key={passenger.id} className="mb-6 rounded border bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium">Passenger {index + 1}</h4>
              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassenger(index)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={passenger.fullName}
                  onChange={e => handlePassengerChange(index, 'fullName', e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={passenger.dateOfBirth || ''}
                  onChange={e => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Seat Preference
                </label>
                <select
                  value={passenger.seatPreference || 'window'}
                  onChange={e => handlePassengerChange(index, 'seatPreference', e.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="window">Window</option>
                  <option value="middle">Middle</option>
                  <option value="aisle">Aisle</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Frequent Flyer Number (Optional)
                </label>
                <input
                  type="text"
                  value={passenger.frequentFlyerNumber || ''}
                  onChange={e =>
                    handlePassengerChange(index, 'frequentFlyerNumber', e.target.value)
                  }
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Special Requests (Optional)
                </label>
                <input
                  type="text"
                  value={passenger.specialRequests || ''}
                  onChange={e => handlePassengerChange(index, 'specialRequests', e.target.value)}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g., Wheelchair assistance, dietary restrictions"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Options */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-medium">Additional Options</h3>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isBusinessBooking"
              checked={bookingInfo.isBusinessBooking}
              onChange={handleBookingChange}
              className="mr-2"
            />
            Business Booking
          </label>
          <p className="ml-6 text-sm text-gray-500">
            Mark as a business booking for corporate customers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Discount Code (Optional)
            </label>
            <input
              type="text"
              name="discountCode"
              value={bookingInfo.discountCode}
              onChange={handleBookingChange}
              className="w-full rounded border px-3 py-2"
              placeholder="Enter discount code"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Special Requests (Optional)
            </label>
            <textarea
              name="specialRequests"
              value={bookingInfo.specialRequests}
              onChange={handleBookingChange}
              className="w-full rounded border px-3 py-2"
              placeholder="Any special requests for the entire booking"
              rows={3}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Complete Booking'}
        </button>
      </div>
    </form>
  );
};

export default MultiCustomerBookingForm;
