import React from 'react';

const Footer = () => (
  <footer className="bg-gray-100 border-t border-gray-200 mt-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
      <p>&copy; {new Date().getFullYear()} Southwest Vacations Demo. All rights reserved.</p>
      <p className="mt-1">Crafted with ❤️ for a great travel experience.</p>
    </div>
  </footer>
);

export default Footer;
