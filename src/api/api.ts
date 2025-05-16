import { isGitHubPages } from '../utils/urlUtils';

// Determine base URL - use environment variable or fallback
const getBaseUrl = () => {
  // Check if VITE_API_BASE_URL exists in the environment
  if (typeof import.meta.env.VITE_API_BASE_URL === 'string') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api';
};

const API_BASE_URL = getBaseUrl();

// Helper to generate full API URLs
export const apiUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// General purpose API fetching with authentication
export const fetchApi = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const url = apiUrl(path);
  const token = localStorage.getItem('token');

  // Set up headers with authentication if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Mock data functions for GitHub Pages
const getMockData = (path: string) => {
  // Mock data responses for GitHub Pages
  const mockData: Record<string, any> = {
    '/trips': [
      {
        id: 'trip1',
        destination: 'Maui, Hawaii',
        imageUrl: '/Southwest-Vacations/images/destinations/hawaii.jpg',
        price: 1499.99,
        description: "Relax on Maui's beautiful beaches and enjoy the stunning sunsets.",
        datesAvailable: ['2025-08-01', '2025-08-15', '2025-09-01', '2025-09-20'],
      },
      {
        id: 'trip2',
        destination: 'Cancun, Mexico',
        imageUrl: '/Southwest-Vacations/images/destinations/mexico.jpg',
        price: 1250.0,
        description: 'Enjoy crystal clear waters, white sandy beaches, and vibrant nightlife.',
        datesAvailable: ['2025-07-20', '2025-08-10', '2025-11-01', '2025-12-10'],
      },
      {
        id: 'trip3',
        destination: 'New York City, USA',
        imageUrl: '/Southwest-Vacations/images/destinations/nyc.jpg',
        price: 1300.0,
        description:
          'The city that never sleeps! Explore landmarks, museums, and diverse neighborhoods.',
        datesAvailable: ['2025-08-01', '2025-09-10', '2025-11-20', '2025-12-15'],
      },
      {
        id: 'trip4',
        destination: 'Rome, Italy',
        imageUrl: '/Southwest-Vacations/images/destinations/italy.jpg',
        price: 1850.0,
        description: 'Explore ancient ruins and savor authentic Italian cuisine.',
        datesAvailable: ['2025-09-05', '2025-09-25', '2025-10-15'],
      },
    ],
    '/notifications': [
      {
        id: 'notif1',
        title: 'New Deal Alert!',
        content: '30% off on select summer packages. Book before June 1st.',
        createdAt: new Date().toISOString(),
        type: 'promotion',
        status: 'unread',
        priority: 'high',
        actions: [{ label: 'View Deal', url: '/deals/summer' }],
      },
      {
        id: 'notif2',
        title: 'Booking Confirmed',
        content: 'Your trip to Maui has been confirmed. Check your email for details.',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        type: 'booking',
        status: 'read',
        priority: 'normal',
        actions: [{ label: 'View Booking', url: '/bookings/trip1' }],
      },
      {
        id: 'notif3',
        title: 'Travel Advisory',
        content: 'Check updated travel requirements for international destinations.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        type: 'policy',
        status: 'unread',
        priority: 'normal',
        actions: [{ label: 'Learn More', url: '/travel-advisory' }],
      },
    ],
    '/bookings': [
      {
        id: 'booking1',
        tripId: 'trip1',
        destination: 'Maui, Hawaii',
        startDate: '2025-08-15',
        endDate: '2025-08-22',
        price: 1499.99,
        status: 'confirmed',
        travelers: 2,
        imageUrl: '/Southwest-Vacations/images/destinations/hawaii.jpg',
      },
      {
        id: 'booking2',
        tripId: 'trip3',
        destination: 'New York City, USA',
        startDate: '2025-09-10',
        endDate: '2025-09-15',
        price: 1300.0,
        status: 'pending',
        travelers: 1,
        imageUrl: '/Southwest-Vacations/images/destinations/nyc.jpg',
      },
    ],
    // Add more mock data as needed
  };

  // Extract the endpoint from the path (remove query params)
  const endpoint = path.split('?')[0];

  return mockData[endpoint] || [];
};

// Public API functions
export const api = {
  // Get list of trips
  getTrips: async () => {
    if (isGitHubPages()) {
      return { data: getMockData('/trips') };
    }

    const response = await fetchApi('/trips');
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }
    return response.json();
  },

  // Get a specific trip
  getTrip: async (id: string) => {
    if (isGitHubPages()) {
      const trips = getMockData('/trips');
      const trip = trips.find((t: any) => t.id === id);
      return { data: trip || null };
    }

    const response = await fetchApi(`/trips/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trip details');
    }
    return response.json();
  },

  // Get user bookings
  getBookings: async () => {
    if (isGitHubPages()) {
      return { data: getMockData('/bookings') };
    }

    const response = await fetchApi('/bookings');
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  },

  // Get notifications
  getNotifications: async () => {
    if (isGitHubPages()) {
      return { data: getMockData('/notifications') };
    }

    const response = await fetchApi('/notifications');
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return response.json();
  },

  // Mark notification as read
  markNotificationAsRead: async (id: string) => {
    if (isGitHubPages()) {
      // For GitHub Pages, we simulate this by just returning success
      return { success: true };
    }

    const response = await fetchApi(`/notifications/${id}/read`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    return response.json();
  },

  // Book a trip
  bookTrip: async (bookingData: any) => {
    if (isGitHubPages()) {
      // Create a mock booking response
      const mockBooking = {
        id: `booking-${Date.now()}`,
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      return { data: mockBooking };
    }

    const response = await fetchApi('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error('Failed to book trip');
    }
    return response.json();
  },
};

export default api;
