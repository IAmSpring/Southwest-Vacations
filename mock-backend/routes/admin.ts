import express from 'express';
import { getAdminStats, getAllUsers, getUserAnalytics, getRecentBookings } from '../controllers/admin.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', getAdminStats);

// Get all users
router.get('/users', getAllUsers);

// Get user analytics
router.get('/analytics/users', getUserAnalytics);

// Get recent bookings
router.get('/bookings/recent', getRecentBookings);

export default router; 