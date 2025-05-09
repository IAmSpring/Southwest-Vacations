import { useQuery } from 'react-query';
import { TripDetail } from '../sharedTypes';

const fetchTripDetails = async (tripId: string): Promise<TripDetail> => {
  const response = await fetch(`/api/trips/${tripId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useTripDetails = (tripId: string) => {
  return useQuery<TripDetail, Error>(['tripDetails', tripId], () => fetchTripDetails(tripId), {
    enabled: !!tripId, // Only run the query if tripId is available
  });
};
