import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const generateSeedUsers = async () => {
  const testPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const premiumPasswordHash = await bcrypt.hash('premium123', 10);
  const managerPasswordHash = await bcrypt.hash('password123', 10);
  const agentPasswordHash = await bcrypt.hash('agent123', 10);
  
  return [
    {
      id: uuidv4(),
      name: 'Test User',
      email: 'test@southwestvacations.com',
      password: 'password123', // Plain text for demo purposes
      passwordHash: testPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      isEmployee: false,
      isManager: false,
      role: 'user',
      membershipLevel: 'Bronze',
      managedBy: null, // Regular user not managed by anyone
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: false
      }
    },
    {
      id: uuidv4(),
      name: 'Manager Account',
      email: 'manager@southwestvacations.com',
      password: 'password123', // Plain text for demo purposes
      passwordHash: managerPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      isEmployee: true,
      isManager: true,
      role: 'manager',
      membershipLevel: 'Gold',
      managedUsers: [], // Will be populated later with user IDs
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: true
      }
    },
    {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@southwestvacations.com',
      password: 'admin123', // Plain text for demo purposes
      passwordHash: adminPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: true,
      isEmployee: true,
      isManager: false,
      role: 'admin',
      membershipLevel: 'Platinum',
      systemAdmin: true, // SAAS administrator with full system access
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: true
      }
    },
    {
      id: uuidv4(),
      name: 'Premium User',
      email: 'premium@southwestvacations.com',
      password: 'premium123', // Plain text for demo purposes
      passwordHash: premiumPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      isEmployee: false,
      isManager: false,
      role: 'user',
      membershipLevel: 'Platinum',
      managedBy: null, // Regular user not managed by anyone
      preferences: {
        notifications: true,
        newsletter: false,
        marketing: false
      }
    },
    {
      id: uuidv4(),
      name: 'Booking Agent',
      email: 'agent@southwestvacations.com',
      password: 'agent123', // Plain text for demo purposes
      passwordHash: agentPasswordHash,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      isEmployee: true,
      isManager: false,
      role: 'agent',
      membershipLevel: 'Gold',
      managedBy: null, // Not managed by anyone but not a manager either
      preferences: {
        notifications: true,
        newsletter: true,
        marketing: true
      }
    }
  ];
}; 