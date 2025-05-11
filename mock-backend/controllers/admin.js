"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentBookings = exports.getUserAnalytics = exports.getAllUsers = exports.getAdminStats = void 0;
var db_js_1 = __importDefault(require("../db.js"));
// Get admin dashboard stats
var getAdminStats = function (req, res) {
    try {
        // Get all users from database
        var users = db_js_1.default.get('users').value();
        var totalUsers = users.length;
        // Count active users (users who logged in within the last 30 days)
        var thirtyDaysAgo_1 = new Date();
        thirtyDaysAgo_1.setDate(thirtyDaysAgo_1.getDate() - 30);
        var activeUsers = users.filter(function (user) {
            return user.lastLoginAt && new Date(user.lastLoginAt) > thirtyDaysAgo_1;
        }).length;
        // Get all bookings
        var bookings = db_js_1.default.get('bookings').value();
        var totalBookings = bookings.length;
        // Calculate revenue
        var allBookings = bookings || [];
        var today_1 = new Date();
        today_1.setHours(0, 0, 0, 0);
        var startOfWeek_1 = new Date();
        startOfWeek_1.setDate(startOfWeek_1.getDate() - startOfWeek_1.getDay());
        startOfWeek_1.setHours(0, 0, 0, 0);
        var startOfMonth_1 = new Date();
        startOfMonth_1.setDate(1);
        startOfMonth_1.setHours(0, 0, 0, 0);
        var revenueToday = allBookings
            .filter(function (booking) { return new Date(booking.createdAt) >= today_1; })
            .reduce(function (sum, booking) { return sum + booking.totalPrice; }, 0);
        var revenueThisWeek = allBookings
            .filter(function (booking) { return new Date(booking.createdAt) >= startOfWeek_1; })
            .reduce(function (sum, booking) { return sum + booking.totalPrice; }, 0);
        var revenueThisMonth = allBookings
            .filter(function (booking) { return new Date(booking.createdAt) >= startOfMonth_1; })
            .reduce(function (sum, booking) { return sum + booking.totalPrice; }, 0);
        // Calculate popular destinations
        var destinationMap_1 = {};
        allBookings.forEach(function (booking) {
            if (!destinationMap_1[booking.tripId]) {
                destinationMap_1[booking.tripId] = 0;
            }
            destinationMap_1[booking.tripId]++;
        });
        var popularDestinations = Object.entries(destinationMap_1)
            .map(function (_a) {
            var destination = _a[0], count = _a[1];
            return ({ destination: destination, count: count });
        })
            .sort(function (a, b) { return b.count - a.count; })
            .slice(0, 5);
        // Get booking statuses
        var bookingsByStatus_1 = {
            confirmed: 0,
            pending: 0,
            cancelled: 0
        };
        allBookings.forEach(function (booking) {
            bookingsByStatus_1[booking.status]++;
        });
        // Calculate conversion rate (simple estimate)
        // In a real app, this would use actual visitor analytics
        var activities = (db_js_1.default.get('activities').value() || []);
        var totalVisits = activities.filter(function (a) { return a.actionType === 'view_trip'; }).length || 1; // Avoid division by zero
        var conversionRate = totalBookings / totalVisits;
        var stats = {
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            totalBookings: totalBookings,
            revenueToday: revenueToday,
            revenueThisWeek: revenueThisWeek,
            revenueThisMonth: revenueThisMonth,
            popularDestinations: popularDestinations,
            conversionRate: conversionRate,
            bookingsByStatus: bookingsByStatus_1
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};
exports.getAdminStats = getAdminStats;
// Get all users
var getAllUsers = function (req, res) {
    try {
        var users = db_js_1.default.get('users').value();
        // Remove password hashes before sending to frontend
        var sanitizedUsers = users.map(function (_a) {
            var passwordHash = _a.passwordHash, user = __rest(_a, ["passwordHash"]);
            return user;
        });
        res.json(sanitizedUsers);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
// Get user analytics
var getUserAnalytics = function (req, res) {
    try {
        var users = db_js_1.default.get('users').value();
        var bookings_1 = db_js_1.default.get('bookings').value();
        var activities_1 = (db_js_1.default.get('activities').value() || []);
        var analytics = users.map(function (user) {
            // Get user's bookings
            var userBookings = bookings_1.filter(function (b) { return b.userId === user.id; });
            var totalSpent = userBookings.reduce(function (sum, b) { return sum + b.totalPrice; }, 0);
            // Get user's activities
            var userActivities = activities_1.filter(function (a) { return a.userId === user.id; });
            // Calculate activity summary
            var activitySummary = {};
            userActivities.forEach(function (activity) {
                if (!activitySummary[activity.actionType]) {
                    activitySummary[activity.actionType] = 0;
                }
                activitySummary[activity.actionType]++;
            });
            // Get latest activity timestamp
            var lastActivity = user.lastLoginAt || user.createdAt;
            if (userActivities.length > 0) {
                var latestActivity = userActivities.sort(function (a, b) {
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                })[0];
                lastActivity = latestActivity.timestamp;
            }
            return {
                userId: user.id,
                username: user.username,
                email: user.email,
                totalBookings: userBookings.length,
                totalSpent: totalSpent,
                lastActivity: lastActivity,
                registrationDate: user.createdAt,
                activitySummary: activitySummary
            };
        });
        res.json(analytics);
    }
    catch (error) {
        console.error('Error fetching user analytics:', error);
        res.status(500).json({ error: 'Failed to fetch user analytics' });
    }
};
exports.getUserAnalytics = getUserAnalytics;
// Get recent bookings
var getRecentBookings = function (req, res) {
    try {
        var bookings = db_js_1.default.get('bookings').value();
        // Sort by creation date, newest first
        var sortedBookings = __spreadArray([], bookings, true).sort(function (a, b) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        // Get the 20 most recent bookings
        var recentBookings = sortedBookings.slice(0, 20);
        res.json(recentBookings);
    }
    catch (error) {
        console.error('Error fetching recent bookings:', error);
        res.status(500).json({ error: 'Failed to fetch recent bookings' });
    }
};
exports.getRecentBookings = getRecentBookings;
