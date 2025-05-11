import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // If no onSearch prop, navigate to search page with query parameter
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md items-center" data-testid="search-form">
      <input
        type="text"
        placeholder="Search destinations..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="flex-grow rounded-l-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="search-input"
      />
      <button
        type="submit"
        className="rounded-r-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="search-button"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
