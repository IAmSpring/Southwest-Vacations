import { useQuery } from 'react-query';
import { Trip } from '../sharedTypes';
import { mockTrips } from './useTripDetails';

const fetchTrips = async (): Promise<Trip[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock trips
  return mockTrips;
};

export const useTrips = () => {
  return useQuery<Trip[], Error>('trips', fetchTrips, {
    initialData: undefined,
  });
};
