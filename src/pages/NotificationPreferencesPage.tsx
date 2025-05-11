import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { NotificationPreference } from '../sharedTypes';

const NotificationPreferencesPage: React.FC = () => {
  const { preferences, updatePreferences } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<NotificationPreference>({
    userId: '',
    emailEnabled: true,
    inAppEnabled: true,
    categories: {
      booking: true,
      system: true,
      policy: true,
      promotion: true,
      training: true,
    },
    emailFrequency: 'daily',
  });

  // Update form when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setFormData({
        ...preferences,
        categories: { ...preferences.categories },
      });
    }
  }, [preferences]);

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested values (categories)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, boolean>),
          [child]: checked,
        },
      }));
    } else {
      // Handle top-level values
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value as 'immediate' | 'daily' | 'weekly',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updatePreferences(formData);
      setSuccessMessage('Notification preferences updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Link to="/notifications" className="text-blue-600 hover:text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold">Notification Preferences</h1>
        </div>
        <p className="text-gray-600">Customize how and when you receive notifications</p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">General Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="emailEnabled"
                  className="peer sr-only"
                  checked={formData.emailEnabled}
                  onChange={handleToggleChange}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium">In-App Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications in the app</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="inAppEnabled"
                  className="peer sr-only"
                  checked={formData.inAppEnabled}
                  onChange={handleToggleChange}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Email Frequency</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="frequency-immediate"
                type="radio"
                name="emailFrequency"
                value="immediate"
                checked={formData.emailFrequency === 'immediate'}
                onChange={handleRadioChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="frequency-immediate" className="ml-2 block">
                <span className="text-sm font-medium text-gray-900">Immediate</span>
                <span className="block text-xs text-gray-500">
                  Send emails as notifications occur
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="frequency-daily"
                type="radio"
                name="emailFrequency"
                value="daily"
                checked={formData.emailFrequency === 'daily'}
                onChange={handleRadioChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="frequency-daily" className="ml-2 block">
                <span className="text-sm font-medium text-gray-900">Daily Digest</span>
                <span className="block text-xs text-gray-500">
                  Send a daily summary of notifications
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="frequency-weekly"
                type="radio"
                name="emailFrequency"
                value="weekly"
                checked={formData.emailFrequency === 'weekly'}
                onChange={handleRadioChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="frequency-weekly" className="ml-2 block">
                <span className="text-sm font-medium text-gray-900">Weekly Digest</span>
                <span className="block text-xs text-gray-500">
                  Send a weekly summary of notifications
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Notification Categories</h2>
          <p className="mb-4 text-sm text-gray-500">
            Select which types of notifications you want to receive
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                  ✈️
                </span>
                <label htmlFor="category-booking" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-900">Booking Updates</span>
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="category-booking"
                  name="categories.booking"
                  className="peer sr-only"
                  checked={formData.categories.booking}
                  onChange={handleToggleChange}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  🔧
                </span>
                <label htmlFor="category-system" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-900">System Updates</span>
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="category-system"
                  name="categories.system"
                  className="peer sr-only"
                  checked={formData.categories.system}
                  onChange={handleToggleChange}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
                  📝
                </span>
                <label htmlFor="category-policy" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-900">Policy Updates</span>
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="category-policy"
                  name="categories.policy"
                  className="peer sr-only"
                  checked={formData.categories.policy}
                  onChange={handleToggleChange}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-500">
                  🏷️
                </span>
                <label htmlFor="category-promotion" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-900">Promotions</span>
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="category-promotion"
                  name="categories.promotion"
                  className="peer sr-only"
                  checked={formData.categories.promotion}
                  onChange={handleToggleChange}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div className="flex items-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-500">
                  📚
                </span>
                <label htmlFor="category-training" className="ml-3 block">
                  <span className="text-sm font-medium text-gray-900">Training Updates</span>
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  id="category-training"
                  name="categories.training"
                  className="peer sr-only"
                  checked={formData.categories.training}
                  onChange={handleToggleChange}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationPreferencesPage;
