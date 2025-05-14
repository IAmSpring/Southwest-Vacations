import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TripDetailPage from './pages/TripDetailPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import BookingsPage from './pages/BookingsPage';
import BookingsManagementPage from './pages/BookingsManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import CorporatePage from './pages/CorporatePage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import TrainingPortalPage from './pages/TrainingPortalPage';
import CourseStudyPage from './pages/CourseStudyPage';
import PoliciesPage from './pages/PoliciesPage';
import PolicyPage from './pages/PolicyPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import NotificationPreferencesPage from './pages/NotificationPreferencesPage';
import CheckoutPage from './pages/CheckoutPage';
import MultiPassengerBookingPage from './pages/MultiPassengerBookingPage';
import SystemCheck from './components/SystemCheck';
import TestVisualizationPage from './pages/TestVisualizationPage';
import StartupPage from './pages/StartupPage';
import PromotionsPage from './pages/PromotionsPage';
import AIDPage from './pages/AIDPage';
import SystemHealthPage from './pages/SystemHealthPage';
import TripsPage from './pages/TripsPage';

const LOCAL_STORAGE_KEY = 'swv_app_initialized';

const AppRoutes: React.FC = () => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage to see if the app has been initialized before
    const appInitialized = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
    setHasInitialized(appInitialized);
    setIsLoading(false);

    // Set initialized flag for future visits
    if (!appInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    }
  }, []);

  // Show loading state while checking initialization
  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {/* Startup page - only show on first visit or when explicitly accessed */}
      <Route
        path="/"
        element={hasInitialized ? <Navigate to="/home" replace /> : <StartupPage />}
      />

      {/* System initialization page - can be accessed explicitly */}
      <Route path="/system-init" element={<StartupPage />} />

      {/* Main application routes */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/trip/:id" element={<TripDetailPage />} />
      <Route path="/trips" element={<TripsPage />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/bookings/manage" element={<BookingsManagementPage />} />
      <Route path="/bookings/:id/edit" element={<BookingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/corporate" element={<CorporatePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/multi-passenger-booking/:tripId" element={<MultiPassengerBookingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/training" element={<TrainingPortalPage />} />
      <Route path="/training/course/:courseId" element={<CourseStudyPage />} />
      <Route path="/policies" element={<PoliciesPage />} />
      <Route path="/policies/:policyId" element={<PolicyPage />} />
      <Route path="/announcements" element={<AnnouncementsPage />} />
      <Route path="/analytics" element={<AnalyticsDashboardPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/preferences" element={<NotificationPreferencesPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/system-check" element={<SystemCheck />} />
      <Route path="/system-health" element={<SystemHealthPage />} />
      <Route path="/test-visualization" element={<TestVisualizationPage />} />
      <Route path="/aid" element={<AIDPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
