import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingsManagementPage from '../BookingsManagementPage';
import { useBookings } from '../../hooks/useBookings';

// Mock the useBookings hook
jest.mock('../../hooks/useBookings');
const mockUseBookings = useBookings as jest.MockedFunction<typeof useBookings>;

// Mock booking data
const mockBookings = [
  {
    id: 'booking-1',
    tripId: 'trip-1',
    fullName: 'John Doe',
    email: 'john@example.com',
    travelers: 2,
    startDate: '2023-07-15',
    returnDate: '2023-07-22',
    tripType: 'round-trip' as const,
    totalPrice: 1250,
    status: 'confirmed' as const,
    confirmedAt: '2023-06-01T10:30:00Z',
    createdAt: '2023-06-01T10:00:00Z',
    confirmationCode: 'ABC123',
  },
  {
    id: 'booking-2',
    tripId: 'trip-2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    travelers: 1,
    startDate: '2023-08-10',
    returnDate: '2023-08-17',
    tripType: 'round-trip' as const,
    totalPrice: 850,
    status: 'pending' as const,
    confirmedAt: '',
    createdAt: '2023-06-02T14:20:00Z',
  },
];

// Mock booking stats
const mockStats = {
  total: 2,
  confirmed: 1,
  pending: 1,
  cancelled: 0,
  totalRevenue: 1250,
};

describe('BookingsManagementPage', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Default mock implementation
    mockUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      error: null,
      stats: mockStats,
      updateFilters: jest.fn(),
      updateStatus: jest.fn().mockResolvedValue(true),
    });
  });

  it('renders the page title', () => {
    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Booking Management Dashboard')).toBeInTheDocument();
  });

  it('displays booking statistics correctly', () => {
    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Total bookings
    expect(screen.getByText('1')).toBeInTheDocument(); // Confirmed bookings
    expect(screen.getByText('$1,250')).toBeInTheDocument(); // Total revenue
  });

  it('displays a loading indicator when fetching bookings', () => {
    mockUseBookings.mockReturnValue({
      bookings: [],
      isLoading: true,
      error: null,
      stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
      updateFilters: jest.fn(),
      updateStatus: jest.fn(),
    });

    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading bookings...')).toBeInTheDocument();
  });

  it('displays error message when booking fetch fails', () => {
    const errorMessage = 'An error occurred while fetching bookings. Please try again.';
    mockUseBookings.mockReturnValue({
      bookings: [],
      isLoading: false,
      error: errorMessage,
      stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
      updateFilters: jest.fn(),
      updateStatus: jest.fn(),
    });

    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('displays a message when no bookings are found', () => {
    mockUseBookings.mockReturnValue({
      bookings: [],
      isLoading: false,
      error: null,
      stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, totalRevenue: 0 },
      updateFilters: jest.fn(),
      updateStatus: jest.fn(),
    });

    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText('No bookings found. Use the filters above to search for bookings.')
    ).toBeInTheDocument();
  });

  it('displays booking information correctly', () => {
    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('$1,250')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('updates filters when search input changes', async () => {
    const mockUpdateFilters = jest.fn();
    mockUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      error: null,
      stats: mockStats,
      updateFilters: mockUpdateFilters,
      updateStatus: jest.fn(),
    });

    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Wait for debounce timeout
    await waitFor(
      () => {
        expect(mockUpdateFilters).toHaveBeenCalledWith({ searchTerm: 'John' });
      },
      { timeout: 1000 }
    );
  });

  it('calls updateStatus when changing booking status', () => {
    const mockUpdateStatus = jest.fn().mockResolvedValue(true);
    mockUseBookings.mockReturnValue({
      bookings: mockBookings,
      isLoading: false,
      error: null,
      stats: mockStats,
      updateFilters: jest.fn(),
      updateStatus: mockUpdateStatus,
    });

    render(
      <MemoryRouter>
        <BookingsManagementPage />
      </MemoryRouter>
    );

    // Open dropdown by clicking the "Change Status" button
    const statusDropdown = screen.getByTestId('status-dropdown-booking-1');
    fireEvent.click(statusDropdown);

    // Click on the "Cancel" button
    const cancelButton = screen.getByTestId('cancel-booking-booking-1');
    fireEvent.click(cancelButton);

    expect(mockUpdateStatus).toHaveBeenCalledWith('booking-1', 'cancelled');
  });
});
