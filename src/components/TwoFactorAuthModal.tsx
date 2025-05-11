import React, { useState } from 'react';
import authService from '../services/authService';

interface TwoFactorAuthModalProps {
  onComplete: (success: boolean) => void;
  onCancel: () => void;
  action: string;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({
  onComplete,
  onCancel,
  action,
}) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle code input change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await authService.validateTwoFactor(code);

      if (success) {
        onComplete(true);
      } else {
        setError('Invalid verification code. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Two-factor authentication error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Security Verification</h2>

        <p className="mb-4 text-gray-700">
          For your security, we need to verify your identity before you can {action}.
        </p>

        <p className="mb-6 text-gray-700">
          Please enter the verification code from your authenticator app.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="verification-code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <input
              id="verification-code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              className="w-full rounded border p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter 6-digit code"
              autoComplete="one-time-code"
              maxLength={6}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded bg-gray-200 px-4 py-2 text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
