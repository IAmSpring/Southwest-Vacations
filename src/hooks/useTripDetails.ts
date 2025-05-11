import { useQuery } from 'react-query';
import { TripDetail } from '../sharedTypes';

// Mock trip data
export const mockTrips: TripDetail[] = [
  {
    id: 'trip1',
    destination: 'Orlando, Florida',
    description:
      'Experience the magic of Disney World and other theme parks in Orlando, Florida. Perfect for families and thrill-seekers alike.',
    price: 899,
    imageUrl:
      'https://images.unsplash.com/photo-1575089776834-8be34696ffb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'family',
    duration: 7,
    datesAvailable: [
      '2023-06-15',
      '2023-06-22',
      '2023-07-01',
      '2023-07-15',
      '2023-08-01',
      '2023-08-15',
    ],
  },
  {
    id: 'trip2',
    destination: 'Cancun, Mexico',
    description:
      'Relax on the beautiful beaches of Cancun with crystal clear waters and white sand. Enjoy all-inclusive resorts and amazing nightlife.',
    price: 1099,
    imageUrl:
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'beach',
    duration: 5,
    datesAvailable: [
      '2023-06-10',
      '2023-06-17',
      '2023-07-01',
      '2023-07-15',
      '2023-08-01',
      '2023-08-15',
    ],
  },
  {
    id: 'trip3',
    destination: 'Las Vegas, Nevada',
    description:
      'Experience the excitement of Las Vegas with world-class entertainment, dining, and casinos. A perfect adult getaway.',
    price: 799,
    imageUrl:
      'https://images.unsplash.com/photo-1581351721010-8cf859cb14a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'entertainment',
    duration: 4,
    datesAvailable: [
      '2023-06-05',
      '2023-06-12',
      '2023-07-10',
      '2023-07-24',
      '2023-08-07',
      '2023-08-21',
    ],
  },
  {
    id: 'trip4',
    destination: 'Aspen, Colorado',
    description:
      "Hit the slopes in one of America's premier ski destinations. Enjoy luxury lodges, pristine powder, and breathtaking mountain scenery.",
    price: 1299,
    imageUrl:
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80',
    category: 'mountain',
    duration: 6,
    datesAvailable: [
      '2023-12-10',
      '2023-12-17',
      '2024-01-07',
      '2024-01-21',
      '2024-02-04',
      '2024-02-18',
    ],
  },
  {
    id: 'trip5',
    destination: 'Miami, Florida',
    description:
      'Experience the vibrant culture, beautiful beaches, and exciting nightlife of Miami. Perfect for those looking to soak up the sun and enjoy the city.',
    price: 949,
    imageUrl:
      'https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'beach',
    duration: 5,
    datesAvailable: [
      '2023-07-08',
      '2023-07-22',
      '2023-08-05',
      '2023-08-19',
      '2023-09-09',
      '2023-09-23',
    ],
  },
  {
    id: 'trip6',
    destination: 'New York City, New York',
    description:
      'Explore the Big Apple with its iconic landmarks, world-class museums, Broadway shows, and diverse neighborhoods.',
    price: 1099,
    imageUrl:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'city',
    duration: 4,
    datesAvailable: [
      '2023-06-18',
      '2023-07-09',
      '2023-08-13',
      '2023-09-17',
      '2023-10-15',
      '2023-11-12',
    ],
  },
  {
    id: 'trip7',
    destination: 'San Francisco, California',
    description:
      'Discover the charm of San Francisco with its iconic Golden Gate Bridge, cable cars, Victorian houses, and world-famous cuisine.',
    price: 1049,
    imageUrl:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'city',
    duration: 5,
    datesAvailable: ['2023-06-25', '2023-07-16', '2023-08-20', '2023-09-10', '2023-10-08'],
  },
  {
    id: 'trip8',
    destination: 'Bahamas Cruise',
    description:
      'Sail through crystal-clear waters on a luxurious cruise to the Bahamas. Enjoy on-board entertainment, island excursions, and all-inclusive dining.',
    price: 1299,
    imageUrl:
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80',
    category: 'cruise',
    duration: 7,
    datesAvailable: ['2023-07-02', '2023-07-30', '2023-08-27', '2023-09-24', '2023-10-22'],
  },
  {
    id: 'trip9',
    destination: 'Yellowstone National Park',
    description:
      "Explore the natural wonders of America's first national park, home to geysers, wildlife, and stunning landscapes.",
    price: 899,
    imageUrl:
      'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'family',
    duration: 6,
    datesAvailable: ['2023-06-11', '2023-07-09', '2023-08-06', '2023-09-03'],
  },
  {
    id: 'trip10',
    destination: 'Caribbean Cruise',
    description:
      'Embark on a tropical adventure through the Caribbean islands with stops at beautiful beaches, ancient ruins, and colorful markets.',
    price: 1399,
    imageUrl:
      'https://images.unsplash.com/photo-1504434026032-a7e440a30b68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    category: 'cruise',
    duration: 9,
    datesAvailable: ['2023-08-12', '2023-09-09', '2023-10-14', '2023-11-11', '2023-12-09'],
  },
];

const fetchTripDetails = async (tripId: string): Promise<TripDetail> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the trip by ID in our mock data
  const trip = mockTrips.find(trip => trip.id === tripId);

  if (!trip) {
    throw new Error('Trip not found');
  }

  return trip;
};

export const useTripDetails = (tripId: string) => {
  return useQuery<TripDetail, Error>(['tripDetails', tripId], () => fetchTripDetails(tripId), {
    enabled: !!tripId, // Only run the query if tripId is available
  });
};
