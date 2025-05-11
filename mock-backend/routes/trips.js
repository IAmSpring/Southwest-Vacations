"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var db_js_1 = __importDefault(require("../db.js"));
var router = express_1.default.Router();
// Get all trips with advanced filtering for internal employees
router.get('/', function (req, res) {
    try {
        // Extended query params for employee filtering
        var _a = req.query, category_1 = _a.category, minPrice_1 = _a.minPrice, maxPrice_1 = _a.maxPrice, destination = _a.destination, _b = _a.sortBy, sortBy_1 = _b === void 0 ? 'price' : _b, _c = _a.sortOrder, sortOrder_1 = _c === void 0 ? 'asc' : _c, _d = _a.limit, limit = _d === void 0 ? 100 : _d, availability = _a.availability;
        var trips = db_js_1.default.get('trips').value();
        // Apply filters
        if (category_1 && category_1 !== 'all') {
            trips = trips.filter(function (trip) { return trip.category === category_1; });
        }
        if (destination) {
            var searchTerm_1 = String(destination).toLowerCase();
            trips = trips.filter(function (trip) {
                return trip.destination.toLowerCase().includes(searchTerm_1);
            });
        }
        if (minPrice_1) {
            trips = trips.filter(function (trip) { return trip.price >= Number(minPrice_1); });
        }
        if (maxPrice_1) {
            trips = trips.filter(function (trip) { return trip.price <= Number(maxPrice_1); });
        }
        if (availability) {
            var dateStr_1 = String(availability);
            trips = trips.filter(function (trip) {
                return trip.datesAvailable && trip.datesAvailable.includes(dateStr_1);
            });
        }
        // Apply sorting
        trips.sort(function (a, b) {
            var comparison = 0;
            switch (sortBy_1) {
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
            return sortOrder_1 === 'desc' ? -comparison : comparison;
        });
        // Apply limit
        if (limit) {
            trips = trips.slice(0, Number(limit));
        }
        // For employee interface, include the trip description
        // but omit detailed date availability to keep response size reasonable
        var tripsForDisplay = trips.map(function (_a) {
            var datesAvailable = _a.datesAvailable, rest = __rest(_a, ["datesAvailable"]);
            return (__assign(__assign({}, rest), { hasAvailability: (datesAvailable === null || datesAvailable === void 0 ? void 0 : datesAvailable.length) > 0 }));
        });
        res.json(tripsForDisplay);
    }
    catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Search trips - Enhanced for employee use
router.get('/search', function (req, res) {
    try {
        var _a = req.query, destination = _a.destination, minPrice_2 = _a.minPrice, maxPrice_2 = _a.maxPrice, category_2 = _a.category, startDate_1 = _a.startDate, endDate_1 = _a.endDate, _b = _a.travelers, travelers_1 = _b === void 0 ? 1 : _b, _c = _a.includeHotels, includeHotels_1 = _c === void 0 ? true : _c, _d = _a.includeCarRentals, includeCarRentals_1 = _d === void 0 ? true : _d;
        var filteredTrips = db_js_1.default.get('trips').value();
        // Basic filters
        if (destination) {
            var searchTerm_2 = String(destination).toLowerCase();
            filteredTrips = filteredTrips.filter(function (trip) {
                return trip.destination.toLowerCase().includes(searchTerm_2);
            });
        }
        if (minPrice_2) {
            filteredTrips = filteredTrips.filter(function (trip) {
                return trip.price >= Number(minPrice_2);
            });
        }
        if (maxPrice_2) {
            filteredTrips = filteredTrips.filter(function (trip) {
                return trip.price <= Number(maxPrice_2);
            });
        }
        if (category_2 && category_2 !== 'all') {
            filteredTrips = filteredTrips.filter(function (trip) {
                return trip.category === category_2;
            });
        }
        // Advanced filters for employee booking tool
        if (startDate_1) {
            filteredTrips = filteredTrips.filter(function (trip) {
                return trip.datesAvailable && trip.datesAvailable.some(function (date) { return date >= String(startDate_1); });
            });
        }
        if (endDate_1) {
            filteredTrips = filteredTrips.filter(function (trip) {
                return trip.datesAvailable && trip.datesAvailable.some(function (date) { return date <= String(endDate_1); });
            });
        }
        // Format results for employee interface
        var tripsForDisplay = filteredTrips.map(function (trip) {
            // Calculate total price for number of travelers
            var totalPrice = trip.price * Number(travelers_1);
            // Filter included data based on query params
            var tripData = __assign(__assign({}, trip), { totalPrice: totalPrice, pricePerPerson: trip.price, travelers: Number(travelers_1) });
            // Conditionally include hotel/car data to reduce payload size if not needed
            if (!includeHotels_1)
                delete tripData.hotels;
            if (!includeCarRentals_1)
                delete tripData.carRentals;
            return tripData;
        });
        res.json(tripsForDisplay);
    }
    catch (error) {
        console.error('Error searching trips:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single trip details - Enhanced for employee booking tool
router.get('/:tripId', function (req, res) {
    try {
        var _a = req.query, includeBookingStats = _a.includeBookingStats, date_1 = _a.date;
        var trip = db_js_1.default.get('trips')
            .find({ id: req.params.tripId })
            .value();
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // For employee tool, add enhanced data if requested
        if (includeBookingStats === 'true') {
            // Get all bookings for this trip
            var bookings = db_js_1.default.get('bookings')
                .filter({ tripId: trip.id })
                .value();
            // Add booking statistics useful for employees
            var tripWithStats = __assign(__assign({}, trip), { stats: {
                    totalBookings: bookings.length,
                    confirmedBookings: bookings.filter(function (b) { return b.status === 'confirmed'; }).length,
                    pendingBookings: bookings.filter(function (b) { return b.status === 'pending'; }).length,
                    cancelledBookings: bookings.filter(function (b) { return b.status === 'cancelled'; }).length,
                    totalRevenue: bookings.reduce(function (sum, booking) { return sum + booking.totalPrice; }, 0),
                    averageGroupSize: bookings.length > 0
                        ? bookings.reduce(function (sum, booking) { return sum + booking.travelers; }, 0) / bookings.length
                        : 0
                }, 
                // Filter availability to requested date if specified
                datesAvailable: date_1
                    ? trip.datesAvailable.filter(function (d) { return d >= String(date_1); })
                    : trip.datesAvailable });
            return res.json(tripWithStats);
        }
        res.json(trip);
    }
    catch (error) {
        console.error('Error fetching trip details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// NEW: Create a new trip (for employee use)
router.post('/', function (req, res) {
    try {
        var tripData = req.body;
        // Validate required fields
        if (!tripData.destination || !tripData.price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create new trip with generated ID
        var newTrip = __assign(__assign({ id: (0, uuid_1.v4)() }, tripData), { datesAvailable: tripData.datesAvailable || [] });
        // Add to database
        db_js_1.default.get('trips')
            .push(newTrip)
            .write();
        res.status(201).json(newTrip);
    }
    catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// NEW: Update a trip (for employee use)
router.put('/:tripId', function (req, res) {
    try {
        var tripId = req.params.tripId;
        var tripData = req.body;
        // Check if trip exists
        var existingTrip = db_js_1.default.get('trips')
            .find({ id: tripId })
            .value();
        if (!existingTrip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // Update trip
        db_js_1.default.get('trips')
            .find({ id: tripId })
            .assign(tripData)
            .write();
        // Get updated trip
        var updatedTrip = db_js_1.default.get('trips')
            .find({ id: tripId })
            .value();
        res.json(updatedTrip);
    }
    catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
