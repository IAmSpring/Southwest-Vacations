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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Mock notifications data for testing
var mockNotifications = [
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        title: 'Booking Confirmed',
        content: 'Booking #B12345 has been confirmed successfully.',
        type: 'booking',
        status: 'unread',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        priority: 'high',
        actions: [
            {
                label: 'View Booking',
                url: '/bookings/B12345'
            }
        ],
        relatedId: 'B12345'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        title: 'New Policy Update',
        content: 'The refund policy has been updated. Please review the changes.',
        type: 'policy',
        status: 'unread',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        actions: [
            {
                label: 'View Policy',
                url: '/policies/refunds'
            }
        ],
        relatedId: 'refunds'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        title: 'System Maintenance',
        content: 'The system will be undergoing maintenance on Sunday, June 30th from 2:00 AM to 5:00 AM CDT.',
        type: 'system',
        status: 'read',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        actions: [
            {
                label: 'Learn More',
                url: '/announcements'
            }
        ]
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        title: 'Training Certification Expiring',
        content: 'Your "Booking System Fundamentals" certification will expire in 30 days. Please renew it.',
        type: 'training',
        status: 'unread',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        actions: [
            {
                label: 'Renew Certification',
                url: '/training/course/1'
            }
        ],
        relatedId: '1'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        title: 'New Caribbean Promotions',
        content: 'New promotional offers available for Caribbean destinations. Use code CARIBBEAN2023.',
        type: 'promotion',
        status: 'read',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        actions: [
            {
                label: 'View Promotions',
                url: '/search?category=beach'
            }
        ]
    }
];
// Default notification preferences
var defaultPreference = {
    userId: '1',
    emailEnabled: true,
    inAppEnabled: true,
    categories: {
        booking: true,
        system: true,
        policy: true,
        promotion: true,
        training: true
    },
    emailFrequency: 'daily'
};
// Get notifications for current user
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, status_1, type_1, limit, userNotifications;
    return __generator(this, function (_a) {
        try {
            userId_1 = (0, auth_js_1.extractUserId)(req);
            if (!userId_1) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            status_1 = req.query.status;
            type_1 = req.query.type;
            limit = parseInt(req.query.limit) || 10;
            userNotifications = mockNotifications.filter(function (n) { return n.userId === userId_1; });
            if (status_1) {
                userNotifications = userNotifications.filter(function (n) { return n.status === status_1; });
            }
            if (type_1) {
                userNotifications = userNotifications.filter(function (n) { return n.type === type_1; });
            }
            // Sort by creation date (newest first) and limit results
            userNotifications = userNotifications
                .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })
                .slice(0, limit);
            // Return notifications
            res.json(userNotifications);
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
        return [2 /*return*/];
    });
}); });
// Get notification count by status
router.get('/count', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_2, userNotifications, counts;
    return __generator(this, function (_a) {
        try {
            userId_2 = (0, auth_js_1.extractUserId)(req);
            if (!userId_2) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            userNotifications = mockNotifications.filter(function (n) { return n.userId === userId_2; });
            counts = {
                total: userNotifications.length,
                unread: userNotifications.filter(function (n) { return n.status === 'unread'; }).length,
                read: userNotifications.filter(function (n) { return n.status === 'read'; }).length
            };
            res.json(counts);
        }
        catch (error) {
            console.error('Error fetching notification counts:', error);
            res.status(500).json({ error: 'Failed to fetch notification counts' });
        }
        return [2 /*return*/];
    });
}); });
// Get notification by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_3, notification;
    return __generator(this, function (_a) {
        try {
            userId_3 = (0, auth_js_1.extractUserId)(req);
            if (!userId_3) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            notification = mockNotifications.find(function (n) { return n.id === req.params.id && n.userId === userId_3; });
            if (!notification) {
                return [2 /*return*/, res.status(404).json({ error: 'Notification not found' })];
            }
            res.json(notification);
        }
        catch (error) {
            console.error('Error fetching notification:', error);
            res.status(500).json({ error: 'Failed to fetch notification' });
        }
        return [2 /*return*/];
    });
}); });
// Mark notification as read
router.put('/:id/read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_4, notificationIndex, updatedNotification;
    return __generator(this, function (_a) {
        try {
            userId_4 = (0, auth_js_1.extractUserId)(req);
            if (!userId_4) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            notificationIndex = mockNotifications.findIndex(function (n) { return n.id === req.params.id && n.userId === userId_4; });
            if (notificationIndex === -1) {
                return [2 /*return*/, res.status(404).json({ error: 'Notification not found' })];
            }
            updatedNotification = __assign(__assign({}, mockNotifications[notificationIndex]), { status: 'read' });
            // In a real implementation, we would update the database
            // For now, we just update our mock data
            mockNotifications[notificationIndex] = updatedNotification;
            res.json(updatedNotification);
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
        return [2 /*return*/];
    });
}); });
// Mark all notifications as read
router.put('/mark-all-read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, i;
    return __generator(this, function (_a) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            // In a real implementation, we would update the database
            // For now, we just update our mock data
            for (i = 0; i < mockNotifications.length; i++) {
                if (mockNotifications[i].userId === userId && mockNotifications[i].status === 'unread') {
                    mockNotifications[i] = __assign(__assign({}, mockNotifications[i]), { status: 'read' });
                }
            }
            res.json({ success: true, message: 'All notifications marked as read' });
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            res.status(500).json({ error: 'Failed to mark all notifications as read' });
        }
        return [2 /*return*/];
    });
}); });
// Get notification preferences
router.get('/preferences', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            // In a real implementation, we would query the database
            // For now, we just return our mock data
            res.json(defaultPreference);
        }
        catch (error) {
            console.error('Error fetching notification preferences:', error);
            res.status(500).json({ error: 'Failed to fetch notification preferences' });
        }
        return [2 /*return*/];
    });
}); });
// Update notification preferences
router.put('/preferences', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, updatedPreferences, newPreferences;
    return __generator(this, function (_a) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            updatedPreferences = req.body;
            // Validate preferences
            if (!updatedPreferences) {
                return [2 /*return*/, res.status(400).json({ error: 'Invalid preferences' })];
            }
            newPreferences = __assign(__assign(__assign({}, defaultPreference), updatedPreferences), { userId: userId });
            res.json(newPreferences);
        }
        catch (error) {
            console.error('Error updating notification preferences:', error);
            res.status(500).json({ error: 'Failed to update notification preferences' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
