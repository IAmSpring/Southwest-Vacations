import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Booking } from '../sharedTypes';

// Filtering and sorting options for the booking list
interface BookingFilterOptions {
  status?: Booking['status'];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sortBy?: 'createdAt' | 'startDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
}

const BookingManagementDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilterOptions>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

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
        setBookings(data.bookings || data);

        // Calculate summary statistics
        if (data.bookings) {
          calculateStats(data.bookings);
        } else {
          calculateStats(data);
        }
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

  // Handle filter changes
  const handleFilterChange = (key: keyof BookingFilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    // Debounce search input to prevent too many API calls
    const timer = setTimeout(() => {
      handleFilterChange('searchTerm', searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Change booking status
  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
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

      // Recalculate stats
      calculateStats(
        bookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Failed to update booking status. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="booking-management-dashboard">
      {/* Dashboard Header */}
      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">Booking Management Dashboard</h1>
          <p className="mt-1 text-blue-100">Manage and track all customer bookings</p>
        </div>

        {/* Statistics Overview */}
        <div className="bg-white p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="text-sm font-medium text-blue-700">Total Bookings</h3>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>

            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="text-sm font-medium text-green-700">Confirmed</h3>
              <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4">
              <h3 className="text-sm font-medium text-yellow-700">Pending</h3>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-700">Cancelled</h3>
              <p className="text-2xl font-bold text-red-900">{stats.cancelled}</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Status Filter</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.status || ''}
                onChange={e => handleFilterChange('status', e.target.value || undefined)}
                data-testid="status-filter"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={filters.startDate || ''}
                  onChange={e => handleFilterChange('startDate', e.target.value || undefined)}
                  placeholder="Start Date"
                  data-testid="start-date-filter"
                />
                <input
                  type="date"
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={filters.endDate || ''}
                  onChange={e => handleFilterChange('endDate', e.target.value || undefined)}
                  placeholder="End Date"
                  data-testid="end-date-filter"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search Bookings
              </label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2 text-sm"
                placeholder="Search by Name, Email, or Booking ID"
                onChange={handleSearch}
                data-testid="search-input"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort By</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.sortBy}
                onChange={e => handleFilterChange('sortBy', e.target.value)}
                data-testid="sort-by-select"
              >
                <option value="createdAt">Booking Date</option>
                <option value="startDate">Travel Date</option>
                <option value="totalPrice">Price</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.sortOrder}
                onChange={e => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                data-testid="sort-order-select"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-medium">Booking List</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <span className="ml-3">Loading bookings...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No bookings found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Travel Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.confirmationCode || booking.id.slice(0, 8)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div>{booking.fullName}</div>
                      <div className="text-xs">{booking.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {booking.tripId}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div>{formatDate(booking.startDate)}</div>
                      {booking.returnDate && (
                        <div className="text-xs">to {formatDate(booking.returnDate)}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      ${booking.totalPrice.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                        ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link
                          to={`/bookings/${booking.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          data-testid={`edit-booking-${booking.id}`}
                        >
                          Edit
                        </Link>
                        <div className="group relative inline-block text-left">
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            data-testid={`status-dropdown-${booking.id}`}
                          >
                            Change Status
                          </button>
                          <div className="absolute right-0 z-10 mt-2 hidden w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none group-hover:block">
                            <div className="py-1">
                              <button
                                className="block w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                disabled={booking.status === 'confirmed'}
                                data-testid={`confirm-booking-${booking.id}`}
                              >
                                Confirm
                              </button>
                              <button
                                className="block w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(booking.id, 'pending')}
                                disabled={booking.status === 'pending'}
                                data-testid={`pend-booking-${booking.id}`}
                              >
                                Mark as Pending
                              </button>
                              <button
                                className="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-gray-100"
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                disabled={booking.status === 'cancelled'}
                                data-testid={`cancel-booking-${booking.id}`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagementDashboard;
