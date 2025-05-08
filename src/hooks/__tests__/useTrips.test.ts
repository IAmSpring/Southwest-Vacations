import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useTrips } from '../useTrips';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
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

// Setup MSW server to intercept API requests
const server = setupServer(
  rest.get('http://localhost:4000/trips', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTrips));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useTrips', () => {
  test('fetches trips successfully', async () => {
    const { result } = renderHook(() => useTrips(), { wrapper });

    // Initially should be in loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);

    // Wait for the data to be fetched
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, should have the data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockTrips);
  });

  test('handles error when fetching trips fails', async () => {
    // Override the handler to return an error
    server.use(
      rest.get('http://localhost:4000/trips', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useTrips(), { wrapper });

    // Initially should be in loading state
    expect(result.current.isLoading).toBe(true);

    // Wait for the error to be returned
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // After loading, should have an error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBe(null);
    expect(result.current.data).toBe(null);
  });
}); 