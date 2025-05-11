"use strict";
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
var express_1 = __importDefault(require("express"));
var uuid_1 = require("uuid");
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Mock audit log entries
var mockAuditLogs = [
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        action: 'login',
        resource: 'auth',
        resourceId: '1',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        details: {},
        status: 'success'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        action: 'create',
        resource: 'booking',
        resourceId: 'B12345',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        details: {
            bookingId: 'B12345',
            customerName: 'John Doe',
            destination: 'Miami',
            amount: 1250.00
        },
        status: 'success'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '2',
        action: 'update',
        resource: 'booking',
        resourceId: 'B12345',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        details: {
            bookingId: 'B12345',
            changes: {
                departureDate: '2023-07-15',
                previousDepartureDate: '2023-07-10'
            }
        },
        status: 'success'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '1',
        action: 'approve',
        resource: 'discount',
        resourceId: 'D5678',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        details: {
            discountId: 'D5678',
            bookingId: 'B12345',
            discountAmount: 200.00
        },
        status: 'success'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '3',
        action: 'delete',
        resource: 'booking',
        resourceId: 'B98765',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.3',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
        details: {
            bookingId: 'B98765',
            reason: 'Customer request'
        },
        status: 'success'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '2',
        action: 'update',
        resource: 'user',
        resourceId: '4',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        details: {
            userId: '4',
            changes: {
                email: 'new.email@example.com',
                previousEmail: 'old.email@example.com'
            }
        },
        status: 'success'
    },
    {
        id: (0, uuid_1.v4)(),
        userId: '3',
        action: 'login',
        resource: 'auth',
        resourceId: '3',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        ipAddress: '192.168.1.4',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        details: {},
        status: 'failure',
        reason: 'Invalid password'
    }
];
// Create a new audit log entry
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, action, resource, resourceId, details, status_1, reason, ipAddress, userAgent, newLogEntry;
    return __generator(this, function (_b) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            _a = req.body, action = _a.action, resource = _a.resource, resourceId = _a.resourceId, details = _a.details, status_1 = _a.status, reason = _a.reason;
            // Validate required fields
            if (!action || !resource || !resourceId) {
                return [2 /*return*/, res.status(400).json({ error: 'Action, resource, and resourceId are required' })];
            }
            ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
            userAgent = req.headers['user-agent'] || 'unknown';
            newLogEntry = {
                id: (0, uuid_1.v4)(),
                userId: userId,
                action: action,
                resource: resource,
                resourceId: resourceId,
                timestamp: new Date().toISOString(),
                ipAddress: ipAddress,
                userAgent: userAgent,
                details: details || {},
                status: status_1 || 'success',
                reason: reason
            };
            // Add to mock database
            mockAuditLogs.unshift(newLogEntry);
            res.status(201).json(newLogEntry);
        }
        catch (error) {
            console.error('Error creating audit log:', error);
            res.status(500).json({ error: 'Failed to create audit log' });
        }
        return [2 /*return*/];
    });
}); });
// Get audit logs with filtering
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, user_1, action_1, resource_1, resourceId_1, startDate, endDate, status_2, _b, limit, _c, offset, filteredLogs, start_1, end_1, limitNum, offsetNum, paginatedLogs;
    return __generator(this, function (_d) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            _a = req.query, user_1 = _a.user, action_1 = _a.action, resource_1 = _a.resource, resourceId_1 = _a.resourceId, startDate = _a.startDate, endDate = _a.endDate, status_2 = _a.status, _b = _a.limit, limit = _b === void 0 ? '50' : _b, _c = _a.offset, offset = _c === void 0 ? '0' : _c;
            filteredLogs = __spreadArray([], mockAuditLogs, true);
            if (user_1) {
                filteredLogs = filteredLogs.filter(function (log) { return log.userId === user_1; });
            }
            if (action_1) {
                filteredLogs = filteredLogs.filter(function (log) { return log.action === action_1; });
            }
            if (resource_1) {
                filteredLogs = filteredLogs.filter(function (log) { return log.resource === resource_1; });
            }
            if (resourceId_1) {
                filteredLogs = filteredLogs.filter(function (log) { return log.resourceId === resourceId_1; });
            }
            if (status_2) {
                filteredLogs = filteredLogs.filter(function (log) { return log.status === status_2; });
            }
            if (startDate) {
                start_1 = new Date(startDate).getTime();
                filteredLogs = filteredLogs.filter(function (log) { return new Date(log.timestamp).getTime() >= start_1; });
            }
            if (endDate) {
                end_1 = new Date(endDate).getTime();
                filteredLogs = filteredLogs.filter(function (log) { return new Date(log.timestamp).getTime() <= end_1; });
            }
            limitNum = parseInt(limit, 10);
            offsetNum = parseInt(offset, 10);
            paginatedLogs = filteredLogs.slice(offsetNum, offsetNum + limitNum);
            res.json({
                total: filteredLogs.length,
                limit: limitNum,
                offset: offsetNum,
                logs: paginatedLogs
            });
        }
        catch (error) {
            console.error('Error fetching audit logs:', error);
            res.status(500).json({ error: 'Failed to fetch audit logs' });
        }
        return [2 /*return*/];
    });
}); });
// Get audit logs for a specific resource
router.get('/resource/:resource/:resourceId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, resource_2, resourceId_2, limit, resourceLogs;
    return __generator(this, function (_b) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            _a = req.params, resource_2 = _a.resource, resourceId_2 = _a.resourceId;
            limit = parseInt(req.query.limit || '10', 10);
            resourceLogs = mockAuditLogs
                .filter(function (log) { return log.resource === resource_2 && log.resourceId === resourceId_2; })
                .slice(0, limit);
            res.json(resourceLogs);
        }
        catch (error) {
            console.error('Error fetching resource audit logs:', error);
            res.status(500).json({ error: 'Failed to fetch resource audit logs' });
        }
        return [2 /*return*/];
    });
}); });
// Get audit logs for a specific user
router.get('/user/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requesterId, targetUserId_1, limit, userLogs;
    return __generator(this, function (_a) {
        try {
            requesterId = (0, auth_js_1.extractUserId)(req);
            if (!requesterId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            targetUserId_1 = req.params.userId;
            limit = parseInt(req.query.limit || '50', 10);
            userLogs = mockAuditLogs
                .filter(function (log) { return log.userId === targetUserId_1; })
                .slice(0, limit);
            res.json(userLogs);
        }
        catch (error) {
            console.error('Error fetching user audit logs:', error);
            res.status(500).json({ error: 'Failed to fetch user audit logs' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
