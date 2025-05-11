export type Trip = {
  id: string;
  destination: string;
  imageUrl: string;
  price: number;
  totalPrice?: number; // Total price for multiple travelers
  travelers?: number; // Number of travelers for this quote
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
  category?: string;
  duration?: number;
  maxTravelers?: number;
  restrictions?: string[];
  cancellationPolicy?: string;
  internalNotes?: string; // For employee use only
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
  role?: UserRole;
  securitySettings?: SecuritySettings;
  twoFactorAuth?: TwoFactorSetup;
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

export type Passenger = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  specialRequests?: string;
  frequentFlyerNumber?: string;
  seatPreference?: 'window' | 'middle' | 'aisle';
  mealPreference?: string;
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
  isBusinessBooking?: boolean;
  confirmationCode?: string;

  // Enhanced fields for internal employee use
  passengerDetails?: Passenger[];
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  employeeNotes?: string;
  employeeId?: string; // ID of employee who created/updated the booking
  multiDestination?: boolean;
  segments?: {
    from: string;
    to: string;
    departureDate: string;
    returnDate?: string;
    flightNumbers?: string[];
  }[];
  discountCode?: string;
  discountAmount?: number;
  baggageInfo?: {
    checkedBags: number;
    carryOnBags: number;
  };
  checkInStatus?: 'not-checked-in' | 'checked-in' | 'boarded';
};

// Admin dashboard types
export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  popularDestinations: Array<{ destination: string; count: number }>;
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

// Training Portal Types
export type TrainingCourse = {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  modules: TrainingModule[];
  requiredFor: string[]; // list of roles that require this training
  category: 'required' | 'optional' | 'certification';
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt?: string;
};

export type TrainingModule = {
  id: string;
  title: string;
  content: string;
  timeToComplete: number; // in minutes
  quizzes?: Quiz[];
  resourceLinks?: string[];
};

export type Quiz = {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

export type EmployeeTraining = {
  id: string;
  userId: string;
  courseId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100 percentage
  startedAt?: string;
  completedAt?: string;
  certificationExpiresAt?: string;
  quizResults?: {
    quizId: string;
    score: number;
    passed: boolean;
    attemptCount: number;
    lastAttemptAt: string;
  }[];
  notes?: string;
};

export type BookingPolicy = {
  id: string;
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  category: 'general' | 'refunds' | 'changes' | 'customer-service' | 'pricing';
  isActive: boolean;
  acknowledgmentRequired: boolean;
};

export type PolicyAcknowledgment = {
  id: string;
  userId: string;
  policyId: string;
  acknowledgedAt: string;
  version: string;
};

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'booking' | 'system' | 'policy' | 'promotion' | 'training';
  status: 'unread' | 'read';
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
  actions?: NotificationAction[];
  relatedId?: string; // ID of related item (booking, policy, etc.)
}

export interface NotificationAction {
  label: string;
  url: string;
}

export interface NotificationPreference {
  userId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  categories: {
    booking: boolean;
    system: boolean;
    policy: boolean;
    promotion: boolean;
    training: boolean;
  };
  emailFrequency: 'immediate' | 'daily' | 'weekly';
}

// Role-Based Access Control Types
export type UserRole = 'customer' | 'agent' | 'supervisor' | 'admin' | 'system';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  createdAt: string;
  updatedAt?: string;
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string; // User ID of the administrator who assigned the role
  expiresAt?: string; // Optional expiration date for temporary role assignments
}

// Audit Log Types
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  status: 'success' | 'failure';
  reason?: string; // Reason for failure, if applicable
}

// Two-Factor Authentication Types
export type TwoFactorMethod = 'email' | 'sms' | 'authenticator';

export interface TwoFactorSetup {
  userId: string;
  isEnabled: boolean;
  preferredMethod: TwoFactorMethod;
  phone?: string;
  backupCodes?: string[];
  lastUpdated: string;
}

// Security Settings Types
export interface SecuritySettings {
  userId: string;
  requireTwoFactorForSensitiveOperations: boolean;
  lastPasswordChange: string;
  passwordExpiresAt?: string;
  loginAttempts: number;
  lastLoginAttempt?: string;
  isLocked: boolean;
  lockedUntil?: string;
}
