export type Trip = {
  id: string;
  destination: string;
  imageUrl: string;
  price: number;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  imageUrl: string;
};

export type CarRental = {
  id: string;
  company: string;
  model: string;
  type: 'economy' | 'midsize' | 'suv' | 'luxury';
  pricePerDay: number;
  imageUrl: string;
};

export type TripDetail = Trip & {
  description: string;
  datesAvailable: string[];
  hotels?: Hotel[];
  carRentals?: CarRental[];
};

export type TripType = 'one-way' | 'round-trip';

export type BookingRequest = {
  tripId: string;
  fullName: string;
  email: string;
  travelers: number;
  startDate: string;
  returnDate?: string;
  tripType: TripType;
  specialRequests?: string;
  departureTime?: string;
  returnTime?: string;
  hotelId?: string;
  carRentalId?: string;
};

export type BookingConfirmation = {
  bookingId: string;
  tripId: string;
  confirmedAt: string;
  totalPrice: number;
};

// New types for enhanced backend functionality
export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
};

export type Favorite = {
  id: string;
  userId: string;
  tripId: string;
  createdAt: string;
};

export type Booking = {
  id: string;
  userId: string;
  tripId: string;
  fullName: string;
  email: string;
  travelers: number;
  startDate: string;
  returnDate?: string;
  tripType: TripType;
  specialRequests?: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmedAt: string;
  createdAt: string;
  updatedAt?: string;
  departureTime?: string;
  returnTime?: string;
  hotelId?: string;
  carRentalId?: string;
};
