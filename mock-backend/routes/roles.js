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
// Mock permissions data
var mockPermissions = [
    {
        id: '1',
        name: 'view_bookings',
        description: 'View all bookings',
        resource: 'bookings',
        action: 'read'
    },
    {
        id: '2',
        name: 'create_booking',
        description: 'Create new bookings',
        resource: 'bookings',
        action: 'create'
    },
    {
        id: '3',
        name: 'update_booking',
        description: 'Update existing bookings',
        resource: 'bookings',
        action: 'update'
    },
    {
        id: '4',
        name: 'delete_booking',
        description: 'Delete bookings',
        resource: 'bookings',
        action: 'delete'
    },
    {
        id: '5',
        name: 'view_analytics',
        description: 'View analytics dashboard',
        resource: 'analytics',
        action: 'read'
    },
    {
        id: '6',
        name: 'export_reports',
        description: 'Export reports',
        resource: 'reports',
        action: 'export'
    },
    {
        id: '7',
        name: 'approve_discounts',
        description: 'Approve discount applications',
        resource: 'discounts',
        action: 'approve'
    },
    {
        id: '8',
        name: 'manage_users',
        description: 'Create and manage user accounts',
        resource: 'users',
        action: 'update'
    },
    {
        id: '9',
        name: 'assign_roles',
        description: 'Assign roles to users',
        resource: 'roles',
        action: 'update'
    },
    {
        id: '10',
        name: 'manage_training',
        description: 'Manage training courses and materials',
        resource: 'training',
        action: 'update'
    }
];
// Mock roles with assigned permissions
var mockRoles = [
    {
        id: '1',
        name: 'customer',
        displayName: 'Customer',
        description: 'Regular customer account with limited access',
        permissions: ['1'],
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'agent',
        displayName: 'Booking Agent',
        description: 'Booking agent with access to create and manage bookings',
        permissions: ['1', '2', '3'],
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'supervisor',
        displayName: 'Supervisor',
        description: 'Team supervisor with expanded permissions',
        permissions: ['1', '2', '3', '4', '5', '6', '7'],
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        name: 'admin',
        displayName: 'Administrator',
        description: 'System administrator with full access',
        permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'system',
        displayName: 'System Service',
        description: 'System service account for automated operations',
        permissions: ['1', '2', '3', '4'],
        createdAt: new Date().toISOString()
    }
];
// Mock role assignments
var mockUserRoleAssignments = [
    {
        userId: '1',
        roleId: '4',
        assignedAt: new Date().toISOString(),
        assignedBy: 'system'
    },
    {
        userId: '2',
        roleId: '2',
        assignedAt: new Date().toISOString(),
        assignedBy: '1'
    }
];
// Get all permissions
router.get('/permissions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, userRoleAssignment_1, userRole;
    return __generator(this, function (_a) {
        try {
            userId_1 = (0, auth_js_1.extractUserId)(req);
            if (!userId_1) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            userRoleAssignment_1 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === userId_1; });
            if (!userRoleAssignment_1) {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: No role assigned' })];
            }
            userRole = mockRoles.find(function (role) { return role.id === userRoleAssignment_1.roleId; });
            if (!userRole || (userRole.name !== 'admin' && userRole.name !== 'supervisor')) {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: Insufficient permissions' })];
            }
            res.json(mockPermissions);
        }
        catch (error) {
            console.error('Error fetching permissions:', error);
            res.status(500).json({ error: 'Failed to fetch permissions' });
        }
        return [2 /*return*/];
    });
}); });
// Get all roles
router.get('/roles', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_2, userRoleAssignment_2, userRole;
    return __generator(this, function (_a) {
        try {
            userId_2 = (0, auth_js_1.extractUserId)(req);
            if (!userId_2) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            userRoleAssignment_2 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === userId_2; });
            if (!userRoleAssignment_2) {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: No role assigned' })];
            }
            userRole = mockRoles.find(function (role) { return role.id === userRoleAssignment_2.roleId; });
            if (!userRole || userRole.name !== 'admin') {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: Insufficient permissions' })];
            }
            res.json(mockRoles);
        }
        catch (error) {
            console.error('Error fetching roles:', error);
            res.status(500).json({ error: 'Failed to fetch roles' });
        }
        return [2 /*return*/];
    });
}); });
// Get role by ID
router.get('/roles/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_3, roleId_1, role, userRoleAssignment_3, userRole;
    return __generator(this, function (_a) {
        try {
            userId_3 = (0, auth_js_1.extractUserId)(req);
            if (!userId_3) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            roleId_1 = req.params.id;
            role = mockRoles.find(function (r) { return r.id === roleId_1; });
            if (!role) {
                return [2 /*return*/, res.status(404).json({ error: 'Role not found' })];
            }
            userRoleAssignment_3 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === userId_3; });
            if (!userRoleAssignment_3) {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: No role assigned' })];
            }
            userRole = mockRoles.find(function (r) { return r.id === userRoleAssignment_3.roleId; });
            if (!userRole || userRole.name !== 'admin') {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: Insufficient permissions' })];
            }
            res.json(role);
        }
        catch (error) {
            console.error('Error fetching role:', error);
            res.status(500).json({ error: 'Failed to fetch role' });
        }
        return [2 /*return*/];
    });
}); });
// Get user's role
router.get('/users/:id/role', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_4, targetUserId_1, userRoleAssignment_4, userRole, userRoleAssignment_5, role;
    return __generator(this, function (_a) {
        try {
            userId_4 = (0, auth_js_1.extractUserId)(req);
            if (!userId_4) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            targetUserId_1 = req.params.id;
            // Only admin can view other users' roles
            if (userId_4 !== targetUserId_1) {
                userRoleAssignment_4 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === userId_4; });
                if (!userRoleAssignment_4) {
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden: No role assigned' })];
                }
                userRole = mockRoles.find(function (role) { return role.id === userRoleAssignment_4.roleId; });
                if (!userRole || userRole.name !== 'admin') {
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden: Insufficient permissions' })];
                }
            }
            userRoleAssignment_5 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === targetUserId_1; });
            if (!userRoleAssignment_5) {
                return [2 /*return*/, res.status(404).json({ error: 'Role assignment not found' })];
            }
            role = mockRoles.find(function (role) { return role.id === userRoleAssignment_5.roleId; });
            if (!role) {
                return [2 /*return*/, res.status(404).json({ error: 'Role not found' })];
            }
            res.json({
                userId: targetUserId_1,
                role: role,
                assignedAt: userRoleAssignment_5.assignedAt,
                assignedBy: userRoleAssignment_5.assignedBy,
                expiresAt: userRoleAssignment_5.expiresAt
            });
        }
        catch (error) {
            console.error('Error fetching user role:', error);
            res.status(500).json({ error: 'Failed to fetch user role' });
        }
        return [2 /*return*/];
    });
}); });
// Assign role to user
router.post('/users/:id/role', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminId_1, adminRoleAssignment_1, adminRole, targetUserId_2, _a, roleId_2, expiresAt, role, existingAssignmentIndex, assignment;
    return __generator(this, function (_b) {
        try {
            adminId_1 = (0, auth_js_1.extractUserId)(req);
            if (!adminId_1) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            adminRoleAssignment_1 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === adminId_1; });
            if (!adminRoleAssignment_1) {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: No role assigned' })];
            }
            adminRole = mockRoles.find(function (role) { return role.id === adminRoleAssignment_1.roleId; });
            if (!adminRole || adminRole.name !== 'admin') {
                return [2 /*return*/, res.status(403).json({ error: 'Forbidden: Insufficient permissions' })];
            }
            targetUserId_2 = req.params.id;
            _a = req.body, roleId_2 = _a.roleId, expiresAt = _a.expiresAt;
            if (!roleId_2) {
                return [2 /*return*/, res.status(400).json({ error: 'Role ID is required' })];
            }
            role = mockRoles.find(function (r) { return r.id === roleId_2; });
            if (!role) {
                return [2 /*return*/, res.status(404).json({ error: 'Role not found' })];
            }
            existingAssignmentIndex = mockUserRoleAssignments.findIndex(function (assignment) { return assignment.userId === targetUserId_2; });
            assignment = {
                userId: targetUserId_2,
                roleId: roleId_2,
                assignedAt: new Date().toISOString(),
                assignedBy: adminId_1,
                expiresAt: expiresAt
            };
            if (existingAssignmentIndex >= 0) {
                // Update existing assignment
                mockUserRoleAssignments[existingAssignmentIndex] = assignment;
            }
            else {
                // Create new assignment
                mockUserRoleAssignments.push(assignment);
            }
            res.status(200).json({
                userId: targetUserId_2,
                role: role,
                assignedAt: assignment.assignedAt,
                assignedBy: assignment.assignedBy,
                expiresAt: assignment.expiresAt
            });
        }
        catch (error) {
            console.error('Error assigning role:', error);
            res.status(500).json({ error: 'Failed to assign role' });
        }
        return [2 /*return*/];
    });
}); });
// Check if user has specific permission
router.get('/users/:id/has-permission/:permissionName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_5, targetUserId_3, permissionName_1, userRoleAssignment_6, userRole, userRoleAssignment_7, role, permission, hasPermission;
    return __generator(this, function (_a) {
        try {
            userId_5 = (0, auth_js_1.extractUserId)(req);
            if (!userId_5) {
                return [2 /*return*/, res.status(401).json({ error: 'Authentication required' })];
            }
            targetUserId_3 = req.params.id;
            permissionName_1 = req.params.permissionName;
            // Only admin or the user themselves can check permissions
            if (userId_5 !== targetUserId_3) {
                userRoleAssignment_6 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === userId_5; });
                if (!userRoleAssignment_6) {
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden: No role assigned' })];
                }
                userRole = mockRoles.find(function (role) { return role.id === userRoleAssignment_6.roleId; });
                if (!userRole || userRole.name !== 'admin') {
                    return [2 /*return*/, res.status(403).json({ error: 'Forbidden: Insufficient permissions' })];
                }
            }
            userRoleAssignment_7 = mockUserRoleAssignments.find(function (assignment) { return assignment.userId === targetUserId_3; });
            if (!userRoleAssignment_7) {
                return [2 /*return*/, res.json({ hasPermission: false })];
            }
            role = mockRoles.find(function (role) { return role.id === userRoleAssignment_7.roleId; });
            if (!role) {
                return [2 /*return*/, res.json({ hasPermission: false })];
            }
            permission = mockPermissions.find(function (p) { return p.name === permissionName_1; });
            if (!permission) {
                return [2 /*return*/, res.status(404).json({ error: 'Permission not found' })];
            }
            hasPermission = role.permissions.includes(permission.id);
            res.json({ hasPermission: hasPermission });
        }
        catch (error) {
            console.error('Error checking permission:', error);
            res.status(500).json({ error: 'Failed to check permission' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
