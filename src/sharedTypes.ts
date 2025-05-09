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

// User activity action types
export type UserActionType = 
  | 'login' 
  | 'logout' 
  | 'search' 
  | 'view_trip' 
  | 'add_favorite' 
  | 'remove_favorite' 
  | 'start_booking' 
  | 'complete_booking' 
  | 'cancel_booking';

// User activity data for tracking user behavior
export type UserActivity = {
  id: string;
  userId: string;
  actionType: UserActionType;
  details?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
};

// New types for enhanced backend functionality
export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
  isAdmin?: boolean;
  preferences?: UserPreferences;
  status?: 'active' | 'inactive' | 'suspended';
};

export type UserPreferences = {
  currency?: string;
  notifications?: boolean;
  searchHistory?: boolean;
  theme?: 'light' | 'dark' | 'system';
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

// Admin dashboard types
export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  popularDestinations: Array<{destination: string; count: number}>;
  conversionRate: number;
  bookingsByStatus: Record<Booking['status'], number>;
};

export type UserAnalytics = {
  userId: string;
  username: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastActivity: string;
  registrationDate: string;
  activitySummary: Record<UserActionType, number>;
};
