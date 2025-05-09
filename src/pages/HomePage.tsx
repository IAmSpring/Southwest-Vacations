import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

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

const HomePage = () => {
  const { data: trips, isLoading, error } = useTrips();
  const [animatedItems, setAnimatedItems] = useState<Record<string, boolean>>({});

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

  return (
    <>
      <HeroSection />

      <FeatureBanner />

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div
          id="popularDestinations"
          data-scroll-animation
          className={`mb-10 flex flex-wrap items-center justify-center transition-all duration-1000 md:justify-between ${animatedItems['popularDestinations'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="relative mb-4 text-3xl font-bold text-[#304CB2] sm:text-4xl md:mb-0">
            Popular Destinations
            <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-[#E31837]"></span>
          </h2>

          <div className="flex space-x-2">
            <button className="rounded-full bg-[#304CB2] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1a2a66]">
              All
            </button>
            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200">
              Beach
            </button>
            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200">
              City
            </button>
            <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200">
              Mountain
            </button>
          </div>
        </div>

        {isLoading ? (
          <TripCardSkeletons count={6} />
        ) : error ? (
          <div className="animate-fade-in rounded-xl bg-gray-50 px-4 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#304CB2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-[#304CB2]">
              Oops! Something went wrong
            </h3>
            <p className="text-md mt-2 text-gray-600">
              {error.message || "We're having trouble loading trips. Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[#304CB2] px-4 py-2 text-white transition-colors hover:bg-[#1a2a66]"
            >
              Try Again
            </button>
          </div>
        ) : trips && trips.length > 0 ? (
          <div
            id="tripsGrid"
            data-scroll-animation
            className={`grid grid-cols-1 gap-8 transition-all duration-1000 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10 ${animatedItems['tripsGrid'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          >
            {trips.map((trip, index) => (
              <div
                key={trip.id}
                className="transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <TripCard trip={trip} />
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in rounded-xl bg-gray-50 px-4 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#304CB2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-[#304CB2]">Adventures Coming Soon!</h3>
            <p className="text-md mt-2 text-gray-600">
              We're currently planning new, exciting destinations just for you!
            </p>
          </div>
        )}
      </div>

      {/* Southwest Advantage Section */}
      <div className="relative mt-12 overflow-hidden bg-gray-50 py-16">
        <div className="absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-x-24 -translate-y-24 transform rounded-full bg-[#FFBF27] opacity-5"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 translate-x-12 translate-y-24 transform rounded-full bg-[#E31837] opacity-5"></div>
        </div>

        <div
          id="southwestAdvantage"
          data-scroll-animation
          className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2
            className={`mb-4 text-center text-3xl font-bold text-[#304CB2] transition-all duration-1000 ${animatedItems['southwestAdvantage'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            The Southwest Advantage
          </h2>
          <p
            className={`mx-auto mb-12 max-w-3xl text-center text-gray-600 transition-all delay-200 duration-1000 ${animatedItems['southwestAdvantage'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Experience the legendary Southwest hospitality, flexibility, and value with every
            vacation package.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div
              className={`transform rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#304CB2]/40 hover:shadow-md ${animatedItems['southwestAdvantage'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFBF27] shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#304CB2"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#304CB2]">No Bag Fees</h3>
              <p className="text-gray-600">
                Your first two checked bags fly free, helping you pack more fun and less stress.
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-[#E31837] hover:text-[#c41230]"
              >
                Learn More
              </a>
            </div>

            <div
              className={`transform rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#304CB2]/40 hover:shadow-md ${animatedItems['southwestAdvantage'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E31837] shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m0-1.5h.75a.75.75 0 01.75.75v.75m0-1.5h.75a.75.75 0 01.75.75v.75M6 18.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75m6 0a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75m6 0a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#304CB2]">No Change Fees</h3>
              <p className="text-gray-600">
                Plans change. We don't charge fees when you need to modify your vacation plans.
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-[#E31837] hover:text-[#c41230]"
              >
                Learn More
              </a>
            </div>

            <div
              className={`transform rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#304CB2]/40 hover:shadow-md ${animatedItems['southwestAdvantage'] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#304CB2] shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#304CB2]">Southwest Hospitality</h3>
              <p className="text-gray-600">
                Experience the legendary customer service that's made Southwest a customer favorite.
              </p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-[#E31837] hover:text-[#c41230]"
              >
                Learn More
              </a>
            </div>
          </div>

          <div
            className={`mt-16 flex justify-center transition-all delay-500 duration-1000 ${animatedItems['southwestAdvantage'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <Link
              to="/about"
              className="inline-block rounded-full bg-[#304CB2] px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#1a2a66] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#304CB2]"
            >
              Why Choose Southwest
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="relative bg-[#304CB2] py-16">
        <WaveDivider className="text-gray-50" inverted={true} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center text-white">
            <h3 className="mb-4 text-2xl font-bold">Sign Up For Deals</h3>
            <p className="mb-6 text-blue-100">
              Stay updated with our latest offers, travel tips, and exclusive deals.
            </p>

            <form className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFBF27]"
                aria-label="Your email address"
              />
              <button
                type="submit"
                className="rounded-full bg-[#FFBF27] px-6 py-3 font-bold text-[#304CB2] transition-colors hover:bg-[#F5B120]"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-4 text-sm text-blue-200">
              By subscribing, you agree to our{' '}
              <a href="#" className="underline hover:text-white">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
