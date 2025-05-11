import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractUserId } from '../auth.js';
import { TwoFactorSetup, TwoFactorMethod } from '../../src/sharedTypes.js';

const router = express.Router();

// Mock 2FA setup data
const mockTwoFactorSetups: TwoFactorSetup[] = [
  {
    userId: '1',
    isEnabled: true,
    preferredMethod: 'email',
    backupCodes: ['123456', '234567', '345678', '456789', '567890'],
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    userId: '2',
    isEnabled: false,
    preferredMethod: 'sms',
    phone: '+1234567890',
    lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock verification codes
const verificationCodes: Map<string, { code: string; expires: Date }> = new Map();

// Get 2FA setup for a user
router.get('/setup', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const setup = mockTwoFactorSetups.find(s => s.userId === userId);

    if (!setup) {
      // If no setup exists, return a default one
      return res.json({
        userId,
        isEnabled: false,
        preferredMethod: 'email' as TwoFactorMethod,
        lastUpdated: new Date().toISOString(),
      });
    }

    res.json(setup);
  } catch (error) {
    console.error('Error fetching 2FA setup:', error);
    res.status(500).json({ error: 'Failed to fetch 2FA setup' });
  }
});

// Update 2FA setup
router.put('/setup', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { isEnabled, preferredMethod, phone } = req.body;

    // Validate inputs
    if (
      preferredMethod !== 'email' &&
      preferredMethod !== 'sms' &&
      preferredMethod !== 'authenticator'
    ) {
      return res.status(400).json({ error: 'Invalid preferred method' });
    }

    if (preferredMethod === 'sms' && !phone) {
      return res.status(400).json({ error: 'Phone number is required for SMS method' });
    }

    // Find existing setup or create a new one
    const existingSetupIndex = mockTwoFactorSetups.findIndex(s => s.userId === userId);

    // Generate new backup codes if enabling 2FA
    const backupCodes = isEnabled
      ? Array.from({ length: 5 }, () => Math.floor(100000 + Math.random() * 900000).toString())
      : undefined;

    const updatedSetup: TwoFactorSetup = {
      userId,
      isEnabled: isEnabled === true,
      preferredMethod,
      phone: preferredMethod === 'sms' ? phone : undefined,
      backupCodes:
        backupCodes ||
        (existingSetupIndex >= 0 ? mockTwoFactorSetups[existingSetupIndex].backupCodes : undefined),
      lastUpdated: new Date().toISOString(),
    };

    if (existingSetupIndex >= 0) {
      // Update existing setup
      mockTwoFactorSetups[existingSetupIndex] = updatedSetup;
    } else {
      // Create new setup
      mockTwoFactorSetups.push(updatedSetup);
    }

    res.json(updatedSetup);
  } catch (error) {
    console.error('Error updating 2FA setup:', error);
    res.status(500).json({ error: 'Failed to update 2FA setup' });
  }
});

// Send verification code
router.post('/send-code', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const setup = mockTwoFactorSetups.find(s => s.userId === userId);

    if (!setup || !setup.isEnabled) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    // Generate a new verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiration (5 minutes from now)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    verificationCodes.set(userId, { code, expires });

    // In a real application, this would send an email or SMS
    // For this mock, we'll just return a success message

    res.json({
      success: true,
      method: setup.preferredMethod,
      message: `Verification code sent via ${setup.preferredMethod}`,
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify code
router.post('/verify-code', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Verification code is required' });
    }

    const storedCode = verificationCodes.get(userId);

    if (!storedCode) {
      return res.status(400).json({ error: 'No verification code was requested' });
    }

    // Check if code has expired
    if (new Date() > storedCode.expires) {
      verificationCodes.delete(userId);
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Check if code matches
    if (storedCode.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Code is valid, clear it from storage
    verificationCodes.delete(userId);

    // Create a token that indicates 2FA is verified
    // In a real application, this would generate a token or update the user's session

    res.json({ success: true, message: 'Verification successful' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// Verify backup code
router.post('/verify-backup-code', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Backup code is required' });
    }

    const setup = mockTwoFactorSetups.find(s => s.userId === userId);

    if (!setup || !setup.isEnabled) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    if (!setup.backupCodes || !setup.backupCodes.includes(code)) {
      return res.status(400).json({ error: 'Invalid backup code' });
    }

    // Remove the used backup code
    const updatedBackupCodes = setup.backupCodes.filter(c => c !== code);

    // Update the setup
    const setupIndex = mockTwoFactorSetups.findIndex(s => s.userId === userId);
    mockTwoFactorSetups[setupIndex].backupCodes = updatedBackupCodes;

    // In a real application, this would generate a token or update the user's session

    res.json({ success: true, message: 'Backup code verification successful' });
  } catch (error) {
    console.error('Error verifying backup code:', error);
    res.status(500).json({ error: 'Failed to verify backup code' });
  }
});

// Generate new backup codes
router.post('/generate-backup-codes', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const setup = mockTwoFactorSetups.find(s => s.userId === userId);

    if (!setup || !setup.isEnabled) {
      return res.status(400).json({ error: '2FA is not enabled for this user' });
    }

    // Generate new backup codes
    const newBackupCodes = Array.from({ length: 5 }, () =>
      Math.floor(100000 + Math.random() * 900000).toString()
    );

    // Update the setup
    const setupIndex = mockTwoFactorSetups.findIndex(s => s.userId === userId);
    mockTwoFactorSetups[setupIndex].backupCodes = newBackupCodes;
    mockTwoFactorSetups[setupIndex].lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      backupCodes: newBackupCodes,
    });
  } catch (error) {
    console.error('Error generating backup codes:', error);
    res.status(500).json({ error: 'Failed to generate backup codes' });
  }
});

// Disable 2FA
router.post('/disable', async (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const setup = mockTwoFactorSetups.find(s => s.userId === userId);

    if (!setup) {
      return res.status(400).json({ error: '2FA setup not found' });
    }

    if (!setup.isEnabled) {
      return res.status(400).json({ error: '2FA is already disabled' });
    }

    // Disable 2FA
    const setupIndex = mockTwoFactorSetups.findIndex(s => s.userId === userId);
    mockTwoFactorSetups[setupIndex].isEnabled = false;
    mockTwoFactorSetups[setupIndex].lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      message: '2FA has been disabled',
    });
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

export default router;
