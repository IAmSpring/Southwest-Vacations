import React from 'react';

const Loading = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-500"></div>
    <p className="mt-4 text-lg text-gray-700">Loading, please wait...</p>
  </div>
);

export default Loading;
