import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for charts
const generateBookingData = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentMonth = new Date().getMonth();

  return months.map((month, index) => {
    // Generate data with an upward trend and seasonal variations
    const baseValue = 80 + index * 5; // Upward trend
    const seasonality = Math.sin((index / 11) * Math.PI * 2) * 20; // Seasonal variation
    const random = Math.random() * 15 - 7.5; // Random noise

    // Make past months data "actual" and future months "projected"
    const bookings =
      index <= currentMonth
        ? Math.round(baseValue + seasonality + random)
        : Math.round(baseValue + seasonality);

    // Revenue is roughly proportional to bookings with some variation
    const avgBookingValue = 1200 + Math.random() * 300;
    const revenue = Math.round((bookings * avgBookingValue) / 1000); // In thousands

    return {
      name: month,
      bookings,
      revenue,
      projected: index > currentMonth,
    };
  });
};

const destinationData = [
  { name: 'Orlando', value: 25 },
  { name: 'Las Vegas', value: 18 },
  { name: 'Cancun', value: 15 },
  { name: 'Miami', value: 12 },
  { name: 'New York', value: 10 },
  { name: 'Others', value: 20 },
];

const bookingTypeData = [
  { name: 'Flight + Hotel', value: 55 },
  { name: 'Flight Only', value: 25 },
  { name: 'Hotel Only', value: 15 },
  { name: 'Package with Car', value: 5 },
];

const customerSegmentData = [
  { name: 'Families', value: 40 },
  { name: 'Business', value: 25 },
  { name: 'Couples', value: 20 },
  { name: 'Solo', value: 15 },
];

const bookingSummary = {
  total: 2547,
  pending: 183,
  confirmed: 2238,
  canceled: 126,
  thisWeek: 215,
  lastWeek: 198,
  thisMonth: 842,
  lastMonth: 795,
};

const revenueMetrics = {
  total: '$3.6M',
  thisMonth: '$842K',
  lastMonth: '$795K',
  avgPerBooking: '$1,430',
  totalProjected: '$12.4M',
  growthRate: '8.2%',
};

const agentPerformanceData = [
  { name: 'Maria L.', bookings: 87, satisfaction: 4.9, revenue: 142 },
  { name: 'David K.', bookings: 76, satisfaction: 4.7, revenue: 118 },
  { name: 'Sarah W.', bookings: 68, satisfaction: 4.8, revenue: 105 },
  { name: 'James R.', bookings: 65, satisfaction: 4.6, revenue: 101 },
  { name: 'Olivia M.', bookings: 58, satisfaction: 4.8, revenue: 92 },
];

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsDashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setBookingData(generateBookingData());
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Southwest Vacations</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
          <div className="p-6 md:p-8">
            <h1 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              Booking Analytics Dashboard
            </h1>
            <p className="max-w-3xl text-blue-100">
              Track booking performance, revenue metrics, and agent productivity across the
              Southwest Vacations platform.
            </p>
          </div>

          {/* Dashboard KPIs */}
          <div className="border-t border-blue-900 bg-white px-6 py-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="text-xs font-medium uppercase text-blue-700">Total Bookings</h3>
                <p className="text-2xl font-bold text-blue-900">{bookingSummary.total}</p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">
                    +
                    {Math.round(
                      ((bookingSummary.thisMonth - bookingSummary.lastMonth) /
                        bookingSummary.lastMonth) *
                        100
                    )}
                    %
                  </span>{' '}
                  vs. last month
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="text-xs font-medium uppercase text-green-700">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-900">{revenueMetrics.total}</p>
                <p className="text-sm text-green-700">
                  <span className="font-medium">{revenueMetrics.growthRate}</span> growth rate
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <h3 className="text-xs font-medium uppercase text-purple-700">
                  Avg. Booking Value
                </h3>
                <p className="text-2xl font-bold text-purple-900">{revenueMetrics.avgPerBooking}</p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">+3.2%</span> vs. last quarter
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <h3 className="text-xs font-medium uppercase text-yellow-700">Conversion Rate</h3>
                <p className="text-2xl font-bold text-yellow-900">24.3%</p>
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">+1.8%</span> vs. target
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            {(['week', 'month', 'quarter', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${range === 'week' ? 'rounded-l-md' : ''} ${
                  range === 'year' ? 'rounded-r-md' : ''
                } border border-gray-300`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Booking & Revenue Trends */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Booking & Revenue Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-center text-sm text-gray-500">
                Solid lines represent actual numbers, dashed lines represent projections
              </div>
            </div>

            {/* Distribution Charts Row */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Top Destinations */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">Top Destinations</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={destinationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {destinationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Booking Types */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">Booking Types</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {bookingTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Customer Segments */}
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-semibold">Customer Segments</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Performing Agents */}
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Top Performing Agents</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={agentPerformanceData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue ($K)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Metrics Table */}
            <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-md">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold">Detailed Performance Metrics</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Metric
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Current
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Previous
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Change
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        Bookings (This Month)
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {bookingSummary.thisMonth}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {bookingSummary.lastMonth}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600">
                        +
                        {Math.round(
                          ((bookingSummary.thisMonth - bookingSummary.lastMonth) /
                            bookingSummary.lastMonth) *
                            100
                        )}
                        %
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Above Target
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        Conversion Rate
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">24.3%</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">22.5%</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600">+1.8%</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Above Target
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        Cancellation Rate
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">4.9%</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">5.2%</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600">-0.3%</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Above Target
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        Average Processing Time
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">4.3 min</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">5.1 min</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600">
                        -0.8 min
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Above Target
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        Customer Satisfaction
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">4.7/5.0</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">4.6/5.0</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-green-600">+0.1</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Above Target
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Options */}
            <div className="mt-4 flex justify-end space-x-4">
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <svg
                  className="mr-2 h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </button>
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <svg
                  className="mr-2 h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export CSV
              </button>
              <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AnalyticsDashboardPage;
