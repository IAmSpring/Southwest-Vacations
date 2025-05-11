"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = exports.JWT_SECRET = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_js_1 = __importDefault(require("../db.js"));
var activityTracker_js_1 = require("./activityTracker.js");
// Secret key for JWT
exports.JWT_SECRET = 'southwest-vacations-secret-key';
// Middleware to authenticate requests
var requireAuth = function (req, res, next) {
    try {
        // Get token from Authorization header
        var authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        var token = authHeader.split(' ')[1];
        // Verify token
        jsonwebtoken_1.default.verify(token, exports.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            // Get user from database
            var user = db_js_1.default.get('users')
                .find({ id: decoded.id })
                .value();
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Attach user to request for use in route handlers
            req.user = user;
            // Track user activity
            (0, activityTracker_js_1.trackUserAction)(user.id, 'view_trip', "".concat(req.method, " ").concat(req.originalUrl), { ip: req.ip });
            next();
        });
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
exports.requireAuth = requireAuth;
// Middleware to check if user is an admin
var requireAdmin = function (req, res, next) {
    (0, exports.requireAuth)(req, res, function () {
        var _a;
        // Check if the authenticated user is an admin
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        // User is an admin, proceed
        next();
    });
};
exports.requireAdmin = requireAdmin;
