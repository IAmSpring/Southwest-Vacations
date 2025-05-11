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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var db_js_1 = __importDefault(require("../db.js"));
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Middleware to verify user is authenticated
var authMiddleware = function (req, res, next) {
    var userId = (0, auth_js_1.extractUserId)(req);
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    req.body.userId = userId;
    next();
};
// Get all bookings with filtering options
router.get('/', function (req, res) {
    try {
        var _a = req.query, status_1 = _a.status, startDate_1 = _a.startDate, endDate_1 = _a.endDate, search = _a.search, _b = _a.sortBy, sortBy_1 = _b === void 0 ? 'createdAt' : _b, _c = _a.sortOrder, sortOrder_1 = _c === void 0 ? 'desc' : _c, limit = _a.limit;
        var bookings = db_js_1.default.get('bookings').value();
        // Apply filters
        if (status_1) {
            bookings = bookings.filter(function (booking) { return booking.status === status_1; });
        }
        if (startDate_1) {
            bookings = bookings.filter(function (booking) { return booking.startDate >= String(startDate_1); });
        }
        if (endDate_1) {
            bookings = bookings.filter(function (booking) { return booking.startDate <= String(endDate_1); });
        }
        if (search) {
            var searchTerm_1 = String(search).toLowerCase();
            bookings = bookings.filter(function (booking) {
                return booking.fullName.toLowerCase().includes(searchTerm_1) ||
                    booking.email.toLowerCase().includes(searchTerm_1) ||
                    (booking.confirmationCode && booking.confirmationCode.toLowerCase().includes(searchTerm_1)) ||
                    booking.id.toLowerCase().includes(searchTerm_1);
            });
        }
        // Apply sorting
        bookings.sort(function (a, b) {
            var comparison = 0;
            var validSortByField = String(sortBy_1);
            // Handle date comparisons
            if (validSortByField === 'createdAt' || validSortByField === 'startDate') {
                var dateA = new Date(a[validSortByField]);
                var dateB = new Date(b[validSortByField]);
                comparison = dateA.getTime() - dateB.getTime();
            }
            else if (validSortByField === 'totalPrice') {
                // Handle number comparisons
                comparison = a.totalPrice - b.totalPrice;
            }
            else {
                // Default to created date
                var dateA = new Date(a.createdAt);
                var dateB = new Date(b.createdAt);
                comparison = dateA.getTime() - dateB.getTime();
            }
            return sortOrder_1 === 'desc' ? -comparison : comparison;
        });
        // Apply limit
        if (limit) {
            bookings = bookings.slice(0, Number(limit));
        }
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
// Get booking by ID
router.get('/:id', function (req, res) {
    try {
        var id = req.params.id;
        var booking = db_js_1.default.get('bookings')
            .find({ id: id })
            .value();
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});
// Create a new booking
router.post('/', function (req, res) {
    try {
        var bookingData = req.body;
        // Validate required fields
        if (!bookingData.tripId || !bookingData.fullName || !bookingData.email || !bookingData.startDate) {
            return res.status(400).json({ error: 'Missing required booking information' });
        }
        var newBooking = __assign(__assign({ id: (0, uuid_1.v4)() }, bookingData), { status: 'pending', confirmedAt: '', createdAt: new Date().toISOString(), travelers: bookingData.travelers || 1, totalPrice: bookingData.totalPrice || 0 });
        db_js_1.default.get('bookings')
            .push(newBooking)
            .write();
        res.status(201).json(newBooking);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});
// Update booking status
router.put('/:id/status', function (req, res) {
    try {
        var id = req.params.id;
        var status_2 = req.body.status;
        if (!['confirmed', 'pending', 'cancelled'].includes(status_2)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        var booking = db_js_1.default.get('bookings')
            .find({ id: id })
            .value();
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        var updatedBooking = __assign(__assign({}, booking), { status: status_2, updatedAt: new Date().toISOString() });
        // If status is being set to confirmed, add confirmation date
        if (status_2 === 'confirmed' && booking.status !== 'confirmed') {
            updatedBooking.confirmedAt = new Date().toISOString();
        }
        db_js_1.default.get('bookings')
            .find({ id: id })
            .assign(updatedBooking)
            .write();
        res.json(updatedBooking);
    }
    catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});
// Update booking details
router.put('/:id', function (req, res) {
    try {
        var id = req.params.id;
        var bookingData = req.body;
        var booking = db_js_1.default.get('bookings')
            .find({ id: id })
            .value();
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        // Don't allow changing these fields directly
        delete bookingData.id;
        delete bookingData.createdAt;
        delete bookingData.confirmedAt;
        var updatedBooking = __assign(__assign(__assign({}, booking), bookingData), { updatedAt: new Date().toISOString() });
        db_js_1.default.get('bookings')
            .find({ id: id })
            .assign(updatedBooking)
            .write();
        res.json(updatedBooking);
    }
    catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});
// Delete booking
router.delete('/:id', function (req, res) {
    try {
        var id = req.params.id;
        var booking = db_js_1.default.get('bookings')
            .find({ id: id })
            .value();
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        db_js_1.default.get('bookings')
            .remove({ id: id })
            .write();
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});
exports.default = router;
