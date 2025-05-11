import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useBookings, BookingFilterOptions } from '../hooks/useBookings';
import { Booking } from '../sharedTypes';

const BookingsManagementPage: React.FC = () => {
  // For debounced search input
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  // State for booking modification
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifySuccess, setModifySuccess] = useState<boolean | null>(null);
  const [modifyLoading, setModifyLoading] = useState(false);

  // Initialize booking hook with default filters
  const { bookings, isLoading, error, stats, updateFilters, updateStatus, refreshBookings } =
    useBookings();

  // Booking history visualization data
  const [historyData, setHistoryData] = useState<{
    dates: string[];
    counts: number[];
  }>({
    dates: [],
    counts: [],
  });

  // Load booking history visualization data
  useEffect(() => {
    if (bookings.length > 0) {
      // Get last 14 days for the chart
      const dates = [];
      const counts = [];
      const today = new Date();

      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dates.push(dateString);

        // Count bookings for this date
        const count = bookings.filter(
          booking => booking.createdAt.split('T')[0] === dateString
        ).length;

        counts.push(count);
      }

      setHistoryData({ dates, counts });
    }
  }, [bookings]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle search input with debounce
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      updateFilters({ searchTerm: value });
    }, 500);

    return () => clearTimeout(timer);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof BookingFilterOptions, value: any) => {
    updateFilters({ [key]: value });
  };

  // Handle booking status change
  const handleStatusChange = async (
    bookingId: string,
    newStatus: 'confirmed' | 'pending' | 'cancelled'
  ) => {
    const success = await updateStatus(bookingId, newStatus);

    if (!success) {
      alert('Failed to update booking status. Please try again.');
    }
  };

  // Open modify modal for a booking
  const openModifyModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowModifyModal(true);
    setModifySuccess(null);
  };

  // Close modify modal
  const closeModifyModal = () => {
    setShowModifyModal(false);
    setSelectedBooking(null);
    // Refresh bookings to get updated data
    if (modifySuccess) {
      refreshBookings();
    }
  };

  // Handle edit booking
  const handleEditBooking = (bookingId: string) => {
    navigate(`/bookings/${bookingId}/edit`);
  };

  // Handle modify booking submission
  const handleModifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setModifyLoading(true);
    try {
      // Make API call to update the booking
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBooking),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      setModifySuccess(true);
      // Slight delay to show success message
      setTimeout(() => {
        closeModifyModal();
      }, 1500);
    } catch (error) {
      console.error('Error updating booking:', error);
      setModifySuccess(false);
    } finally {
      setModifyLoading(false);
    }
  };

  // Handle field change in modify modal
  const handleModifyFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedBooking) return;

    const { name, value } = e.target;
    setSelectedBooking({
      ...selectedBooking,
      [name]: value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Booking Management | Southwest Vacations</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
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

            {/* Booking History Visualization */}
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Booking Activity (Last 14 Days)
              </h3>
              <div className="h-48 rounded-lg border border-gray-200 bg-white p-4">
                {historyData.counts.length > 0 ? (
                  <div className="flex h-full items-end space-x-2">
                    {historyData.dates.map((date, i) => (
                      <div key={date} className="flex flex-1 flex-col items-center">
                        <div
                          className="w-full rounded-t bg-blue-500"
                          style={{
                            height: `${(historyData.counts[i] / Math.max(...historyData.counts)) * 100}%`,
                            minHeight: historyData.counts[i] > 0 ? '10%' : '0',
                          }}
                        ></div>
                        <div className="mt-1 origin-top-left -rotate-45 transform text-xs text-gray-500">
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">No booking data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Filters */}
        <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-medium">Filter Bookings</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  data-testid="status-filter"
                  onChange={e => handleFilterChange('status', e.target.value || undefined)}
                >
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="Search by name, email, or ID"
                  value={searchInput}
                  onChange={handleSearchInput}
                  data-testid="search-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="w-full rounded border px-3 py-2 text-sm"
                    data-testid="date-from"
                    onChange={e => handleFilterChange('startDate', e.target.value || undefined)}
                  />
                  <input
                    type="date"
                    className="w-full rounded border px-3 py-2 text-sm"
                    data-testid="date-to"
                    onChange={e => handleFilterChange('endDate', e.target.value || undefined)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Sort By</label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  data-testid="sort-by"
                  onChange={e => handleFilterChange('sortBy', e.target.value)}
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
                  data-testid="sort-order"
                  onChange={e => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
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
                    Price
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
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <span className="ml-2 text-gray-500">Loading bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No bookings found. Use the filters above to search for bookings.
                    </td>
                  </tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {booking.confirmationCode || booking.id.slice(0, 8)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {booking.multiDestination ? (
                          <div className="flex items-center">
                            <span>Multiple Destinations</span>
                            <span className="ml-1 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                              {booking.segments?.length || 0} segments
                            </span>
                          </div>
                        ) : (
                          booking.destination || 'N/A'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div>{formatDate(booking.startDate)}</div>
                        {booking.returnDate && <div>to {formatDate(booking.returnDate)}</div>}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        ${booking.totalPrice.toLocaleString()}
                        <div className="text-xs text-gray-500">
                          {booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModifyModal(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label={`Modify booking ${booking.id}`}
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => handleEditBooking(booking.id)}
                            className="text-green-600 hover:text-green-900"
                            aria-label={`Edit booking ${booking.id}`}
                          >
                            Edit
                          </button>
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                              aria-label={`Cancel booking ${booking.id}`}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modify Booking Modal */}
        {showModifyModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-lg rounded-lg bg-white shadow-xl">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Modify Booking:{' '}
                    {selectedBooking.confirmationCode || selectedBooking.id.slice(0, 8)}
                  </h3>
                  <button onClick={closeModifyModal} className="text-gray-400 hover:text-gray-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleModifySubmit}>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
                  {modifySuccess === true && (
                    <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                      Booking updated successfully!
                    </div>
                  )}

                  {modifySuccess === false && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                      Failed to update booking. Please try again.
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={selectedBooking.fullName}
                          onChange={handleModifyFieldChange}
                          className="w-full rounded border px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={selectedBooking.email}
                          onChange={handleModifyFieldChange}
                          className="w-full rounded border px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={selectedBooking.startDate}
                          onChange={handleModifyFieldChange}
                          className="w-full rounded border px-3 py-2 text-sm"
                        />
                      </div>

                      {selectedBooking.tripType === 'round-trip' && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Return Date
                          </label>
                          <input
                            type="date"
                            name="returnDate"
                            value={selectedBooking.returnDate || ''}
                            onChange={handleModifyFieldChange}
                            className="w-full rounded border px-3 py-2 text-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Number of Travelers
                        </label>
                        <input
                          type="number"
                          name="travelers"
                          value={selectedBooking.travelers}
                          onChange={handleModifyFieldChange}
                          min="1"
                          className="w-full rounded border px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          name="status"
                          value={selectedBooking.status}
                          onChange={handleModifyFieldChange}
                          className="w-full rounded border px-3 py-2 text-sm"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={selectedBooking.specialRequests || ''}
                        onChange={e =>
                          setSelectedBooking({
                            ...selectedBooking,
                            specialRequests: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full rounded border px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Employee Notes
                      </label>
                      <textarea
                        name="employeeNotes"
                        value={selectedBooking.employeeNotes || ''}
                        onChange={e =>
                          setSelectedBooking({
                            ...selectedBooking,
                            employeeNotes: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full rounded border px-3 py-2 text-sm"
                        placeholder="Internal notes (not visible to customer)"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
                  <button
                    type="button"
                    onClick={closeModifyModal}
                    className="rounded border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={modifyLoading}
                  >
                    {modifyLoading ? (
                      <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsManagementPage;
