"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackUserAction = exports.trackActivity = void 0;
var uuid_1 = require("uuid");
var db_js_1 = __importDefault(require("../db.js"));
/**
 * Middleware to track user activity in the system
 */
var trackActivity = function (actionType) {
    return function (req, res, next) {
        // Store original end method
        var originalEnd = res.end;
        // Override end method to log activity after response is sent
        res.end = function (chunk, encoding, callback) {
            // Call original end method
            originalEnd.call(this, chunk, encoding, callback);
            // Log user activity only if request was successful (status < 400)
            if (res.statusCode < 400 && req.user) {
                var userId = req.user.id;
                var timestamp = new Date().toISOString();
                // Create activity entry
                var activity = {
                    id: (0, uuid_1.v4)(),
                    userId: userId,
                    actionType: actionType,
                    timestamp: timestamp,
                    details: req.originalUrl,
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent'),
                    metadata: {
                        method: req.method,
                        params: req.params,
                        query: req.query,
                        // Don't log sensitive body data like passwords
                        body: actionType === 'login' ? { email: req.body.email } : req.body
                    }
                };
                // Save to database
                try {
                    // Add the activity to a custom db collection
                    // Using a separate db API to avoid schema type issues
                    var activities = db_js_1.default.get('activities');
                    if (activities && typeof activities.push === 'function') {
                        activities.push(activity).write();
                    }
                    else {
                        console.error('Activities collection not available');
                    }
                }
                catch (error) {
                    console.error('Error tracking user activity:', error);
                }
            }
            return this;
        };
        next();
    };
};
exports.trackActivity = trackActivity;
/**
 * Track specific user action programmatically (not through middleware)
 */
var trackUserAction = function (userId, actionType, details, metadata) {
    try {
        var activity = {
            id: (0, uuid_1.v4)(),
            userId: userId,
            actionType: actionType,
            timestamp: new Date().toISOString(),
            details: details,
            metadata: metadata
        };
        // Add the activity to a custom db collection
        // Using a separate db API to avoid schema type issues
        var activities = db_js_1.default.get('activities');
        if (activities && typeof activities.push === 'function') {
            activities.push(activity).write();
            return true;
        }
        else {
            console.error('Activities collection not available');
            return false;
        }
    }
    catch (error) {
        console.error('Error tracking user action:', error);
        return false;
    }
};
exports.trackUserAction = trackUserAction;
