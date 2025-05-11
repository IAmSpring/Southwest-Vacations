import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { Trip } from '../sharedTypes';

// Enhanced filters for employee use
interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  sortBy?: 'price' | 'destination' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    travelers: 1,
    sortBy: 'price',
    sortOrder: 'asc',
  });

  const location = useLocation();

  // Get search query from URL
  const query = new URLSearchParams(location.search).get('query') || '';

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // When filters change, re-fetch results
  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build the query string with all filters
        const params = new URLSearchParams();
        params.append('destination', query);

        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.category) params.append('category', filters.category);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.travelers) params.append('travelers', filters.travelers.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await fetch(`/api/trips/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, filters]);

  const handleSearch = (newQuery: string) => {
    window.history.pushState({}, '', `/search?query=${encodeURIComponent(newQuery)}`);
    // Re-trigger the effect by forcing a re-render
    setSearchResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Southwest Vacations Booking Portal</h1>
        <p className="mb-4 text-gray-600">Find and book travel packages for customers</p>
        <SearchBar onSearch={handleSearch} />

        {/* Enhanced filters for employee booking tool */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Advanced Filters</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={filters.minPrice || ''}
                  onChange={e =>
                    handleFilterChange(
                      'minPrice',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={filters.maxPrice || ''}
                  onChange={e =>
                    handleFilterChange(
                      'maxPrice',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Travel Dates</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={filters.startDate || ''}
                  onChange={e => handleFilterChange('startDate', e.target.value)}
                />
                <span>-</span>
                <input
                  type="date"
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={filters.endDate || ''}
                  onChange={e => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Travelers</label>
              <input
                type="number"
                min="1"
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.travelers || 1}
                onChange={e => handleFilterChange('travelers', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.category || ''}
                onChange={e => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
                <option value="cruise">Cruise</option>
                <option value="family">Family-friendly</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort By</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.sortBy}
                onChange={e => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="price">Price</option>
                <option value="destination">Destination</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={filters.sortOrder}
                onChange={e => handleFilterChange('sortOrder', e.target.value)}
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-lg text-gray-500">No destinations found matching "{query}"</p>
          <p className="mt-2 text-gray-400">
            Try adjusting your search criteria or browse our popular destinations
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-700">
            Showing {searchResults.length} results for "{query}"
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map(trip => (
              <div
                key={trip.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                data-testid={`trip-card-${trip.id}`}
              >
                <img
                  src={trip.imageUrl}
                  alt={trip.destination}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{trip.destination}</h2>
                  <p className="mt-2 font-bold text-blue-600">
                    ${trip.price.toLocaleString()} per person
                  </p>
                  {trip.totalPrice && (
                    <p className="text-sm text-gray-600">
                      Total for {filters.travelers} travelers: ${trip.totalPrice.toLocaleString()}
                    </p>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <a
                      href={`/trip/${trip.id}`}
                      className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      View Details
                    </a>
                    <a
                      href={`/book?tripId=${trip.id}&travelers=${filters.travelers}`}
                      className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
