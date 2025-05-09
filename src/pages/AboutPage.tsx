import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-[#304CB2] to-[#1a2a66] py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl">
              Why Choose Southwest Vacations
            </h1>
            <p className="mb-8 text-xl text-blue-100">
              Experience the Southwest difference with our award-winning service, transparent
              pricing, and unforgettable destinations.
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full rotate-180 overflow-hidden leading-none">
          <svg
            className="relative block h-12 w-full sm:h-16 md:h-24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="white"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Our Commitment Section */}
        <div className="mx-auto mb-20 max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#304CB2]">
            Our Commitment to You
          </h2>

          <div className="rounded-2xl bg-gray-50 p-8 shadow-sm">
            <p className="mb-6 text-lg text-gray-700">
              At Southwest Vacations, we believe travel should be accessible, enjoyable, and
              hassle-free for everyone. Our commitment to customer satisfaction has made us a leader
              in the travel industry for over 50 years.
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-bold text-[#304CB2]">Our Mission</h3>
                <p className="text-gray-700">
                  To connect people to what's important in their lives through friendly, reliable,
                  and low-cost air travel and vacation packages.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-bold text-[#304CB2]">Our Vision</h3>
                <p className="text-gray-700">
                  To be the world's most loved, most efficient, and most profitable airline, making
                  vacation dreams accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#304CB2]">
            Southwest Vacations Benefits
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFBF27]">
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
              <h3 className="mb-3 text-xl font-bold text-[#304CB2]">Bags Fly Free®</h3>
              <p className="mb-4 text-gray-600">
                Your first and second checked bags fly free (size and weight limits apply).
              </p>
              <ul className="space-y-2 text-left text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  No hidden bag fees
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Pack more for your vacation
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save hundreds on family trips
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E31837]">
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
              <h3 className="mb-3 text-xl font-bold text-[#304CB2]">No Change Fees</h3>
              <p className="mb-4 text-gray-600">
                Plans change. We won't charge you when you need to modify your vacation plans.
              </p>
              <ul className="space-y-2 text-left text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Flexible booking options
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Change dates without penalty
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Peace of mind for unexpected changes
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
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
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#304CB2]">Legendary Customer Service</h3>
              <p className="mb-4 text-gray-600">
                Our award-winning service ensures you receive personal care throughout your journey.
              </p>
              <ul className="space-y-2 text-left text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  24/7 customer support
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Dedicated vacation specialists
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 mt-0.5 h-5 w-5 text-[#E31837]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Friendly, helpful staff
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Southwest Experience Section */}
        <div className="mb-20 rounded-2xl bg-gray-50 p-8 shadow-sm">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#304CB2]">
            The Southwest Experience
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <img
                src="/images/southwest-europe.jpg"
                alt="Southwest Airlines plane"
                className="h-80 w-full rounded-xl object-cover shadow-md"
                onError={e => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
                }}
              />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-bold text-[#304CB2]">A Tradition of Excellence</h3>
              <p className="mb-4 text-gray-700">
                For over five decades, Southwest Airlines has revolutionized the travel industry
                with our commitment to low fares, exceptional customer service, and a passion for
                making travel accessible to everyone.
              </p>
              <p className="mb-6 text-gray-700">
                Southwest Vacations extends this tradition by offering complete vacation packages
                that combine our legendary air service with handpicked hotels, experiences, and
                transportation options.
              </p>

              <Link
                to="/book"
                className="inline-block self-start rounded-full bg-[#E31837] px-6 py-3 text-center font-bold text-white shadow-md transition-colors hover:bg-[#c41230]"
              >
                Book Your Southwest Experience
              </Link>
            </div>
          </div>
        </div>

        {/* Rapid Rewards Section */}
        <div className="mb-20">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#304CB2]">
            Earn Rapid Rewards® Points
          </h2>

          <div className="rounded-2xl bg-[#304CB2] p-8 text-white shadow-md">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-2xl font-bold">Rewards That Take You Further</h3>
                <p className="mb-4 text-blue-100">
                  Every Southwest Vacations package earns you valuable Rapid Rewards points that can
                  be redeemed for future flights, hotel stays, car rentals, and more.
                </p>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="mr-2 mt-0.5 h-5 w-5 text-[#FFBF27]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Earn points on every dollar spent
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-2 mt-0.5 h-5 w-5 text-[#FFBF27]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    No blackout dates for redemption
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="mr-2 mt-0.5 h-5 w-5 text-[#FFBF27]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Points don't expire
                  </li>
                </ul>

                <a
                  href="#"
                  className="inline-block rounded-full bg-[#FFBF27] px-6 py-3 text-center font-bold text-[#304CB2] shadow-md transition-colors hover:bg-[#F5B120]"
                >
                  Join Rapid Rewards
                </a>
              </div>

              <div className="relative">
                <div className="absolute -right-4 -top-4 flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-[#FFBF27] shadow-lg">
                  <div className="text-center font-extrabold text-[#304CB2]">
                    <span className="block text-sm">EARN</span>
                    <span className="block text-2xl">2X</span>
                    <span className="block text-xs">POINTS</span>
                  </div>
                </div>
                <img
                  src="/images/southwest-nyc.jpg"
                  alt="Rapid Rewards card and airplane"
                  className="h-80 w-full rounded-xl object-cover shadow-md"
                  onError={e => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1601350331905-e6d5aa1ba4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#304CB2]">
            Ready to Experience Southwest Vacations?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
            Join millions of satisfied travelers who've discovered the Southwest difference. Book
            your next adventure today!
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/trips"
              className="rounded-full bg-[#304CB2] px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#1a2a66]"
            >
              Browse Destinations
            </Link>
            <Link
              to="/book"
              className="rounded-full bg-[#E31837] px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#c41230]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
