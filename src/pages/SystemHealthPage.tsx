import React from 'react';
import Dashboard from '../components/Dashboard';

const SystemHealthPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">System Health Dashboard</h1>

      <div className="mb-8">
        <Dashboard />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">API Status</h2>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="font-medium">All systems operational</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking API</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Gateway</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Search Service</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User Authentication</span>
              <span className="font-medium text-green-600">Online</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">System Resources</h2>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">CPU Usage</span>
                <span className="font-medium">24%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Memory Usage</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Disk Usage</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-yellow-500" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-gray-600">Network Bandwidth</span>
                <span className="font-medium">36%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: '36%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Recent System Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="px-4 py-2 font-semibold">Timestamp</th>
                <th className="px-4 py-2 font-semibold">Type</th>
                <th className="px-4 py-2 font-semibold">Service</th>
                <th className="px-4 py-2 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">2023-06-15 09:42:18</td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    INFO
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">Authentication</td>
                <td className="px-4 py-2 text-sm">User login successful</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">2023-06-15 09:41:03</td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    WARNING
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">Booking API</td>
                <td className="px-4 py-2 text-sm">High response time detected</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">2023-06-15 09:40:54</td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    DEBUG
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">Payment Gateway</td>
                <td className="px-4 py-2 text-sm">Processing transaction #38291</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">2023-06-15 09:39:22</td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    ERROR
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">Search Service</td>
                <td className="px-4 py-2 text-sm">Cache update failed - retrying</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">2023-06-15 09:38:45</td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    INFO
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">Booking API</td>
                <td className="px-4 py-2 text-sm">Booking #SWV-42853 confirmed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
