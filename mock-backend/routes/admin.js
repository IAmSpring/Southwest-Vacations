"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var admin_js_1 = require("../controllers/admin.js");
var auth_js_1 = require("../middlewares/auth.js");
var router = express_1.default.Router();
// All admin routes require admin authentication
router.use(auth_js_1.requireAdmin);
// Get admin dashboard stats
router.get('/stats', admin_js_1.getAdminStats);
// Get all users
router.get('/users', admin_js_1.getAllUsers);
// Get user analytics
router.get('/analytics/users', admin_js_1.getUserAnalytics);
// Get recent bookings
router.get('/bookings/recent', admin_js_1.getRecentBookings);
exports.default = router;
