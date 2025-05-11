import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { bookTrip } from '../api/bookings';
import { BookingRequest, TripType } from '../sharedTypes';

const initialFormState: BookingRequest = {
  tripId: '',
  fullName: '',
  email: '',
  travelers: 1,
  startDate: '',
  returnDate: '',
  tripType: 'one-way',
  specialRequests: '',
  departureTime: '',
  returnTime: '',
  hotelId: undefined,
  carRentalId: undefined,
};

export const useBooking = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('trip') || '';
  const selectedDate = searchParams.get('date') || '';

  const [form, setForm] = useState<BookingRequest>({
    ...initialFormState,
    tripId,
    startDate: selectedDate,
  });

  // Update tripId and selectedDate when searchParams changes
  useEffect(() => {
    const formUpdates: Partial<BookingRequest> = {};

    if (tripId) {
      formUpdates.tripId = tripId;
    }

    if (selectedDate) {
      formUpdates.startDate = selectedDate;
      console.log('Setting selected date from URL:', selectedDate);
    }

    if (Object.keys(formUpdates).length > 0) {
      setForm(prevForm => ({
        ...prevForm,
        ...formUpdates,
      }));
    }
  }, [tripId, selectedDate]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(bookTrip, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries('bookings');
      // Navigate to confirmation with the booking ID
      // The API response might include id or bookingId depending on the endpoint
      const bookingId = data.id || data.bookingId || '';
      navigate(`/confirmation?booking=${bookingId}`);
    },
    onError: error => {
      console.error('Booking failed:', error);
      // Handle error display to user
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleTripTypeChange = (type: TripType) => {
    setForm(prevForm => ({
      ...prevForm,
      tripType: type,
      // Clear return date if switching to one-way
      returnDate: type === 'one-way' ? '' : prevForm.returnDate,
    }));
  };

  const submitBooking = async (e: React.FormEvent, enhancedForm?: any) => {
    e.preventDefault();

    // Use the enhanced form data if provided, otherwise use the local form state
    const formData = enhancedForm || form;
    console.log('Submitting booking with tripId:', formData.tripId);
    console.log('Selected date for booking:', formData.startDate);

    // Ensure we have a tripId before submitting
    if (!formData.tripId || formData.tripId.trim() === '') {
      alert('Please select a trip');
      return;
    }

    // If it's a round-trip, ensure returnDate exists and is after startDate
    if (
      formData.tripType === 'round-trip' &&
      (!formData.returnDate || new Date(formData.returnDate) <= new Date(formData.startDate))
    ) {
      alert('For round-trip bookings, please select a return date after the start date');
      return;
    }

    try {
      // Submit the form data with the mutation
      mutation.mutate(formData);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error submitting your booking. Please try again.');
    }
  };

  return {
    form,
    handleChange,
    handleTripTypeChange,
    submitBooking,
    isLoading: mutation.isLoading,
  };
};
