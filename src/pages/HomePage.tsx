import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';
import Loading, {
  AnnouncementSkeleton,
  DashboardStatsSkeleton,
  ResourceCardSkeleton,
} from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import { Trip } from '../sharedTypes';

// Load animations after component mount to prevent initial render flicker
const AnimatedHeroBackground = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute left-0 top-0 z-0 h-full w-full overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Moving clouds effect */}
      <div className="absolute -left-[10%] -top-[30%] h-[70%] w-[70%] animate-float rounded-full bg-white opacity-10 blur-3xl filter"></div>
      <div
        className="absolute right-[5%] top-[20%] h-[30%] w-[30%] animate-float rounded-full bg-white opacity-5 blur-2xl filter"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* Animated shapes */}
      <div
        className="absolute bottom-[10%] left-[20%] h-32 w-32 animate-float rounded-full bg-[#FFBF27] opacity-20"
        style={{ animationDelay: '0.5s' }}
      ></div>
      <div className="absolute right-[20%] top-[30%] h-40 w-40 animate-morph bg-[#E31837] opacity-10"></div>
      <div
        className="absolute left-[40%] top-[50%] h-40 w-40 animate-float rounded-full bg-[#FFBF27] opacity-5"
        style={{ animationDelay: '2s' }}
      ></div>
    </div>
  );
};

// Animated wave divider
const WaveDivider = ({ className = '', inverted = false }) => (
  <div
    className={`absolute ${inverted ? 'bottom-0 rotate-180' : 'top-100'} left-0 w-full overflow-hidden leading-none ${className}`}
  >
    <svg
      className="relative block h-12 w-full sm:h-16 md:h-24"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        fill={inverted ? '#f9fafb' : 'white'}
        className="relative block h-full w-full"
      ></path>
    </svg>
  </div>
);

// Grid of skeleton loaders for trips
const TripCardSkeletons = ({ count = 6 }) => (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
    {Array(count)
      .fill(0)
      .map((_, index) => (
        <TripCard
          key={`skeleton-${index}`}
          trip={{ id: '', destination: '', imageUrl: '', price: 0 }}
          isLoading={true}
        />
      ))}
  </div>
);

// Quick Access Floating Toolbar
const QuickAccessToolbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-2">
        <div className="group relative">
          <button
            className="flex items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
            onClick={toggleMenu}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>
          <div className="absolute right-full mr-3 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            Quick Actions
          </div>
        </div>

        {showMenu && (
          <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="flex flex-col space-y-2">
              <a href="/book" className="flex items-center rounded-lg p-2 hover:bg-gray-100">
                <div className="mr-3 rounded-full bg-green-100 p-2">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">New Booking</span>
              </a>

              <a href="/search" className="flex items-center rounded-lg p-2 hover:bg-gray-100">
                <div className="mr-3 rounded-full bg-blue-100 p-2">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Search</span>
              </a>

              <a
                href="/bookings/manage"
                className="flex items-center rounded-lg p-2 hover:bg-gray-100"
              >
                <div className="mr-3 rounded-full bg-purple-100 p-2">
                  <svg
                    className="h-4 w-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Manage</span>
              </a>

              <a href="/analytics" className="flex items-center rounded-lg p-2 hover:bg-gray-100">
                <div className="mr-3 rounded-full bg-indigo-100 p-2">
                  <svg
                    className="h-4 w-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Analytics Dashboard</span>
              </a>

              <a href="/help" className="flex items-center rounded-lg p-2 hover:bg-gray-100">
                <div className="mr-3 rounded-full bg-yellow-100 p-2">
                  <svg
                    className="h-4 w-4 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Help</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { data: trips, isLoading, error } = useTrips();
  const [animatedItems, setAnimatedItems] = useState<Record<string, boolean>>({});
  const [popularDestinations, setPopularDestinations] = useState<Trip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Handle scroll-based animations
  useEffect(() => {
    const handleScroll = () => {
      const newAnimatedItems: Record<string, boolean> = { ...animatedItems };

      document.querySelectorAll('[data-scroll-animation]').forEach(element => {
        const id = element.getAttribute('id');
        if (!id) return;

        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;

        if (isVisible && !newAnimatedItems[id]) {
          newAnimatedItems[id] = true;
          setAnimatedItems(newAnimatedItems);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on component mount
    setTimeout(handleScroll, 300);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [animatedItems]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Instead of fetching from the API, use our mock data
        // const response = await fetch(`/api/trips?category=${selectedCategory}`);
        // const data = await response.json();

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Filter trips based on selected category
        let filteredDestinations = trips || [];
        if (selectedCategory !== 'all') {
          filteredDestinations = filteredDestinations.filter(
            trip => trip.category === selectedCategory
          );
        }

        setPopularDestinations(filteredDestinations);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [selectedCategory, trips]);

  const HeroSection = () => (
    <section className="relative mb-0 overflow-hidden bg-gradient-to-r from-[#304CB2] to-[#1a2a66] py-20 text-white md:py-32">
      <AnimatedHeroBackground />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="animate-slide-right text-left">
            <div className="mb-6 flex justify-start">
              <div className="flex h-12 w-12 rotate-45 transform animate-bounce-subtle items-center justify-center rounded-full bg-[#E31837]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#304CB2]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="h-5 w-5"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="relative mb-4 overflow-hidden text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              <span className="block">Travel Made</span>
              <span className="block text-[#FFBF27]">Simple</span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-blue-100 sm:text-xl">
              Explore breathtaking destinations with the Southwest Vacations experience.
              Unforgettable adventures with no hidden fees!
            </p>

            <div className="flex flex-wrap gap-4 space-x-4">
              <Link
                to="/book"
                className="group relative inline-block transform overflow-hidden rounded-full bg-[#FFBF27] px-8 py-3 text-base font-bold text-[#304CB2] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#F5B120] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FFBF27] focus:ring-opacity-50 sm:px-10 sm:py-4 sm:text-lg"
              >
                <span className="relative z-10">Find Your Adventure</span>
                <div className="absolute inset-0 h-full w-0 bg-gradient-to-r from-[#F5B120] to-[#FFBF27] transition-all duration-500 group-hover:w-full"></div>
              </Link>

              <Link
                to="/trips"
                className="inline-block rounded-full border-2 border-white bg-transparent px-6 py-3 text-base font-bold text-white transition-all duration-300 hover:border-[#FFBF27] hover:text-[#FFBF27] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 sm:px-8 sm:py-4 sm:text-lg"
              >
                View All Destinations
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative h-[400px] w-full animate-slide-left">
              <div className="absolute right-4 top-4 h-[85%] w-[85%] rotate-6 transform rounded-2xl bg-[#E31837] shadow-2xl">
                <img
                  src="/images/hero-placeholder.jpg"
                  alt="Travel destinations collage"
                  className="h-full w-full rounded-2xl object-cover opacity-60 mix-blend-overlay"
                  onError={e => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=2070';
                  }}
                />
              </div>
              <div className="absolute left-0 top-0 h-[85%] w-[85%] overflow-hidden rounded-2xl bg-white shadow-xl">
                <img
                  src="/images/hero-beach.jpg"
                  alt="Beautiful beach destination"
                  className="h-full w-full object-cover"
                  onError={e => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974';
                  }}
                />
              </div>
              <div className="absolute bottom-8 right-8 flex h-32 w-32 animate-bounce-subtle items-center justify-center rounded-full bg-[#FFBF27] shadow-lg">
                <div className="text-center text-lg font-extrabold text-[#304CB2]">
                  <span className="block text-sm">up to</span>
                  <span className="block text-3xl">40%</span>
                  <span className="block text-sm">SAVINGS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaveDivider />
    </section>
  );

  // Featured destinations banner with animated text
  const FeatureBanner = () => (
    <div className="relative mb-12 overflow-hidden bg-[#E31837] py-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[50%] w-[200%] rotate-180 animate-wave-slow bg-black/10"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="scrollbar-hide flex justify-center gap-6 overflow-x-auto whitespace-nowrap py-2 md:justify-start">
          <span className="flex items-center text-xl font-bold tracking-wide text-white">
            <span className="mr-2 animate-pulse">✦</span> FEATURED DESTINATIONS
          </span>
          <span className="hidden items-center text-xl font-bold tracking-wide text-white md:flex">
            <span className="mr-2 animate-pulse">✦</span> LOW FARES
          </span>
          <span className="hidden items-center text-xl font-bold tracking-wide text-white lg:flex">
            <span className="mr-2 animate-pulse">✦</span> VACATION PACKAGES
          </span>
          <span className="hidden items-center text-xl font-bold tracking-wide text-white xl:flex">
            <span className="mr-2 animate-pulse">✦</span> BOOK NOW
          </span>
        </div>
      </div>
    </div>
  );

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'beach', name: 'Beach' },
    { id: 'city', name: 'City' },
    { id: 'mountain', name: 'Mountain' },
    { id: 'family', name: 'Family-friendly' },
    { id: 'cruise', name: 'Cruise' },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Southwest Airlines Internal Portal Banner */}
        <div className="mb-8 border-l-4 border-blue-600 bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-medium text-gray-800">
                Southwest Airlines Internal Vacation Portal
              </h2>
              <p className="mt-1 text-sm text-gray-700">
                Welcome to the corporate travel management system. Access tools to create and manage
                customer vacation packages.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Dashboard Header */}
        <div className="mb-10 overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="mb-6 md:mb-0">
                <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  Southwest Vacations Booking System
                </h1>
                <p className="max-w-2xl text-blue-100">
                  Corporate portal for Southwest Airlines employees to manage vacation packages,
                  process bookings, and access travel resources for customers.
                </p>
              </div>
              <div className="flex space-x-4">
                {isLoading ? (
                  <>
                    <DashboardStatsSkeleton />
                    <DashboardStatsSkeleton />
                    <DashboardStatsSkeleton />
                  </>
                ) : (
                  <>
                    <div className="rounded-lg bg-white bg-opacity-10 p-4 text-center backdrop-blur-lg backdrop-filter">
                      <div className="text-2xl font-bold text-white">386</div>
                      <div className="text-xs text-blue-100">Active Bookings</div>
                    </div>
                    <div className="rounded-lg bg-white bg-opacity-10 p-4 text-center backdrop-blur-lg backdrop-filter">
                      <div className="text-2xl font-bold text-white">124</div>
                      <div className="text-xs text-blue-100">Today's Bookings</div>
                    </div>
                    <div className="rounded-lg bg-white bg-opacity-10 p-4 text-center backdrop-blur-lg backdrop-filter">
                      <div className="text-2xl font-bold text-white">43</div>
                      <div className="text-xs text-blue-100">New Destinations</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-3">
            <div className="text-sm text-blue-100">
              <span className="font-medium">Current System Status:</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                Operational
              </span>
            </div>
            <div className="flex items-center text-sm text-blue-100">
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Last updated: Today at 9:41 AM
            </div>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center space-x-2 rounded bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Schedule Demo</span>
          </button>
        </div>

        {/* Demo Modal */}
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Schedule a Demo</h3>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="mb-4 text-gray-600">
                Schedule a guided demonstration of the Southwest Vacations booking platform for your
                team.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Attendees
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Notes
                  </label>
                  <textarea className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Request Demo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Corporate Announcements */}
        <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="bg-red-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Important Announcements</h2>
          </div>
          <div className="divide-y p-6">
            {isLoading ? (
              <>
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
                <AnnouncementSkeleton />
              </>
            ) : (
              <>
                <div className="pb-4">
                  <div className="mb-2 flex items-center">
                    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-gray-800">New Cancellation Policy Update</h3>
                    <span className="ml-2 text-xs text-gray-500">Today</span>
                  </div>
                  <p className="pl-11 text-sm text-gray-600">
                    The updated cancellation policy for all vacation packages goes into effect on
                    July 1st. All bookings must adhere to the new guidelines.
                  </p>
                </div>

                <div className="py-4">
                  <div className="mb-2 flex items-center">
                    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-gray-800">System Maintenance Schedule</h3>
                    <span className="ml-2 text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="pl-11 text-sm text-gray-600">
                    The booking system will be down for scheduled maintenance on Sunday, June 30th
                    from 2:00 AM to 5:00 AM CDT. Please plan accordingly.
                  </p>
                </div>

                <div className="pt-4">
                  <div className="mb-2 flex items-center">
                    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                        />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-gray-800">Summer Promotions Now Available</h3>
                    <span className="ml-2 text-xs text-gray-500">1 week ago</span>
                  </div>
                  <p className="pl-11 text-sm text-gray-600">
                    New summer promotion codes have been added to the system. Use code SUMMER2023
                    for additional 15% off selected destinations.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="bg-gray-50 px-6 py-3 text-right">
            <Link to="/announcements" className="text-sm font-medium text-blue-600 hover:underline">
              View All Announcements
            </Link>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Corporate Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
            <Link
              to="/search"
              className="flex items-center rounded bg-gray-50 p-4 transition hover:bg-gray-100"
            >
              <div className="mr-4 rounded-full bg-blue-100 p-3">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Search Packages</h3>
                <p className="text-sm text-gray-600">Find vacation options</p>
              </div>
            </Link>

            <Link
              to="/bookings/manage"
              className="flex items-center rounded bg-gray-50 p-4 transition hover:bg-gray-100"
            >
              <div className="mr-4 rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Manage Reservations</h3>
                <p className="text-sm text-gray-600">Update customer bookings</p>
              </div>
            </Link>

            <Link
              to="/book"
              className="flex items-center rounded bg-gray-50 p-4 transition hover:bg-gray-100"
            >
              <div className="mr-4 rounded-full bg-purple-100 p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">New Booking</h3>
                <p className="text-sm text-gray-600">Create a reservation</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center rounded bg-gray-50 p-4 transition hover:bg-gray-100"
            >
              <div className="mr-4 rounded-full bg-indigo-100 p-3">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">View booking metrics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Advanced Search Section */}
        <div className="mb-12">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Vacation Package Search Tool</h2>
            <p className="mb-6 text-gray-600">
              Find available packages to offer customers through our internal booking system
            </p>
            <SearchBar />
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-12">
          <h2 className="mb-3 text-2xl font-bold">Featured Destinations</h2>
          <p className="mb-6 text-gray-600">
            Our most popular vacation packages based on recent customer bookings
          </p>

          <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } whitespace-nowrap transition`}
                data-testid={`category-${category.id}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <TripCardSkeletons count={6} />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {popularDestinations.map(destination => (
                <div
                  key={destination.id}
                  className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={destination.imageUrl}
                      alt={destination.destination}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute right-0 top-0 bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                      Trending
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{destination.destination}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">Customer satisfaction:</span>
                      <div className="ml-2 flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <svg
                            key={star}
                            className="h-4 w-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 font-bold text-blue-600">
                      ${destination.price.toLocaleString()} per person
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        to={`/trip/${destination.id}`}
                        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Package Details
                      </Link>
                      <Link
                        to={`/book?tripId=${destination.id}`}
                        className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                      >
                        Book for Customer
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Employee Resources */}
        <div className="mb-12 overflow-hidden rounded-lg bg-white shadow-md">
          <div className="border-b bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold">Southwest Vacations Agent Resources</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {isLoading ? (
                <>
                  <ResourceCardSkeleton />
                  <ResourceCardSkeleton />
                  <ResourceCardSkeleton />
                  <ResourceCardSkeleton />
                </>
              ) : (
                <>
                  <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                    <h3 className="mb-2 flex items-center font-medium">
                      <svg
                        className="mr-2 h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Booking Policies
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Latest internal policies and procedures for customer vacation bookings.
                    </p>
                    <Link to="/policies" className="text-sm text-blue-600 hover:underline">
                      View Policies
                    </Link>
                  </div>

                  <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                    <h3 className="mb-2 flex items-center font-medium">
                      <svg
                        className="mr-2 h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Promo Codes & Discounts
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Current promotional offers to apply to customer bookings.
                    </p>
                    <Link to="/promotions" className="text-sm text-blue-600 hover:underline">
                      View Active Promotions
                    </Link>
                  </div>

                  <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                    <h3 className="mb-2 flex items-center font-medium">
                      <svg
                        className="mr-2 h-5 w-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Support Center
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Access customer service tools and escalation procedures.
                    </p>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Open Support Center
                    </a>
                  </div>

                  <div className="rounded-lg border p-4 transition hover:bg-gray-50">
                    <h3 className="mb-2 flex items-center font-medium">
                      <svg
                        className="mr-2 h-5 w-5 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Training & Certification
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      Required training courses and certification programs.
                    </p>
                    <Link to="/training" className="text-sm text-blue-600 hover:underline">
                      View Training Portal
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Southwest Advantage Section */}
        <div className="rounded-lg bg-blue-50 p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Southwest Vacations Value Proposition
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-center text-gray-700">
            Key selling points to highlight when booking vacation packages for customers
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Unbeatable Value</h3>
              <p className="text-gray-600">
                Exclusive package pricing with our no hidden fees policy - emphasize transparency.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                Savings up to 30% compared to booking separately
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Industry-leading satisfaction ratings with dedicated support throughout the trip.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                97% customer satisfaction rate
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-4">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Flexible Options</h3>
              <p className="text-gray-600">
                Customizable packages with easy rebooking and cancellation policies.
              </p>
              <div className="mt-4 text-sm font-medium text-blue-600">
                No change fees on most vacation packages
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Quick Booking Checklist</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">Verify customer identification before booking</span>
              </div>
              <div className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">
                  Confirm travel dates and passenger information
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">Review destination travel requirements</span>
              </div>
              <div className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700">Check for available promotions and discounts</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/about"
                className="inline-block rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                Full Booking Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
      <QuickAccessToolbar />
    </>
  );
};

export default HomePage;
