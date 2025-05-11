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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_js_1 = require("../auth.js");
var router = express_1.default.Router();
// Mock 2FA setup data
var mockTwoFactorSetups = [
    {
        userId: '1',
        isEnabled: true,
        preferredMethod: 'email',
        backupCodes: ['123456', '234567', '345678', '456789', '567890'],
        lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        userId: '2',
        isEnabled: false,
        preferredMethod: 'sms',
        phone: '+1234567890',
        lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
];
// Mock verification codes
var verificationCodes = new Map();
// Get 2FA setup for a user
router.get('/setup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, setup;
    return __generator(this, function (_a) {
        try {
            userId_1 = (0, auth_js_1.extractUserId)(req);
            if (!userId_1) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            setup = mockTwoFactorSetups.find(function (s) { return s.userId === userId_1; });
            if (!setup) {
                // If no setup exists, return a default one
                return [2 /*return*/, res.json({
                        userId: userId_1,
                        isEnabled: false,
                        preferredMethod: 'email',
                        lastUpdated: new Date().toISOString()
                    })];
            }
            res.json(setup);
        }
        catch (error) {
            console.error('Error fetching 2FA setup:', error);
            res.status(500).json({ error: 'Failed to fetch 2FA setup' });
        }
        return [2 /*return*/];
    });
}); });
// Update 2FA setup
router.put('/setup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_2, _a, isEnabled, preferredMethod, phone, existingSetupIndex, backupCodes, updatedSetup;
    return __generator(this, function (_b) {
        try {
            userId_2 = (0, auth_js_1.extractUserId)(req);
            if (!userId_2) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            _a = req.body, isEnabled = _a.isEnabled, preferredMethod = _a.preferredMethod, phone = _a.phone;
            // Validate inputs
            if (preferredMethod !== 'email' && preferredMethod !== 'sms' && preferredMethod !== 'authenticator') {
                return [2 /*return*/, res.status(400).json({ error: 'Invalid preferred method' })];
            }
            if (preferredMethod === 'sms' && !phone) {
                return [2 /*return*/, res.status(400).json({ error: 'Phone number is required for SMS method' })];
            }
            existingSetupIndex = mockTwoFactorSetups.findIndex(function (s) { return s.userId === userId_2; });
            backupCodes = isEnabled
                ? Array.from({ length: 5 }, function () { return Math.floor(100000 + Math.random() * 900000).toString(); })
                : undefined;
            updatedSetup = {
                userId: userId_2,
                isEnabled: isEnabled === true,
                preferredMethod: preferredMethod,
                phone: preferredMethod === 'sms' ? phone : undefined,
                backupCodes: backupCodes || (existingSetupIndex >= 0 ? mockTwoFactorSetups[existingSetupIndex].backupCodes : undefined),
                lastUpdated: new Date().toISOString()
            };
            if (existingSetupIndex >= 0) {
                // Update existing setup
                mockTwoFactorSetups[existingSetupIndex] = updatedSetup;
            }
            else {
                // Create new setup
                mockTwoFactorSetups.push(updatedSetup);
            }
            res.json(updatedSetup);
        }
        catch (error) {
            console.error('Error updating 2FA setup:', error);
            res.status(500).json({ error: 'Failed to update 2FA setup' });
        }
        return [2 /*return*/];
    });
}); });
// Send verification code
router.post('/send-code', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_3, setup, code, expires;
    return __generator(this, function (_a) {
        try {
            userId_3 = (0, auth_js_1.extractUserId)(req);
            if (!userId_3) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            setup = mockTwoFactorSetups.find(function (s) { return s.userId === userId_3; });
            if (!setup || !setup.isEnabled) {
                return [2 /*return*/, res.status(400).json({ error: '2FA is not enabled for this user' })];
            }
            code = Math.floor(100000 + Math.random() * 900000).toString();
            expires = new Date();
            expires.setMinutes(expires.getMinutes() + 5);
            verificationCodes.set(userId_3, { code: code, expires: expires });
            // In a real application, this would send an email or SMS
            // For this mock, we'll just return a success message
            res.json({
                success: true,
                method: setup.preferredMethod,
                message: "Verification code sent via ".concat(setup.preferredMethod)
            });
        }
        catch (error) {
            console.error('Error sending verification code:', error);
            res.status(500).json({ error: 'Failed to send verification code' });
        }
        return [2 /*return*/];
    });
}); });
// Verify code
router.post('/verify-code', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, code, storedCode;
    return __generator(this, function (_a) {
        try {
            userId = (0, auth_js_1.extractUserId)(req);
            if (!userId) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            code = req.body.code;
            if (!code) {
                return [2 /*return*/, res.status(400).json({ error: 'Verification code is required' })];
            }
            storedCode = verificationCodes.get(userId);
            if (!storedCode) {
                return [2 /*return*/, res.status(400).json({ error: 'No verification code was requested' })];
            }
            // Check if code has expired
            if (new Date() > storedCode.expires) {
                verificationCodes.delete(userId);
                return [2 /*return*/, res.status(400).json({ error: 'Verification code has expired' })];
            }
            // Check if code matches
            if (storedCode.code !== code) {
                return [2 /*return*/, res.status(400).json({ error: 'Invalid verification code' })];
            }
            // Code is valid, clear it from storage
            verificationCodes.delete(userId);
            // Create a token that indicates 2FA is verified
            // In a real application, this would generate a token or update the user's session
            res.json({ success: true, message: 'Verification successful' });
        }
        catch (error) {
            console.error('Error verifying code:', error);
            res.status(500).json({ error: 'Failed to verify code' });
        }
        return [2 /*return*/];
    });
}); });
// Verify backup code
router.post('/verify-backup-code', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_4, code_1, setup, updatedBackupCodes, setupIndex;
    return __generator(this, function (_a) {
        try {
            userId_4 = (0, auth_js_1.extractUserId)(req);
            if (!userId_4) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            code_1 = req.body.code;
            if (!code_1) {
                return [2 /*return*/, res.status(400).json({ error: 'Backup code is required' })];
            }
            setup = mockTwoFactorSetups.find(function (s) { return s.userId === userId_4; });
            if (!setup || !setup.isEnabled) {
                return [2 /*return*/, res.status(400).json({ error: '2FA is not enabled for this user' })];
            }
            if (!setup.backupCodes || !setup.backupCodes.includes(code_1)) {
                return [2 /*return*/, res.status(400).json({ error: 'Invalid backup code' })];
            }
            updatedBackupCodes = setup.backupCodes.filter(function (c) { return c !== code_1; });
            setupIndex = mockTwoFactorSetups.findIndex(function (s) { return s.userId === userId_4; });
            mockTwoFactorSetups[setupIndex].backupCodes = updatedBackupCodes;
            // In a real application, this would generate a token or update the user's session
            res.json({ success: true, message: 'Backup code verification successful' });
        }
        catch (error) {
            console.error('Error verifying backup code:', error);
            res.status(500).json({ error: 'Failed to verify backup code' });
        }
        return [2 /*return*/];
    });
}); });
// Generate new backup codes
router.post('/generate-backup-codes', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_5, setup, newBackupCodes, setupIndex;
    return __generator(this, function (_a) {
        try {
            userId_5 = (0, auth_js_1.extractUserId)(req);
            if (!userId_5) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            setup = mockTwoFactorSetups.find(function (s) { return s.userId === userId_5; });
            if (!setup || !setup.isEnabled) {
                return [2 /*return*/, res.status(400).json({ error: '2FA is not enabled for this user' })];
            }
            newBackupCodes = Array.from({ length: 5 }, function () { return Math.floor(100000 + Math.random() * 900000).toString(); });
            setupIndex = mockTwoFactorSetups.findIndex(function (s) { return s.userId === userId_5; });
            mockTwoFactorSetups[setupIndex].backupCodes = newBackupCodes;
            mockTwoFactorSetups[setupIndex].lastUpdated = new Date().toISOString();
            res.json({
                success: true,
                backupCodes: newBackupCodes
            });
        }
        catch (error) {
            console.error('Error generating backup codes:', error);
            res.status(500).json({ error: 'Failed to generate backup codes' });
        }
        return [2 /*return*/];
    });
}); });
// Disable 2FA
router.post('/disable', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_6, setup, setupIndex;
    return __generator(this, function (_a) {
        try {
            userId_6 = (0, auth_js_1.extractUserId)(req);
            if (!userId_6) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            setup = mockTwoFactorSetups.find(function (s) { return s.userId === userId_6; });
            if (!setup) {
                return [2 /*return*/, res.status(400).json({ error: '2FA setup not found' })];
            }
            if (!setup.isEnabled) {
                return [2 /*return*/, res.status(400).json({ error: '2FA is already disabled' })];
            }
            setupIndex = mockTwoFactorSetups.findIndex(function (s) { return s.userId === userId_6; });
            mockTwoFactorSetups[setupIndex].isEnabled = false;
            mockTwoFactorSetups[setupIndex].lastUpdated = new Date().toISOString();
            res.json({
                success: true,
                message: '2FA has been disabled'
            });
        }
        catch (error) {
            console.error('Error disabling 2FA:', error);
            res.status(500).json({ error: 'Failed to disable 2FA' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
