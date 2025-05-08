import { useQuery } from 'react-query';
import { Trip } from '../sharedTypes';

const fetchTrips = async (): Promise<Trip[]> => {
  const response = await fetch('/api/trips');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useTrips = () => {
  return useQuery<Trip[], Error>('trips', fetchTrips);
}; 