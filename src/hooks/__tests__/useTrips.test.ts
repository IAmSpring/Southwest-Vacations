import { renderHook, waitFor } from '@testing-library/react';
import { useTrips } from '../../hooks/useTrips';
import { wrapper } from '../../utils/testUtils';

// Mock data
const mockTrips = [
  {
    id: 'trip1',
    destination: 'Hawaii',
    imageUrl: '/images/southwest-hawaii.jpg',
    price: 1200,
    description: 'Beautiful beaches and stunning landscapes',
    datesAvailable: ['2025-06-01', '2025-07-01', '2025-08-01'],
  },
  {
    id: 'trip2',
    destination: 'Europe',
    imageUrl: '/images/southwest-europe.jpg',
    price: 1800,
    description: 'Historical cities and cultural experiences',
    datesAvailable: ['2025-06-15', '2025-07-15', '2025-08-15'],
  },
];

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useTrips', () => {
  test('fetches trips successfully', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrips,
    });

    const { result } = renderHook(() => useTrips(), { wrapper });

    // Initially should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(undefined);

    // Wait for the data to be fetched
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, should have the data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockTrips);

    // Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('/trips');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('handles error when fetching trips fails', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server error',
    });

    const { result } = renderHook(() => useTrips(), { wrapper });

    // Initially should be in loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the error to be returned
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, should have an error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBe(null);
    expect(result.current.data).toBe(undefined);

    // Verify fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith('/trips');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
