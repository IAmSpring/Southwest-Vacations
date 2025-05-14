import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Custom icons instead of using Heroicons
const ChevronDownIcon = () => (
  <svg
    className="h-5 w-5 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronUpIcon = () => (
  <svg
    className="h-5 w-5 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Dashboard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Chart data
  const bookingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Bookings',
        data: [120, 190, 150, 240, 210, 280],
        borderColor: '#0054a6',
        backgroundColor: 'rgba(0, 84, 166, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue ($K)',
        data: [520, 590, 620, 780, 690, 850],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
    ],
  };

  const destinationData = {
    labels: ['Caribbean', 'Mexico', 'Hawaii', 'Florida', 'California', 'Other'],
    datasets: [
      {
        label: 'Popular Destinations',
        data: [35, 25, 15, 10, 8, 7],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Stats data
  const stats = [
    { label: 'Active Bookings', value: 386, change: '+12%', trend: 'up' },
    { label: "Today's Bookings", value: 124, change: '+8%', trend: 'up' },
    { label: 'New Destinations', value: 43, change: '+5', trend: 'up' },
    { label: 'Average Booking Value', value: '$1,842', change: '+$246', trend: 'up' },
    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up' },
    { label: 'Booking Completion Rate', value: '92%', change: '+3%', trend: 'up' },
    { label: 'Support Tickets', value: 28, change: '-5', trend: 'down' },
    { label: 'Package Customizations', value: 215, change: '+18%', trend: 'up' },
  ];

  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
      {/* Header Section - Always Visible */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h2 className="mb-6 text-2xl font-bold">Southwest Vacations Booking System</h2>
        <p className="mb-6 text-blue-100">
          Corporate portal for Southwest Airlines employees to manage vacation packages, process
          bookings, and access travel resources for customers.
        </p>

        {/* Stats Summary - Always Visible */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.slice(0, 3).map((stat, index) => (
            <div key={index} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">{stat.label}</h3>
              <div className="mt-2 flex items-center">
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span
                  className={`ml-2 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between border-b border-t border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        aria-expanded={isExpanded}
        aria-controls="dashboard-details"
      >
        <span className="font-medium text-gray-700">Current System Status: Operational</span>
        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </button>

      {/* Expandable Content */}
      <div
        id="dashboard-details"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="p-6">
          <h3 className="mb-6 text-xl font-bold text-gray-800">Advanced System Metrics</h3>

          {/* Additional Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.slice(3).map((stat, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-500">{stat.label}</h4>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  <span
                    className={`ml-2 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="mb-4 text-lg font-medium text-gray-700">Booking Trends (6 Months)</h4>
              <div className="h-60">
                <Line data={bookingsData} options={chartOptions} />
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="mb-4 text-lg font-medium text-gray-700">Revenue Performance ($K)</h4>
              <div className="h-60">
                <Bar data={revenueData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="mb-4 text-lg font-medium text-gray-700">Popular Destinations</h4>
              <div className="flex h-60 items-center justify-center">
                <Pie
                  data={destinationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h4 className="mb-4 text-lg font-medium text-gray-700">System Health</h4>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">API Performance</span>
                    <span className="text-sm font-medium text-gray-700">95%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div className="h-2.5 rounded-full bg-green-600" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Database Load</span>
                    <span className="text-sm font-medium text-gray-700">68%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-yellow-500"
                      style={{ width: '68%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Server Response Time</span>
                    <span className="text-sm font-medium text-gray-700">87%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div className="h-2.5 rounded-full bg-blue-600" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    <span className="text-sm font-medium text-gray-700">42%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div className="h-2.5 rounded-full bg-green-600" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
