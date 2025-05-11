import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import auditLogService, { ResourceType, AuditAction } from '../services/auditLogService';
import AuditLogViewer from './AuditLogViewer';
import TwoFactorAuthModal from './TwoFactorAuthModal';

interface Booking {
  id: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  tripDetails: {
    id: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    price: number;
    travelers: number;
  };
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  paymentInfo?: {
    id: string;
    amount: number;
    method: string;
    last4?: string;
    billingAddress?: string;
  };
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  isMultiDestination?: boolean;
  segments?: Array<{
    id: string;
    departureLocation: string;
    arrivalLocation: string;
    departureDate: string;
    returnDate: string;
  }>;
  notes?: string;
  employeeNotes?: string;
  tags?: string[];
}

interface BookingDetailViewProps {
  bookingId: string;
  onUpdate?: (booking: Booking) => void;
  onClose?: () => void;
}

const BookingDetailView: React.FC<BookingDetailViewProps> = ({ bookingId, onUpdate, onClose }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showAuditLog, setShowAuditLog] = useState<boolean>(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const currentUser = authService.getCurrentUser();
  const isEmployee = authService.isEmployee();
  const canEditBooking = isEmployee || authService.hasPermission('booking:update');
  const canCancelBooking = isEmployee || authService.hasPermission('booking:cancel');
  const canViewAuditLog = isEmployee || authService.hasPermission('audit:view');

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        // For this demo, we'll simulate a fetch with a timeout
        setTimeout(() => {
          const mockBooking: Booking = {
            id: bookingId,
            confirmationCode: 'SWV' + Math.floor(10000 + Math.random() * 90000),
            status: 'confirmed',
            tripDetails: {
              id: 'trip123',
              destination: 'Maui, Hawaii',
              departureDate: '2025-07-10',
              returnDate: '2025-07-17',
              price: 1499.99,
              travelers: 2,
            },
            customer: {
              id: 'cust123',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '555-123-4567',
            },
            paymentInfo: {
              id: 'pay123',
              amount: 1499.99,
              method: 'Credit Card',
              last4: '4242',
              billingAddress: '123 Main St, Anytown, CA 12345',
            },
            specialRequests: 'Early check-in if possible',
            createdAt: '2024-04-15T14:30:00Z',
            updatedAt: '2024-04-15T14:30:00Z',
            notes: '',
            employeeNotes: '',
          };

          setBooking(mockBooking);
          setEditedBooking({});
          setNotes(mockBooking.notes || '');
          setLoading(false);

          // Log that the booking was viewed
          auditLogService.log(AuditAction.BOOKING_VIEW, ResourceType.BOOKING, bookingId);
        }, 1000);
      } catch (err) {
        setError('Failed to load booking details. Please try again later.');
        console.error('Error loading booking:', err);
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      setEditedBooking({});
    } else {
      // Start editing
      setIsEditing(true);
      setEditedBooking({
        specialRequests: booking?.specialRequests,
        notes: booking?.notes,
        employeeNotes: booking?.employeeNotes,
      });
    }
  };

  // Handle edit field changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedBooking(prev => ({ ...prev, [name]: value }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!booking) return;

    setIsSaving(true);

    try {
      // In a real app, this would be an API call
      // For this demo, we'll simulate a save with a timeout
      setTimeout(() => {
        const updatedBooking = {
          ...booking,
          ...editedBooking,
          updatedAt: new Date().toISOString(),
        } as Booking;

        setBooking(updatedBooking);
        setIsEditing(false);
        setEditedBooking({});
        setIsSaving(false);

        if (onUpdate) {
          onUpdate(updatedBooking);
        }

        // Log the booking update
        auditLogService.logBookingModification(bookingId, editedBooking, 'Employee update');
      }, 1000);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error('Error saving changes:', err);
      setIsSaving(false);
    }
  };

  // Handle cancellation request
  const handleCancelRequest = () => {
    if (isEmployee) {
      // Employees can cancel directly
      setShowTwoFactorModal(true);
      setPendingAction('cancel');
    } else {
      // For regular users, we would show a confirmation dialog
      // This is a simplified example
      if (window.confirm('Are you sure you want to cancel this booking?')) {
        cancelBooking();
      }
    }
  };

  // Process the actual cancellation
  const cancelBooking = async () => {
    if (!booking) return;

    setIsSaving(true);

    try {
      // In a real app, this would be an API call
      // For this demo, we'll simulate a cancellation with a timeout
      setTimeout(() => {
        const updatedBooking = {
          ...booking,
          status: 'cancelled' as const,
          updatedAt: new Date().toISOString(),
        };

        setBooking(updatedBooking);
        setIsSaving(false);

        if (onUpdate) {
          onUpdate(updatedBooking);
        }

        // Log the booking cancellation
        auditLogService.logBookingCancellation(bookingId, cancelReason);
      }, 1000);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error('Error cancelling booking:', err);
      setIsSaving(false);
    }
  };

  // Handle two-factor authentication completion
  const handleTwoFactorComplete = (success: boolean) => {
    setShowTwoFactorModal(false);

    if (success && pendingAction === 'cancel') {
      cancelBooking();
    }

    setPendingAction(null);
  };

  // Handle note save
  const handleSaveNotes = async () => {
    if (!booking) return;

    setIsSaving(true);

    try {
      // In a real app, this would be an API call
      // For this demo, we'll simulate saving notes with a timeout
      setTimeout(() => {
        const updatedBooking = {
          ...booking,
          notes,
          updatedAt: new Date().toISOString(),
        } as Booking;

        setBooking(updatedBooking);
        setIsSaving(false);

        if (onUpdate) {
          onUpdate(updatedBooking);
        }

        // Log the note update
        auditLogService.logBookingModification(bookingId, { notes }, 'Notes updated');
      }, 1000);
    } catch (err) {
      setError('Failed to save notes. Please try again.');
      console.error('Error saving notes:', err);
      setIsSaving(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-500">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <h3 className="mb-2 text-lg font-semibold">Error</h3>
          <p>{error}</p>
          <button
            onClick={onClose}
            className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
          <h3 className="mb-2 text-lg font-semibold">Booking Not Found</h3>
          <p>The requested booking could not be found or you don't have permission to view it.</p>
          <button
            onClick={onClose}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h2 className="text-2xl font-bold">Booking Details</h2>
          <p className="text-gray-500">Confirmation Code: {booking.confirmationCode}</p>
        </div>
        <div className="flex space-x-2">
          {canEditBooking && booking.status !== 'cancelled' && (
            <button
              onClick={handleEditToggle}
              className={`rounded px-4 py-2 ${
                isEditing ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'
              }`}
              type="button"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Booking'}
            </button>
          )}
          {canCancelBooking && booking.status !== 'cancelled' && (
            <button
              onClick={handleCancelRequest}
              className="rounded bg-red-500 px-4 py-2 text-white"
              type="button"
              disabled={isSaving}
            >
              Cancel Booking
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-gray-800"
            type="button"
          >
            Close
          </button>
        </div>
      </div>

      {/* Booking Status */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Status</h3>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              booking.status === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Trip Details */}
      <div className="border-b p-6">
        <h3 className="mb-4 text-lg font-semibold">Trip Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-600">Destination</p>
            <p className="font-medium">{booking.tripDetails.destination}</p>
          </div>
          <div>
            <p className="text-gray-600">Dates</p>
            <p className="font-medium">
              {formatDate(booking.tripDetails.departureDate)} -{' '}
              {formatDate(booking.tripDetails.returnDate)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Travelers</p>
            <p className="font-medium">{booking.tripDetails.travelers}</p>
          </div>
          <div>
            <p className="text-gray-600">Price</p>
            <p className="font-medium">{formatCurrency(booking.tripDetails.price)}</p>
          </div>
        </div>

        {booking.isMultiDestination && booking.segments && (
          <div className="mt-4">
            <h4 className="text-md mb-2 font-semibold">Multi-Destination Itinerary</h4>
            <div className="overflow-hidden rounded border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Segment
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      From
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      To
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Dates
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {booking.segments.map((segment, index) => (
                    <tr key={segment.id}>
                      <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {segment.departureLocation}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{segment.arrivalLocation}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {formatDate(segment.departureDate)} - {formatDate(segment.returnDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Customer Details */}
      <div className="border-b p-6">
        <h3 className="mb-4 text-lg font-semibold">Customer Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{booking.customer.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{booking.customer.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium">{booking.customer.phone}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {booking.paymentInfo && (
        <div className="border-b p-6">
          <h3 className="mb-4 text-lg font-semibold">Payment Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-gray-600">Amount</p>
              <p className="font-medium">{formatCurrency(booking.paymentInfo.amount)}</p>
            </div>
            <div>
              <p className="text-gray-600">Method</p>
              <p className="font-medium">
                {booking.paymentInfo.method}
                {booking.paymentInfo.last4 && ` ending in ${booking.paymentInfo.last4}`}
              </p>
            </div>
            {booking.paymentInfo.billingAddress && (
              <div className="col-span-2">
                <p className="text-gray-600">Billing Address</p>
                <p className="font-medium">{booking.paymentInfo.billingAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Special Requests */}
      <div className="border-b p-6">
        <h3 className="mb-4 text-lg font-semibold">Special Requests</h3>
        {isEditing ? (
          <textarea
            name="specialRequests"
            value={editedBooking.specialRequests || ''}
            onChange={handleEditChange}
            className="w-full rounded border p-2"
            rows={3}
          />
        ) : (
          <p className="text-gray-700">
            {booking.specialRequests || 'No special requests provided.'}
          </p>
        )}
      </div>

      {/* Notes Section (visible to all) */}
      <div className="border-b p-6">
        <h3 className="mb-4 text-lg font-semibold">Notes</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full rounded border p-2"
          rows={3}
          placeholder="Add notes about your booking..."
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleSaveNotes}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
            type="button"
            disabled={isSaving}
          >
            Save Notes
          </button>
        </div>
      </div>

      {/* Employee Notes (visible only to employees) */}
      {isEmployee && (
        <div className="border-b bg-yellow-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">Employee Notes</h3>
          {isEditing ? (
            <textarea
              name="employeeNotes"
              value={editedBooking.employeeNotes || ''}
              onChange={handleEditChange}
              className="w-full rounded border p-2"
              rows={3}
            />
          ) : (
            <p className="text-gray-700">{booking.employeeNotes || 'No employee notes.'}</p>
          )}
        </div>
      )}

      {/* Save Changes Button (when editing) */}
      {isEditing && (
        <div className="border-b bg-gray-50 p-6">
          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="rounded bg-blue-500 px-4 py-2 text-white"
              type="button"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Activity Log Toggle */}
      {canViewAuditLog && (
        <div className="p-6">
          <button
            onClick={() => setShowAuditLog(!showAuditLog)}
            className="flex items-center text-blue-600 hover:text-blue-800"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
            {showAuditLog ? 'Hide Activity Log' : 'Show Activity Log'}
          </button>

          {showAuditLog && (
            <div className="mt-4">
              <AuditLogViewer
                resourceType={ResourceType.BOOKING}
                resourceId={bookingId}
                title="Booking Activity Log"
                showFilters={isEmployee}
                showExport={isEmployee}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      )}

      {/* Cancellation Dialog (shown when canceling) */}
      {showTwoFactorModal && (
        <TwoFactorAuthModal
          onComplete={handleTwoFactorComplete}
          onCancel={() => {
            setShowTwoFactorModal(false);
            setPendingAction(null);
          }}
          action={pendingAction === 'cancel' ? 'cancel booking' : 'perform action'}
        />
      )}
    </div>
  );
};

export default BookingDetailView;
