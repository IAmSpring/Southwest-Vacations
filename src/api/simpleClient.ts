import { Booking } from '../sharedTypes';

// Use the simple backend URL
const API_URL = 'http://localhost:4000/api';

// Book a new trip
export const bookTrip = async (bookingData: any): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to book trip: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error booking trip:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch user profile: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get user bookings
export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch bookings: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return []; // Return empty array on error for graceful degradation
  }
};

// Simple login function
export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Login failed: ${response.status}`);
    }

    const data = await response.json();

    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Create a mock booking (for demonstration purposes)
export const createMockBooking = async (bookingData: any): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // For testing purposes, we'll just return a successful response
    // In a real app, you would make an actual API call

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a mock booking response
    const mockBooking = {
      id: `booking-${Math.floor(Math.random() * 10000)}`,
      ...bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      confirmationCode: `SW${Math.floor(Math.random() * 1000000)}`,
      totalPrice: 299.99,
      paymentStatus: 'paid',
    };

    return mockBooking;
  } catch (error) {
    console.error('Error creating mock booking:', error);
    throw error;
  }
};
