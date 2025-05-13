import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

const router = express.Router();

// Get all trips with advanced filtering for internal employees
router.get('/', async (req, res) => {
  try {
    await db.read();
    
    // Extended query params for employee filtering
    const { 
      category, 
      minPrice, 
      maxPrice, 
      destination, 
      sortBy = 'price', 
      sortOrder = 'asc', 
      limit = 100, 
      availability 
    } = req.query;

    let trips = [...db.data.trips];

    // Apply filters
    if (category && category !== 'all') {
      trips = trips.filter(trip => trip.category === category);
    }

    if (destination) {
      const searchTerm = String(destination).toLowerCase();
      trips = trips.filter(trip => 
        trip.destination.toLowerCase().includes(searchTerm)
      );
    }

    if (minPrice) {
      trips = trips.filter(trip => trip.price >= Number(minPrice));
    }

    if (maxPrice) {
      trips = trips.filter(trip => trip.price <= Number(maxPrice));
    }

    if (availability) {
      const dateStr = String(availability);
      trips = trips.filter(trip => 
        trip.datesAvailable && trip.datesAvailable.includes(dateStr)
      );
    }

    // Apply sorting
    trips.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'destination':
          comparison = a.destination.localeCompare(b.destination);
          break;
        case 'duration':
          comparison = (a.duration || 0) - (b.duration || 0);
          break;
        default:
          comparison = a.price - b.price;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply limit
    if (limit) {
      trips = trips.slice(0, Number(limit));
    }

    // For employee interface, include the trip description
    // but omit detailed date availability to keep response size reasonable
    const tripsForDisplay = trips.map(({ datesAvailable, ...rest }) => ({
      ...rest,
      hasAvailability: datesAvailable?.length > 0
    }));

    res.json(tripsForDisplay);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search trips - Enhanced for employee use
router.get('/search', async (req, res) => {
  try {
    await db.read();
    
    const { 
      destination, 
      minPrice, 
      maxPrice, 
      category, 
      startDate, 
      endDate, 
      travelers = 1, 
      includeHotels = true, 
      includeCarRentals = true 
    } = req.query;

    let filteredTrips = [...db.data.trips];

    // Basic filters
    if (destination) {
      const searchTerm = String(destination).toLowerCase();
      filteredTrips = filteredTrips.filter(trip => 
        trip.destination.toLowerCase().includes(searchTerm)
      );
    }

    if (minPrice) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.price <= Number(maxPrice)
      );
    }

    if (category && category !== 'all') {
      filteredTrips = filteredTrips.filter(trip => 
        trip.category === category
      );
    }

    // Advanced filters for employee booking tool
    if (startDate) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.datesAvailable && trip.datesAvailable.some(date => date >= String(startDate))
      );
    }

    if (endDate) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.datesAvailable && trip.datesAvailable.some(date => date <= String(endDate))
      );
    }

    // Format results for employee interface
    const tripsForDisplay = filteredTrips.map(trip => {
      // Calculate total price for number of travelers
      const totalPrice = trip.price * Number(travelers);

      // Filter included data based on query params
      const tripData = {
        ...trip,
        totalPrice,
        pricePerPerson: trip.price,
        travelers: Number(travelers)
      };

      // Conditionally include hotel/car data to reduce payload size if not needed
      if (!includeHotels) delete tripData.hotels;
      if (!includeCarRentals) delete tripData.carRentals;

      return tripData;
    });

    res.json(tripsForDisplay);
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single trip details - Enhanced for employee booking tool
router.get('/:tripId', async (req, res) => {
  try {
    await db.read();
    
    const { includeBookingStats, date } = req.query;
    
    const trip = db.data.trips.find(trip => trip.id === req.params.tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // For employee tool, add enhanced data if requested
    if (includeBookingStats === 'true') {
      // Get all bookings for this trip
      const bookings = db.data.bookings.filter(booking => booking.tripId === trip.id);

      // Add booking statistics useful for employees
      const tripWithStats = {
        ...trip,
        stats: {
          totalBookings: bookings.length,
          confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
          totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
          averageGroupSize: bookings.length > 0
            ? bookings.reduce((sum, booking) => sum + booking.travelers, 0) / bookings.length
            : 0
        },
        // Filter availability to requested date if specified
        datesAvailable: date
          ? trip.datesAvailable.filter(d => d >= String(date))
          : trip.datesAvailable
      };
      
      return res.json(tripWithStats);
    }

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Create a new trip (for employee use)
router.post('/', async (req, res) => {
  try {
    await db.read();
    
    const tripData = req.body;

    // Validate required fields
    if (!tripData.destination || !tripData.price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new trip with generated ID
    const newTrip = {
      id: uuidv4(),
      ...tripData,
      datesAvailable: tripData.datesAvailable || []
    };

    // Add to database
    db.data.trips.push(newTrip);
    await db.write();

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Update a trip (for employee use)
router.put('/:tripId', async (req, res) => {
  try {
    await db.read();
    
    const { tripId } = req.params;
    const updateData = req.body;
    
    // Find trip index
    const tripIndex = db.data.trips.findIndex(trip => trip.id === tripId);
    
    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Update trip data (preserving id)
    const updatedTrip = {
      ...db.data.trips[tripIndex],
      ...updateData,
      id: tripId // Ensure id doesn't change
    };
    
    // Save back to database
    db.data.trips[tripIndex] = updatedTrip;
    await db.write();
    
    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Delete a trip (for employee use) 
router.delete('/:tripId', async (req, res) => {
  try {
    await db.read();
    
    const { tripId } = req.params;
    
    // Check if trip exists
    const tripExists = db.data.trips.some(trip => trip.id === tripId);
    
    if (!tripExists) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    // Remove trip
    db.data.trips = db.data.trips.filter(trip => trip.id !== tripId);
    await db.write();
    
    // Also delete any associated bookings
    const bookingsToDelete = db.data.bookings.filter(booking => booking.tripId === tripId);
    
    if (bookingsToDelete.length > 0) {
      db.data.bookings = db.data.bookings.filter(booking => booking.tripId !== tripId);
      await db.write();
    }
    
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 