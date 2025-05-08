// Add test users to the database
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../src/sharedTypes.js';

export const generateSeedUsers = async (): Promise<User[]> => {
  // Generate hashed passwords
  const testPasswordHash = await bcrypt.hash('Password123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin123', 10);
  
  return [
    {
      id: uuidv4(),
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: testPasswordHash,
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: true,
    }
  ];
}; 