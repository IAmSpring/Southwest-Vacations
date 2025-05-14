import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

// Secret key for JWT token signing
const JWT_SECRET = process.env.JWT_SECRET || 'southwest-vacations-secret-key';

// Register a new user
export const registerUser = async (name, email, password) => {
  await db.read();
  const existingUser = db.data.users.find(user => user.email === email);

  if (existingUser) {
    return null;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: uuidv4(),
    name: name,
    email: email,
    password: password, // Store plain text for demo
    passwordHash: passwordHash, // Store hash for production use
    role: 'user',
    isEmployee: false,
    createdAt: new Date().toISOString(),
    membershipLevel: 'Bronze',
    preferences: {
      notifications: true,
      newsletter: true,
      marketing: false
    }
  };

  // Save to database
  db.data.users.push(newUser);
  await db.write();

  return newUser;
};

// Login user
export const loginUser = async (email, password) => {
  await db.read();
  const user = db.data.users.find(user => user.email === email);

  if (!user) {
    console.log(`Login failed: User not found for email ${email}`);
    return null;
  }

  // For demo purposes, we'll check both plaintext and hashed passwords
  const isPlainTextMatch = user.password === password;
  const isHashMatch = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!isPlainTextMatch && !isHashMatch) {
    console.log(`Login failed: Password mismatch for ${email}`);
    return null;
  }

  // Update last login
  const userIndex = db.data.users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    db.data.users[userIndex].lastLoginAt = new Date().toISOString();
    await db.write();
  }

  // Create token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Prepare user data to return (without sensitive fields)
  const { password: _, passwordHash: __, ...userInfo } = user;

  return {
    token,
    user: userInfo
  };
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  await db.read();
  return db.data.users.find(user => user.id === id);
};

// Helper to extract user ID from request
export const extractUserId = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    const decoded = verifyToken(token);
    return decoded?.id || null;
  } catch (error) {
    return null;
  }
}; 