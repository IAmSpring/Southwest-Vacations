import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getUserAnalytics,
  getRecentBookings,
} from '../controllers/admin.js';
import { requireAdmin } from '../middlewares/auth.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', getAdminStats);

// Get all users
router.get('/users', getAllUsers);

// Create a new user (admin only)
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate role
    const validRoles = ['user', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      isAdmin: role === 'admin',
      role,
    };

    // Add user to database
    db.data.users.push(newUser);
    await db.write();

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user (admin only)
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, role } = req.body;

    // Find user
    const userIndex = db.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (username) db.data.users[userIndex].username = username;
    if (email) db.data.users[userIndex].email = email;

    if (role) {
      // Validate role
      const validRoles = ['user', 'manager', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      db.data.users[userIndex].role = role;
      db.data.users[userIndex].isAdmin = role === 'admin';
    }

    await db.write();

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = db.data.users[userIndex];

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Reset user password (admin only)
router.post('/users/:userId/reset-password', async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    // Find user
    const userIndex = db.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If no new password provided, generate a temporary one
    const password = newPassword || 'TemporaryPassword123';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password
    db.data.users[userIndex].passwordHash = passwordHash;
    await db.write();

    res.json({
      success: true,
      message: 'Password reset successfully',
      temporaryPassword: newPassword ? undefined : password,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Delete a user (admin only)
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const userIndex = db.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove user
    db.data.users.splice(userIndex, 1);
    await db.write();

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user analytics
router.get('/analytics/users', getUserAnalytics);

// Get recent bookings
router.get('/bookings/recent', getRecentBookings);

export default router;
