import { login, register, getCurrentUser, isAuthenticated } from './authHelpers';
import { getUserBookings, bookTrip } from '../api/bookings';

// Test credentials (for testing only)
const TEST_USERNAME = 'testuser';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'Password123';

// Trip IDs for testing
const TEST_TRIP_ID = 'trip1';

// Simple test runner
export const runTest = async (name: string, testFn: () => Promise<boolean>): Promise<boolean> => {
  console.log(`Running test: ${name}`);
  try {
    const result = await testFn();
    if (result) {
      console.log(`✅ ${name} passed`);
    } else {
      console.log(`❌ ${name} failed`);
    }
    return result;
  } catch (error) {
    console.error(`❌ ${name} failed with error:`, error);
    return false;
  }
};

// Test: Backend connectivity
export const testBackendConnectivity = async (): Promise<boolean> => {
  try {
    // Simple health check - we'll try to hit the backend health endpoint
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('Backend connectivity error:', error);
    return false;
  }
};

// Test: Registration and login flow
export const testAuthenticationFlow = async (): Promise<boolean> => {
  try {
    // First log out to ensure clean state
    localStorage.removeItem('token');

    // Try to register (might fail if user exists, but that's okay)
    try {
      await register(TEST_USERNAME, TEST_EMAIL, TEST_PASSWORD);
    } catch (error) {
      // Ignore registration errors, user might already exist
      console.log('Registration failed (might be expected if user exists)');
    }

    // Login with our test user
    const token = await login(TEST_EMAIL, TEST_PASSWORD);
    if (!token) return false;

    // Verify we're authenticated
    if (!isAuthenticated()) return false;

    // Try to get user profile
    const user = await getCurrentUser();
    if (!user || !user.id) return false;

    return true;
  } catch (error) {
    console.error('Authentication flow error:', error);
    return false;
  }
};

// Test: Booking flow
export const testBookingFlow = async (): Promise<boolean> => {
  try {
    // Ensure we're logged in
    if (!isAuthenticated()) {
      await login(TEST_EMAIL, TEST_PASSWORD);
    }

    // Make a test booking
    const bookingResult = await bookTrip({
      tripId: TEST_TRIP_ID,
      fullName: 'Test User',
      email: TEST_EMAIL,
      travelers: 1,
      startDate: '2025-06-01',
      tripType: 'one-way',
    });

    if (!bookingResult || !bookingResult.id) return false;

    // Check if we can retrieve bookings
    const userBookings = await getUserBookings();
    if (!userBookings || !Array.isArray(userBookings)) return false;

    return true;
  } catch (error) {
    console.error('Booking flow error:', error);
    return false;
  }
};

// Run all system tests
export const runAllTests = async (): Promise<{
  success: boolean;
  results: { [name: string]: boolean };
}> => {
  const results: { [name: string]: boolean } = {};

  // Backend connectivity test
  results.backendConnectivity = await runTest('Backend Connectivity', testBackendConnectivity);

  // Skip other tests if backend is not available
  if (!results.backendConnectivity) {
    return { success: false, results };
  }

  // Authentication flow test
  results.authentication = await runTest('Authentication Flow', testAuthenticationFlow);

  // Skip booking test if authentication failed
  if (!results.authentication) {
    return { success: false, results };
  }

  // Booking flow test
  results.booking = await runTest('Booking Flow', testBookingFlow);

  // Overall success if all tests passed
  const success = Object.values(results).every(result => result);

  return { success, results };
};
