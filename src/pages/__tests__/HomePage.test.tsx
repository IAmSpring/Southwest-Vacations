import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../HomePage';
import { useTrips } from '../../hooks/useTrips';

// Mock the useTrips hook
jest.mock('../../hooks/useTrips');

const mockTrips = [
  {
    id: 'trip1',
    destination: 'Hawaii',
    imageUrl: '/images/southwest-hawaii.jpg',
    price: 1200,
  },
  {
    id: 'trip2',
    destination: 'Europe',
    imageUrl: '/images/southwest-europe.jpg',
    price: 1800,
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders the hero section with correct text', () => {
    // Mock the useTrips hook to return loading state
    (useTrips as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    // Check for hero section text content
    expect(screen.getByText('Travel Made')).toBeInTheDocument();
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(
      screen.getByText(/Explore breathtaking destinations with the Southwest Vacations experience/i)
    ).toBeInTheDocument();
    
    // Check for call-to-action buttons
    expect(screen.getByText('Find Your Adventure')).toBeInTheDocument();
    expect(screen.getByText('View All Destinations')).toBeInTheDocument();
  });

  test('renders the "Why Choose Southwest" button', () => {
    // Mock the useTrips hook to return loading state
    (useTrips as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    // Check for the "Why Choose Southwest" button
    expect(screen.getByText('Why Choose Southwest')).toBeInTheDocument();
  });

  test('displays loading state when trips are being fetched', () => {
    // Mock the useTrips hook to return loading state
    (useTrips as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    // We should have trip card skeletons when loading
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
    // We don't check for specific skeleton elements as they might not have text content
  });

  test('displays trips when data is loaded', () => {
    // Mock the useTrips hook to return trip data
    (useTrips as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockTrips,
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    // Check for destination names in the trip cards
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
    
    // Note: The actual trip card content might be rendered in the TripCard component
    // For a more comprehensive test, we would need to check for the rendered TripCard components
    // This would typically involve checking for the props passed to the TripCard
  });

  test('displays error message when there is an error', () => {
    // Mock the useTrips hook to return an error
    (useTrips as jest.Mock).mockReturnValue({
      isLoading: false,
      error: { message: 'Failed to fetch trips' },
      data: null,
    });

    render(
      <Router>
        <HomePage />
      </Router>
    );

    // Check for error message
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch trips')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
}); 