import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch the user profile
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('You must be logged in to view this page');
          navigate('/login');
          return;
        }
        
        const userResponse = await axios.get('http://localhost:4000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(userResponse.data);
        
        // Fetch user's bookings
        const bookingsResponse = await axios.get('http://localhost:4000/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setBookings(bookingsResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        {user && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm bg-blue-100 text-blue-800 rounded-full px-3 py-1 mt-2 inline-block">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-gray-500">Member Since</p>
                <p>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Login</p>
                <p>{user.lastLogin ? formatDate(user.lastLogin) : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-gray-500">Start exploring destinations and book your next adventure.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/book')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Book a Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    Booking #{booking.id.substring(0, 8)}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">
                    {booking.destination || 'Destination'}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Departure</p>
                      <p className="text-sm font-medium">{formatDate(booking.departureDate)}</p>
                    </div>
                    {booking.returnDate && (
                      <div>
                        <p className="text-xs text-gray-500">Return</p>
                        <p className="text-sm font-medium">{formatDate(booking.returnDate)}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="border-t px-4 py-3 bg-gray-50">
                  <button
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                    className="w-full flex justify-center items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 