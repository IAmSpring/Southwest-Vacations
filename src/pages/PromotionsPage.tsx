import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  restrictions: string;
  status: 'active' | 'expired' | 'upcoming';
  eligibleDestinations?: string[];
  minBookingValue?: number;
}

const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    code: 'SUMMER2023',
    description: 'Summer Special: Get 15% off on all beach destinations',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    restrictions: 'Not applicable with other discounts. Minimum 3-night stay required.',
    status: 'active',
    eligibleDestinations: ['Cancun', 'Miami', 'Honolulu', 'San Diego', 'Puerto Vallarta'],
  },
  {
    id: '2',
    code: 'FALL50',
    description: '$50 off fall bookings to mountain destinations',
    discountType: 'fixed',
    discountValue: 50,
    startDate: '2023-09-01',
    endDate: '2023-11-30',
    restrictions: 'Valid for bookings above $500. Cannot be combined with other promotions.',
    status: 'upcoming',
    eligibleDestinations: ['Denver', 'Salt Lake City', 'Vancouver', 'Portland', 'Seattle'],
    minBookingValue: 500,
  },
  {
    id: '3',
    code: 'FAMILY25',
    description: '25% discount for family packages with children',
    discountType: 'percentage',
    discountValue: 25,
    startDate: '2023-05-01',
    endDate: '2023-12-31',
    restrictions: 'Must include at least 2 adults and 1 child. Maximum discount of $300.',
    status: 'active',
  },
  {
    id: '4',
    code: 'EARLYBIRD',
    description: '10% off when booking 60+ days in advance',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    restrictions: 'Must be booked at least 60 days before departure date.',
    status: 'active',
  },
  {
    id: '5',
    code: 'SENIOR15',
    description: '15% discount for travelers aged 65+',
    discountType: 'percentage',
    discountValue: 15,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    restrictions: 'ID verification required at check-in. One senior per booking minimum.',
    status: 'active',
  },
  {
    id: '6',
    code: 'LOYALTY100',
    description: '$100 off for Rapid Rewards members',
    discountType: 'fixed',
    discountValue: 100,
    startDate: '2023-03-15',
    endDate: '2023-06-15',
    restrictions: 'Valid only for Rapid Rewards members with status. Requires login verification.',
    status: 'expired',
    minBookingValue: 750,
  },
  {
    id: '7',
    code: 'HOLIDAY20',
    description: '20% off holiday destination packages',
    discountType: 'percentage',
    discountValue: 20,
    startDate: '2023-11-15',
    endDate: '2023-12-25',
    restrictions: 'Valid for travel between Dec 15 - Jan 15. Blackout dates may apply.',
    status: 'upcoming',
  },
  {
    id: '8',
    code: 'FLASH30',
    description: '30% off flash sale on select destinations',
    discountType: 'percentage',
    discountValue: 30,
    startDate: '2023-07-15',
    endDate: '2023-07-17',
    restrictions: 'Limited availability. First come, first served.',
    status: 'expired',
    eligibleDestinations: ['Las Vegas', 'Orlando', 'New Orleans', 'Chicago', 'Nashville'],
  },
];

const PromotionsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPromotions = MOCK_PROMOTIONS.filter(promo => {
    // Filter by status
    if (filter !== 'all' && promo.status !== filter) {
      return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !promo.code.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !promo.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Promotions & Discounts | Southwest Vacations</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Promotions & Discount Codes</h1>
        <p className="text-gray-600">
          View and manage active promotional offers available for customer bookings
        </p>
      </div>

      {/* Filter and search */}
      <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="flex space-x-2">
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === 'expired'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('expired')}
          >
            Expired
          </button>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Search promotions..."
            className="w-full rounded-md border border-gray-300 px-4 py-2 md:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Promotions list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {filteredPromotions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No promotions found matching your criteria.</p>
            </div>
          ) : (
            filteredPromotions.map(promotion => (
              <div key={promotion.id} className="p-6">
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                  <div>
                    <div className="mb-2 flex items-center">
                      <span className="mr-2 text-lg font-bold text-blue-600">{promotion.code}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                          promotion.status
                        )}`}
                      >
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </span>
                    </div>
                    <p className="mb-2 text-gray-700">{promotion.description}</p>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {promotion.discountType === 'percentage'
                          ? `${promotion.discountValue}% off`
                          : `$${promotion.discountValue.toFixed(2)} off`}
                      </span>
                      {promotion.minBookingValue && (
                        <span className="ml-1 text-sm text-gray-600">
                          (Min. booking: ${promotion.minBookingValue.toFixed(2)})
                        </span>
                      )}
                    </div>
                    <div className="mb-3 flex text-sm text-gray-500">
                      <span className="mr-4">
                        <span className="font-medium">Validity:</span>{' '}
                        {new Date(promotion.startDate).toLocaleDateString()} -{' '}
                        {new Date(promotion.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {promotion.eligibleDestinations &&
                      promotion.eligibleDestinations.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Eligible destinations:{' '}
                          </span>
                          <span className="text-sm text-gray-600">
                            {promotion.eligibleDestinations.join(', ')}
                          </span>
                        </div>
                      )}
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Restrictions:</span> {promotion.restrictions}
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2 md:mt-0">
                    <Link
                      to={`/book?promo=${promotion.code}`}
                      className={`rounded px-4 py-2 text-sm font-medium text-white ${
                        promotion.status === 'active'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'cursor-not-allowed bg-gray-400'
                      }`}
                      {...(promotion.status !== 'active'
                        ? { onClick: e => e.preventDefault() }
                        : {})}
                    >
                      Apply to Booking
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin actions */}
      <div className="mt-8 flex justify-end">
        <button className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Create New Promotion
        </button>
      </div>
    </div>
  );
};

export default PromotionsPage;
