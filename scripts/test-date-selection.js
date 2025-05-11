// Test script to verify date selection and booking flow
import fetch from 'node-fetch';

// Basic test flow
async function testDateSelectionFlow() {
  console.log('Starting date selection flow test...');

  try {
    // Step 1: Fetch trip details
    console.log('Fetching trip details...');
    const tripResponse = await fetch('http://localhost:4000/api/trips/trip1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!tripResponse.ok) {
      throw new Error(`Trip fetch failed: ${tripResponse.status} ${tripResponse.statusText}`);
    }

    const trip = await tripResponse.json();
    console.log('Trip details retrieved successfully!');
    console.log('Available dates:', trip.datesAvailable);

    // Step 2: Select a date (just take the second date if available)
    const selectedDate = trip.datesAvailable.length > 1 ? trip.datesAvailable[1] : trip.datesAvailable[0];
    console.log('Selected date:', selectedDate);

    // Step 3: Create a booking with the selected date
    console.log('Creating booking with selected date...');
    const bookingData = {
      tripId: trip.id,
      fullName: 'Test User',
      email: 'test@example.com',
      travelers: 2,
      startDate: selectedDate,
      returnDate: '',
      tripType: 'one-way',
      specialRequests: 'Test booking with selected date',
      departureTime: 'morning',
      returnTime: '',
    };

    const bookingResponse = await fetch('http://localhost:4000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    if (!bookingResponse.ok) {
      throw new Error(`Booking failed: ${bookingResponse.status} ${bookingResponse.statusText}`);
    }

    const bookingResult = await bookingResponse.json();
    console.log('Booking created successfully!');
    console.log('Booking ID:', bookingResult.id || bookingResult.bookingId);
    console.log('Date selection flow test completed successfully!');
    return true;
  } catch (error) {
    console.error('Test failed:', error.message);
    return false;
  }
}

// Run the test
testDateSelectionFlow().then(success => {
  console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}); 