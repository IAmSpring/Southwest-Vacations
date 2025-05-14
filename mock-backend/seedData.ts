// Add test users to the database
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../src/sharedTypes.js';

export const generateSeedUsers = async (): Promise<User[]> => {
  // Generate hashed passwords
  const regularPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  return [
    {
      id: uuidv4(),
      username: 'testuser',
      email: 'test@southwestvacations.com',
      passwordHash: regularPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      role: 'user',
    },
    {
      id: uuidv4(),
      username: 'manager',
      email: 'manager@southwestvacations.com',
      passwordHash: regularPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      role: 'manager',
    },
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@southwestvacations.com',
      passwordHash: adminPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      role: 'admin',
    },
  ];
};
