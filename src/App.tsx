import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Header from './components/Header';
import Footer from './components/Footer';
import SystemCheck from './components/SystemCheck';
import { NotificationProvider } from './context/NotificationContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trip/:id" element={<TripDetailPage />} />
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
            <Route path="/search" element={<SearchPage />} />
            <Route path="/training" element={<TrainingPortalPage />} />
            <Route path="/training/course/:courseId" element={<CourseStudyPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/policies/:policyId" element={<PolicyPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/preferences" element={<NotificationPreferencesPage />} />
            <Route path="/system-check" element={<SystemCheck />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </NotificationProvider>
  );
};

export default App;
