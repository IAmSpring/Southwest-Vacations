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
var db_js_1 = __importDefault(require("../db.js"));
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Register a new user
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, user, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                // Validate required fields
                if (!username || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing required fields' })];
                }
                return [4 /*yield*/, (0, auth_js_1.registerUser)(username, email, password)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: 'User already exists with this email' })];
                }
                // Return success without sensitive data
                res.status(201).json({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error registering user:', error_1);
                res.status(500).json({ error: 'Server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Login user
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password;
                // Validate required fields
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing email or password' })];
                }
                return [4 /*yield*/, (0, auth_js_1.loginUser)(email, password)];
            case 1:
                token = _b.sent();
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                // Return token
                res.json({ token: token });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Error logging in user:', error_2);
                res.status(500).json({ error: 'Server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get current user profile
router.get('/me', function (req, res) {
    try {
        var userId = (0, auth_js_1.extractUserId)(req);
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        var user = (0, auth_js_1.getUserById)(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Return user without password hash
        var passwordHash = user.passwordHash, userProfile = __rest(user, ["passwordHash"]);
        res.json(userProfile);
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get user bookings for Manage Vacations page
router.get('/:userId/bookings', function (req, res) {
    try {
        var userId = req.params.userId;
        var currentUserId = (0, auth_js_1.extractUserId)(req);
        // Ensure user is authenticated and requesting their own bookings
        if (!currentUserId || (currentUserId !== userId && currentUserId !== 'admin')) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }
        // Get all bookings for this user
        var bookings = db_js_1.default.get('bookings')
            .filter({ userId: userId })
            .value();
        // Get trip details for each booking
        var bookingsWithDetails = bookings.map(function (booking) {
            var trip = db_js_1.default.get('trips')
                .find({ id: booking.tripId })
                .value();
            return __assign(__assign({}, booking), { destination: trip ? trip.destination : 'Unknown Destination', imageUrl: trip ? trip.imageUrl : '', duration: trip ? trip.duration || 0 : 0 });
        });
        res.json(bookingsWithDetails);
    }
    catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
