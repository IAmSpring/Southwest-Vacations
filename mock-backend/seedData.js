import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const generateSeedUsers = async () => {
  const testPasswordHash = await bcrypt.hash('Password123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin123', 10);
  
  return [
    {
      id: uuidv4(),
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: testPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      role: 'agent'
    },
    {
      id: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      role: 'admin'
    }
  ];
}; 