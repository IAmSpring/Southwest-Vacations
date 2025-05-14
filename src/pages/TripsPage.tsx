import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Tab } from '@headlessui/react';

// Define trip types
interface TripPackage {
  id: string;
  name: string;
  destination: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  flight?: FlightDetails;
  hotel?: HotelDetails;
  car?: CarRentalDetails;
  isCustomizable: boolean;
  isFavorite: boolean;
}

interface FlightDetails {
  airline: string;
  departureDate: string;
  returnDate: string;
  departureAirport: string;
  arrivalAirport: string;
  price: number;
  flightClass: 'economy' | 'business' | 'first';
}

interface HotelDetails {
  name: string;
  rating: number;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: number;
  amenities: string[];
}

interface CarRentalDetails {
  company: string;
  model: string;
  pickupDate: string;
  returnDate: string;
  price: number;
  category: string;
}

// Mock data for demo purposes
const mockTrips: TripPackage[] = [
  {
    id: '1',
    name: 'Luxurious Beach Getaway',
    destination: 'Cancun, Mexico',
    description: 'Enjoy a week of sun and relaxation at a premium resort with direct beach access.',
    price: 1299,
    duration: 7,
    imageUrl: '/images/destinations/cancun.jpg',
    flight: {
      airline: 'Southwest Airlines',
      departureDate: '2023-08-15T10:00:00',
      returnDate: '2023-08-22T15:30:00',
      departureAirport: 'LAX',
      arrivalAirport: 'CUN',
      price: 450,
      flightClass: 'economy',
    },
    hotel: {
      name: 'Royalton Riviera Cancun',
      rating: 4.5,
      checkIn: '2023-08-15',
      checkOut: '2023-08-22',
      roomType: 'Deluxe Ocean View',
      price: 749,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'All-Inclusive', 'Beach Access'],
    },
    car: {
      company: 'Hertz',
      model: 'Jeep Wrangler',
      pickupDate: '2023-08-15',
      returnDate: '2023-08-22',
      price: 100,
      category: 'SUV',
    },
    isCustomizable: true,
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Historic City Tour',
    destination: 'Rome, Italy',
    description:
      'Discover the ancient wonders of Rome with guided tours and luxury accommodations.',
    price: 1899,
    duration: 10,
    imageUrl: '/images/destinations/rome.jpg',
    flight: {
      airline: 'Southwest Airlines',
      departureDate: '2023-09-10T08:30:00',
      returnDate: '2023-09-20T12:45:00',
      departureAirport: 'JFK',
      arrivalAirport: 'FCO',
      price: 899,
      flightClass: 'economy',
    },
    hotel: {
      name: 'Hotel Artemide',
      rating: 4.8,
      checkIn: '2023-09-10',
      checkOut: '2023-09-20',
      roomType: 'Superior Room',
      price: 850,
      amenities: ['Free WiFi', 'Breakfast Included', 'City Center', 'Concierge Service'],
    },
    car: {
      company: 'Avis',
      model: 'Fiat 500',
      pickupDate: '2023-09-10',
      returnDate: '2023-09-20',
      price: 150,
      category: 'Economy',
    },
    isCustomizable: true,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    destination: 'Denver, Colorado',
    description:
      'Experience the majestic Rocky Mountains with hiking, skiing, and cozy cabin stays.',
    price: 1499,
    duration: 5,
    imageUrl: '/images/destinations/denver.jpg',
    flight: {
      airline: 'Southwest Airlines',
      departureDate: '2023-10-05T07:15:00',
      returnDate: '2023-10-10T19:20:00',
      departureAirport: 'ORD',
      arrivalAirport: 'DEN',
      price: 350,
      flightClass: 'economy',
    },
    hotel: {
      name: 'The Crawford Hotel',
      rating: 4.7,
      checkIn: '2023-10-05',
      checkOut: '2023-10-10',
      roomType: 'Loft Suite',
      price: 999,
      amenities: ['Free WiFi', 'Mountain View', 'Spa', 'Restaurant', 'Concierge Service'],
    },
    car: {
      company: 'Enterprise',
      model: 'Subaru Outback',
      pickupDate: '2023-10-05',
      returnDate: '2023-10-10',
      price: 150,
      category: 'SUV',
    },
    isCustomizable: true,
    isFavorite: false,
  },
];

// Helper function for tab panel classNames
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const TripsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthContext();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripPackage[]>(mockTrips);
  const [selectedTrip, setSelectedTrip] = useState<TripPackage | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');

  // Toggle favorite status
  const toggleFavorite = (tripId: string) => {
    setTrips(prev =>
      prev.map(trip => (trip.id === tripId ? { ...trip, isFavorite: !trip.isFavorite } : trip))
    );
  };

  // Start customization process
  const startCustomization = (trip: TripPackage) => {
    setSelectedTrip(trip);
    setIsCustomizing(true);
  };

  // Book a trip
  const bookTrip = (trip: TripPackage) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=book');
      return;
    }
    navigate(`/book?trip=${trip.id}&passengers=${passengers}`);
  };

  // Filter trips
  const filterTrips = (filter: string) => {
    setActiveFilter(filter);
  };

  // Apply filters
  const filteredTrips =
    activeFilter === 'all'
      ? trips
      : activeFilter === 'favorites'
        ? trips.filter(trip => trip.isFavorite)
        : trips.filter(trip => trip.destination.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#304CB2]">Vacation Packages</h1>

      {/* Filter tabs */}
      <div className="mb-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
              onClick={() => filterTrips('all')}
            >
              All Packages
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
              onClick={() => filterTrips('favorites')}
            >
              My Favorites
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
              onClick={() => filterTrips('beach')}
            >
              Beach Vacations
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
              onClick={() => filterTrips('city')}
            >
              City Breaks
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-[#0054a6] text-white shadow'
                    : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                )
              }
              onClick={() => filterTrips('mountain')}
            >
              Mountain Escapes
            </Tab>
          </Tab.List>
        </Tab.Group>
      </div>

      {/* Trip Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map(trip => (
          <div
            key={trip.id}
            className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div className="relative">
              <img
                src={trip.imageUrl || 'https://via.placeholder.com/400x250'}
                alt={trip.destination}
                className="h-48 w-full object-cover"
              />
              <button
                onClick={() => toggleFavorite(trip.id)}
                className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    trip.isFavorite ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{trip.destination}</h3>
              </div>
            </div>

            <div className="p-5">
              <h2 className="mb-2 text-2xl font-bold">{trip.name}</h2>
              <p className="mb-4 text-gray-600">{trip.description}</p>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Starting from</span>
                  <p className="text-xl font-bold text-[#0054a6]">${trip.price}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Duration</span>
                  <p className="font-semibold">{trip.duration} days</p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {trip.flight && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    Flight Included
                  </span>
                )}
                {trip.hotel && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Hotel Included
                  </span>
                )}
                {trip.car && (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                    Car Rental Included
                  </span>
                )}
                {trip.isCustomizable && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                    Customizable
                  </span>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => bookTrip(trip)}
                  className="flex-1 rounded-md bg-[#0054a6] px-4 py-2 text-white transition-colors hover:bg-[#003b73]"
                >
                  Book Now
                </button>
                {trip.isCustomizable && (
                  <button
                    onClick={() => startCustomization(trip)}
                    className="rounded-md border border-[#0054a6] bg-white px-4 py-2 text-[#0054a6] transition-colors hover:bg-[#0054a6] hover:text-white"
                  >
                    Customize
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customization Modal */}
      {isCustomizing && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Customize Your Trip</h2>
              <button
                onClick={() => setIsCustomizing(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-semibold">Trip Details</h3>
              <p className="text-lg font-bold">
                {selectedTrip.name} - {selectedTrip.destination}
              </p>
              <p className="mb-4 text-gray-600">{selectedTrip.description}</p>
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-medium text-gray-700">Number of Passengers</label>
              <div className="flex max-w-[150px] items-center">
                <button
                  onClick={() => setPassengers(prev => Math.max(1, prev - 1))}
                  className="rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={passengers}
                  onChange={e => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-16 border-y border-gray-300 px-3 py-2 text-center"
                />
                <button
                  onClick={() => setPassengers(prev => prev + 1)}
                  className="rounded-r-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-[#0054a6] text-white shadow'
                          : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                      )
                    }
                  >
                    Flight
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-[#0054a6] text-white shadow'
                          : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                      )
                    }
                  >
                    Hotel
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-[#0054a6] text-white shadow'
                          : 'text-gray-600 hover:bg-[#0054a6]/70 hover:text-white'
                      )
                    }
                  >
                    Car Rental
                  </Tab>
                </Tab.List>
                <Tab.Panels className="mt-4">
                  <Tab.Panel>
                    {selectedTrip.flight ? (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 text-lg font-semibold">Flight Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Airline</p>
                            <p className="font-medium">{selectedTrip.flight.airline}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Class</p>
                            <p className="font-medium capitalize">
                              {selectedTrip.flight.flightClass}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Departure</p>
                            <p className="font-medium">
                              {new Date(selectedTrip.flight.departureDate).toLocaleString()} (
                              {selectedTrip.flight.departureAirport})
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Return</p>
                            <p className="font-medium">
                              {new Date(selectedTrip.flight.returnDate).toLocaleString()} (
                              {selectedTrip.flight.arrivalAirport})
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-lg font-bold text-[#0054a6]">
                              ${selectedTrip.flight.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No flight included in this package.</p>
                    )}
                  </Tab.Panel>
                  <Tab.Panel>
                    {selectedTrip.hotel ? (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 text-lg font-semibold">Hotel Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Hotel</p>
                            <p className="font-medium">{selectedTrip.hotel.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <div className="flex items-center">
                              <span className="mr-1 font-medium">{selectedTrip.hotel.rating}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-yellow-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Room Type</p>
                            <p className="font-medium">{selectedTrip.hotel.roomType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-medium">{selectedTrip.hotel.checkIn}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-medium">{selectedTrip.hotel.checkOut}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Amenities</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedTrip.hotel.amenities.map((amenity, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-lg font-bold text-[#0054a6]">
                              ${selectedTrip.hotel.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No hotel included in this package.</p>
                    )}
                  </Tab.Panel>
                  <Tab.Panel>
                    {selectedTrip.car ? (
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h4 className="mb-2 text-lg font-semibold">Car Rental Details</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Company</p>
                            <p className="font-medium">{selectedTrip.car.company}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Model</p>
                            <p className="font-medium">{selectedTrip.car.model}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium">{selectedTrip.car.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">
                              {selectedTrip.car.pickupDate} to {selectedTrip.car.returnDate}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-lg font-bold text-[#0054a6]">
                              ${selectedTrip.car.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No car rental included in this package.</p>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="text-2xl font-bold text-[#0054a6]">
                  ${selectedTrip.price * passengers}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsCustomizing(false);
                    bookTrip(selectedTrip);
                  }}
                  className="rounded-md bg-[#0054a6] px-4 py-2 text-white hover:bg-[#003b73]"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsPage;
