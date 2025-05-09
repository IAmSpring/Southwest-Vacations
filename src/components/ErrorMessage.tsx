import React from 'react';

const ErrorMessage = ({ message }: { message: string }) => (
  <div
    className="rounded-md border-l-4 border-red-500 bg-red-100 p-6 text-red-700 shadow-md"
    role="alert"
  >
    <p className="font-bold">Oops! Something went wrong.</p>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;
