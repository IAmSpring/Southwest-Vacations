import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-100 bg-white shadow">
      <div className="h-48 bg-gray-200"></div>
      <div className="space-y-3 p-4">
        <div className="h-6 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-8 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export const ResourceCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-lg border border-gray-100 p-4">
      <div className="mb-2 flex items-center space-x-2">
        <div className="h-5 w-5 rounded-full bg-gray-200"></div>
        <div className="h-5 w-1/3 rounded bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded bg-gray-200"></div>
        <div className="h-3 w-5/6 rounded bg-gray-200"></div>
      </div>
      <div className="mt-3 h-4 w-1/4 rounded bg-gray-200"></div>
    </div>
  );
};

export const AnnouncementSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse py-4">
      <div className="mb-2 flex items-center">
        <div className="mr-3 h-8 w-8 rounded-full bg-gray-200"></div>
        <div className="h-5 w-1/3 rounded bg-gray-200"></div>
        <div className="ml-2 h-3 w-16 rounded bg-gray-200"></div>
      </div>
      <div className="space-y-2 pl-11">
        <div className="h-3 rounded bg-gray-200"></div>
        <div className="h-3 w-5/6 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-lg bg-white bg-opacity-10 p-4 text-center backdrop-blur-lg backdrop-filter">
      <div className="mx-auto mb-1 h-8 w-16 rounded bg-gray-200"></div>
      <div className="mx-auto h-4 w-20 rounded bg-gray-200"></div>
    </div>
  );
};

export default Loading;
