import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { useTripDetails } from '../useTripDetails';
import { TripDetail } from '../../sharedTypes';

// Create a wrapper for the test
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

// Mock fetch
global.fetch = jest.fn();

describe('useTripDetails hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    // Mock successful API response
    const mockTrip: TripDetail = { 
      id: 'trip1',
      name: 'Test Trip',
      destination: 'Test Destination',
      description: 'Test Description',
      price: 1000,
      duration: 7,
      imageUrl: 'test.jpg'
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrip,
    });

    const { result } = renderHook(() => useTripDetails('trip1'), {
      wrapper: createWrapper(),
    });

    // Initially should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Wait for the hook to finish
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should have fetched the trip data
    expect(result.current.data).toEqual(mockTrip);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    // Mock API error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useTripDetails('nonexistent'), {
      wrapper: createWrapper(),
    });

    // Wait for the hook to finish
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Should show error state
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).not.toBeNull();
  });
}); 