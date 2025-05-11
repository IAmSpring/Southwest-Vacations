import { TwoFactorSetup, TwoFactorMethod } from '../sharedTypes';

const API_URL = '/api/two-factor';

// Get 2FA setup for the current user
export const getTwoFactorSetup = async (): Promise<TwoFactorSetup> => {
  try {
    const response = await fetch(`${API_URL}/setup`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch 2FA setup');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching 2FA setup:', error);
    throw error;
  }
};

// Update 2FA setup
export const updateTwoFactorSetup = async (data: {
  isEnabled: boolean;
  preferredMethod: TwoFactorMethod;
  phone?: string;
}): Promise<TwoFactorSetup> => {
  try {
    const response = await fetch(`${API_URL}/setup`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update 2FA setup');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating 2FA setup:', error);
    throw error;
  }
};

// Send verification code
export const sendVerificationCode = async (): Promise<{
  success: boolean;
  method: TwoFactorMethod;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/send-code`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to send verification code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

// Verify code
export const verifyCode = async (
  code: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/verify-code`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

// Verify backup code
export const verifyBackupCode = async (
  code: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/verify-backup-code`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify backup code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying backup code:', error);
    throw error;
  }
};

// Generate new backup codes
export const generateBackupCodes = async (): Promise<{
  success: boolean;
  backupCodes: string[];
}> => {
  try {
    const response = await fetch(`${API_URL}/generate-backup-codes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate backup codes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating backup codes:', error);
    throw error;
  }
};

// Disable 2FA
export const disableTwoFactor = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/disable`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to disable 2FA');
    }

    return await response.json();
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    throw error;
  }
};
