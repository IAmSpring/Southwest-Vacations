import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
        <Link to="/" className="hover:text-blue-200 transition-colors">
          ✈️ Southwest Vacations
        </Link>
      </h1>
      <nav className="space-x-4">
        <Link 
          to="/" 
          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Home
        </Link>
        <Link 
          to="/book" 
          className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Book a Trip
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
