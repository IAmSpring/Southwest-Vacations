import { BookingRequest, Booking } from '../sharedTypes';

// Use the /api route prefix so Vite can proxy requests to the backend
const API_URL = '/api';

// Book a new trip
export const bookTrip = async (bookingData: BookingRequest): Promise<Booking> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to book trip');
    }

    return response.json();
  } catch (error) {
    console.error('Error booking trip:', error);
    throw error;
  }
};

// Get all bookings for the current user
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch bookings');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get a specific booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch booking details');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel booking');
    }

    return response.json();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Update a booking (modify dates, travelers, etc.)
export const updateBooking = async (bookingId: string, updates: Partial<BookingRequest>): Promise<Booking> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update booking');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}; 