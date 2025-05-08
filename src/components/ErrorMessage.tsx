import React from 'react';

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md" role="alert">
    <p className="font-bold">Oops! Something went wrong.</p>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
