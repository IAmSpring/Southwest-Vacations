import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';

const CorporatePage = () => {
  const { data: trips } = useTrips();
  const [animatedSections, setAnimatedSections] = useState<Record<string, boolean>>({});

  // Observe elements for scroll-based animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          if (id && entry.isIntersecting) {
            setAnimatedSections(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Background gradient animation
  const BackgroundAnimation = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-40 -top-40 h-96 w-96 animate-float rounded-full bg-southwest-yellow/10 blur-3xl"></div>
      <div
        className="absolute -left-20 top-1/4 h-72 w-72 animate-float rounded-full bg-southwest-red/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute bottom-20 right-1/4 h-60 w-60 animate-float rounded-full bg-southwest-blue/10 blur-3xl"
        style={{ animationDelay: '1s' }}
      ></div>
    </div>
  );

  return (
    <div className="relative">
      <BackgroundAnimation />

      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pb-32 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div
              id="heroContent"
              data-animate
              className={`${animatedSections.heroContent ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'} transition-all duration-1000`}
            >
              <div className="mb-6 inline-block rounded-full bg-southwest-blue/10 px-4 py-2 text-sm font-semibold text-southwest-blue">
                Southwest Airlines Business Travel
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-southwest-blue md:text-5xl lg:text-6xl">
                Corporate <span className="text-southwest-red">Travel Solutions</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-gray-600">
                Streamlined travel management, exclusive corporate rates, and dedicated support for
                your organization's travel needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="transform rounded-full bg-southwest-red px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl">
                  Schedule a Demo
                </button>
                <button className="rounded-full border-2 border-southwest-blue px-6 py-3 font-bold text-southwest-blue transition-colors duration-300 hover:bg-southwest-blue hover:text-white">
                  Learn More
                </button>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-10 w-10 overflow-hidden rounded-full border-2 border-white"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                        alt="Customer"
                        className="h-full w-full object-cover"
                        onError={e => {
                          e.currentTarget.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="mb-1 flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Trusted by <span className="font-semibold">500+</span> corporate clients
                  </p>
                </div>
              </div>
            </div>

            <div
              id="heroImage"
              data-animate
              className={`${animatedSections.heroImage ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} relative transition-all delay-300 duration-1000`}
            >
              <div className="relative">
                <div className="absolute inset-0 rotate-3 transform rounded-3xl bg-southwest-blue"></div>
                <div className="relative -rotate-2 transform overflow-hidden rounded-3xl border-8 border-white shadow-2xl">
                  <img
                    src="/images/corporate-travel.jpg"
                    alt="Corporate travel with Southwest"
                    className="h-[400px] w-full object-cover"
                    onError={e => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071';
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-southwest-blue/10 p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-southwest-blue"
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
                    <div>
                      <p className="text-sm text-gray-500">Average Savings</p>
                      <p className="text-xl font-bold text-southwest-blue">25%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="featuresHeading"
            data-animate
            className={`mx-auto mb-16 max-w-3xl text-center ${animatedSections.featuresHeading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}
          >
            <h2 className="mb-4 text-3xl font-bold text-southwest-blue">
              Corporate Travel Benefits
            </h2>
            <p className="text-gray-600">
              Southwest Airlines offers comprehensive travel solutions designed specifically for
              businesses of all sizes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: 'feature1',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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
                ),
                title: 'Cost Savings',
                description:
                  'Exclusive corporate rates and volume-based discounts to optimize your travel budget.',
              },
              {
                id: 'feature2',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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
                ),
                title: 'Travel Management',
                description:
                  'Powerful dashboard to manage bookings, track expenses, and enforce travel policies.',
              },
              {
                id: 'feature3',
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: 'Dedicated Support',
                description:
                  '24/7 priority customer service and a dedicated account manager for your organization.',
              },
            ].map((feature, index) => (
              <div
                key={feature.id}
                id={feature.id}
                data-animate
                className={`rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-md ${animatedSections[feature.id] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-southwest-blue/10 p-3 text-southwest-blue">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-southwest-blue">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div
            id="statsSection"
            data-animate
            className={`mt-20 grid gap-8 md:grid-cols-4 ${animatedSections.statsSection ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}
          >
            {[
              { label: 'Corporate Partners', value: '500+' },
              { label: 'Cities Served', value: '100+' },
              { label: 'Annual Business Trips', value: '1M+' },
              { label: 'Customer Satisfaction', value: '97%' },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-lg p-6 text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-2 text-4xl font-extrabold text-southwest-blue">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular corporate destinations */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="destinationsHeading"
            data-animate
            className={`mb-12 ${animatedSections.destinationsHeading ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-1000`}
          >
            <h2 className="mb-4 text-3xl font-bold text-southwest-blue">
              Popular Business Destinations
            </h2>
            <p className="max-w-3xl text-gray-600">
              Explore our most-booked business travel destinations with exclusive corporate rates
              and flexible booking options.
            </p>
          </div>

          {trips && trips.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {trips.slice(0, 3).map((trip, index) => (
                <div
                  key={trip.id}
                  id={`destination-${index}`}
                  data-animate
                  className={`transition-all duration-700 ${animatedSections[`destination-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <TripCard trip={trip} />
                </div>
              ))}
            </div>
          )}

          <div
            id="destinationsCTA"
            data-animate
            className={`mt-12 text-center ${animatedSections.destinationsCTA ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all delay-300 duration-1000`}
          >
            <Link
              to="/corporate/destinations"
              className="inline-flex items-center rounded-full bg-southwest-blue px-6 py-3 font-bold text-white transition-colors duration-300 hover:bg-southwest-blue-dark"
            >
              <span>View All Business Destinations</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative overflow-hidden bg-southwest-blue py-16">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 h-32 w-full -skew-y-6 transform bg-white/5"></div>
          <div className="absolute right-0 top-0 h-32 w-full skew-y-6 transform bg-white/5"></div>
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-southwest-red/20 blur-3xl filter"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="ctaSection"
            data-animate
            className={`mx-auto max-w-4xl text-center ${animatedSections.ctaSection ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-1000`}
          >
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to streamline your corporate travel?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join hundreds of businesses that trust Southwest for their corporate travel needs.
              Schedule a demo today to see how we can help optimize your travel program.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="transform rounded-full bg-white px-8 py-4 font-bold text-southwest-blue shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                Schedule a Demo
              </button>
              <button className="rounded-full border-2 border-white px-8 py-4 font-bold text-white transition-colors duration-300 hover:bg-white/10">
                Contact Sales
              </button>
            </div>
            <p className="mt-6 text-sm text-blue-100">
              No commitment required. See why we're the preferred airline for business travel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporatePage;
