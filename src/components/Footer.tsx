import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer
    className="mt-12 border-t border-gray-200 bg-gray-100"
    role="contentinfo"
    aria-label="Site footer"
  >
    <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
      <p>&copy; {new Date().getFullYear()} Southwest Vacations Demo. All rights reserved.</p>
      <p className="mt-1">
        Crafted with{' '}
        <Link
          to="/aid"
          className="text-red-500 transition-colors duration-200 hover:text-red-700"
          aria-label="Application Information and Documentation"
        >
          <span aria-hidden="true">❤️</span>
          <span className="sr-only">love</span>
        </Link>{' '}
        for a great travel experience.
      </p>
      <nav className="mt-4" aria-label="Footer navigation">
        <ul className="flex justify-center space-x-4">
          <li>
            <Link
              to="/about"
              className="rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="About Southwest Vacations"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/policies"
              className="rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Company Policies"
            >
              Policies
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className="rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Get customer support"
            >
              Support
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
);

export default Footer;
