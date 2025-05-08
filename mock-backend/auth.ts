import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../src/sharedTypes.js';
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

// Secret key for JWT token signing
const JWT_SECRET = process.env.JWT_SECRET || 'southwest-vacations-secret-key';

// Register a new user
export const registerUser = async (username: string, email: string, password: string): Promise<User | null> => {
  // Check if user exists
  const existingUser = db.get('users')
    .find({ email })
    .value() as User | undefined;
  
  if (existingUser) {
    return null;
  }
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  
  // Create new user
  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  
  // Save to database
  db.get('users')
    .push(newUser)
    .write();
    
  return newUser;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<string | null> => {
  // Find user
  const user = db.get('users')
    .find({ email })
    .value() as User | undefined;
    
  if (!user) {
    return null;
  }
  
  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  
  if (!isMatch) {
    return null;
  }
  
  // Update last login
  db.get('users')
    .find({ id: user.id })
    .assign({ lastLoginAt: new Date().toISOString() })
    .write();
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return token;
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return db.get('users')
    .find({ id })
    .value() as User | undefined;
};

// Helper to extract user ID from request
export const extractUserId = (req: any): string | null => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    const decoded = verifyToken(token);
    return decoded?.id || null;
  } catch (error) {
    return null;
  }
}; 