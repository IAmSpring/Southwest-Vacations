import { useState, useEffect } from 'react';
import { Booking } from '../sharedTypes';

// Filtering and sorting options for the booking list
export interface BookingFilterOptions {
  status?: Booking['status'];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: 'createdAt' | 'startDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
}

interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  totalRevenue: number;
}

interface UseBookingsResult {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  stats: BookingStats;
  updateFilters: (filters: Partial<BookingFilterOptions>) => void;
  updateStatus: (bookingId: string, newStatus: Booking['status']) => Promise<boolean>;
}

export const useBookings = (initialFilters?: BookingFilterOptions): UseBookingsResult => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilterOptions>(
    initialFilters || {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
  );
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  // Update filters
  const updateFilters = (newFilters: Partial<BookingFilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Fetch bookings based on filters
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query params from filters
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.searchTerm) params.append('search', filters.searchTerm);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await fetch(`/api/bookings?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        const bookingsData = data.bookings || data;
        setBookings(bookingsData);

        // Calculate booking statistics
        calculateStats(bookingsData);
      } catch (err) {
        setError('An error occurred while fetching bookings. Please try again.');
        console.error('Booking fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [filters]);

  // Calculate booking statistics for the dashboard
  const calculateStats = (bookingData: Booking[]) => {
    const confirmed = bookingData.filter(b => b.status === 'confirmed').length;
    const pending = bookingData.filter(b => b.status === 'pending').length;
    const cancelled = bookingData.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookingData
      .filter(b => b.status === 'confirmed')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);

    setStats({
      total: bookingData.length,
      confirmed,
      pending,
      cancelled,
      totalRevenue,
    });
  };

  // Update booking status
  const updateStatus = async (
    bookingId: string,
    newStatus: Booking['status']
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Update local state to reflect the change
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Recalculate stats based on the updated booking
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      );
      calculateStats(updatedBookings);

      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
      return false;
    }
  };

  return {
    bookings,
    isLoading,
    error,
    stats,
    updateFilters,
    updateStatus,
  };
};
