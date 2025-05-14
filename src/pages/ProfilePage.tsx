import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  isAdmin?: boolean;
  isManager?: boolean;
  membershipLevel?: string;
  memberSince?: string;
  loyaltyPoints?: number;
  preferredAirport?: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    marketing: boolean;
  };
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        if (user) {
          // In a real app, this would make an API call to get the full profile
          // For demo, we'll create a mock profile based on the user type
          let profile: UserProfile;

          if (user.email.includes('admin')) {
            profile = {
              id: user.id,
              username: user.username || 'System Administrator',
              email: user.email,
              isAdmin: true,
              membershipLevel: 'Diamond',
              memberSince: '2019-06-15',
              loyaltyPoints: 75000,
              preferredAirport: 'DFW',
              preferences: {
                notifications: true,
                newsletter: true,
                marketing: false,
              },
            };
          } else if (user.email.includes('manager')) {
            profile = {
              id: user.id,
              username: user.username || 'Manager User',
              email: user.email,
              isManager: true,
              membershipLevel: 'Platinum',
              memberSince: '2020-03-22',
              loyaltyPoints: 45000,
              preferredAirport: 'LAX',
              preferences: {
                notifications: true,
                newsletter: true,
                marketing: true,
              },
            };
          } else {
            profile = {
              id: user.id,
              username: user.username || 'Regular User',
              email: user.email,
              membershipLevel: 'Gold',
              memberSince: '2021-10-08',
              loyaltyPoints: 25000,
              preferredAirport: 'MIA',
              preferences: {
                notifications: true,
                newsletter: false,
                marketing: false,
              },
            };
          }

          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-red-100 p-4 text-red-700">
          <p>Error loading profile data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white shadow-lg">
        <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-700">
              {userProfile.username
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userProfile.username}</h1>
              <p className="text-blue-200">{userProfile.email}</p>
              {userProfile.isAdmin && (
                <span className="mt-2 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-medium">
                  Administrator
                </span>
              )}
              {userProfile.isManager && (
                <span className="mt-2 inline-block rounded-full bg-green-500 px-3 py-1 text-xs font-medium">
                  Manager
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start space-y-2 md:items-end">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">{userProfile.membershipLevel} Member</span>
              {userProfile.membershipLevel === 'Diamond' && (
                <svg className="h-6 w-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="text-blue-200">
              Member since {new Date(userProfile.memberSince || '').toLocaleDateString()}
            </p>
            <p className="text-xl font-semibold text-yellow-300">
              {userProfile.loyaltyPoints?.toLocaleString()} Loyalty Points
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-600">User ID:</span>
              <span className="text-gray-800">{userProfile.id}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-600">Email:</span>
              <span className="text-gray-800">{userProfile.email}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-600">Membership Level:</span>
              <span className="text-gray-800">{userProfile.membershipLevel}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-medium text-gray-600">Preferred Airport:</span>
              <span className="text-gray-800">{userProfile.preferredAirport}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Account Type:</span>
              <span className="text-gray-800">
                {userProfile.isAdmin
                  ? 'Administrator'
                  : userProfile.isManager
                    ? 'Manager'
                    : 'Standard User'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Email Notifications:</span>
              <div
                className={`h-6 w-12 rounded-full ${userProfile.preferences?.notifications ? 'bg-green-500' : 'bg-gray-300'} p-1`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${userProfile.preferences?.notifications ? 'translate-x-6' : 'translate-x-0'}`}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Newsletter Subscription:</span>
              <div
                className={`h-6 w-12 rounded-full ${userProfile.preferences?.newsletter ? 'bg-green-500' : 'bg-gray-300'} p-1`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${userProfile.preferences?.newsletter ? 'translate-x-6' : 'translate-x-0'}`}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Marketing Communications:</span>
              <div
                className={`h-6 w-12 rounded-full ${userProfile.preferences?.marketing ? 'bg-green-500' : 'bg-gray-300'} p-1`}
              >
                <div
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${userProfile.preferences?.marketing ? 'translate-x-6' : 'translate-x-0'}`}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition-colors hover:bg-blue-700">
              Update Preferences
            </button>
          </div>
        </div>
      </div>

      {userProfile.isAdmin && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Administrator Tools</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </div>

            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">System Analytics</h3>
              <p className="text-sm text-gray-600">View system performance metrics</p>
            </div>

            <div className="rounded-lg bg-green-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">System Configuration</h3>
              <p className="text-sm text-gray-600">Configure system settings</p>
            </div>
          </div>
        </div>
      )}

      {userProfile.isManager && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Manager Tools</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg bg-indigo-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Team Management</h3>
              <p className="text-sm text-gray-600">Manage team members and assignments</p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Reports</h3>
              <p className="text-sm text-gray-600">Access department reports and analytics</p>
            </div>

            <div className="rounded-lg bg-red-50 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Issue Management</h3>
              <p className="text-sm text-gray-600">Manage customer issues and escalations</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Recent Activity</h2>
        {/* Recent activity would typically come from an API */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Updated profile information</p>
              <p className="text-sm text-gray-500">Yesterday at 2:30 PM</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Earned 500 loyalty points</p>
              <p className="text-sm text-gray-500">3 days ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Booked trip to Las Vegas</p>
              <p className="text-sm text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
