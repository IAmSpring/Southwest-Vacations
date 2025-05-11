import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import auditLogService, {
  AuditLogEntry,
  AuditAction,
  ResourceType,
} from '../services/auditLogService';
import { User } from '../services/authService';

interface AuditLogViewerProps {
  resourceType: ResourceType;
  resourceId: string;
  title?: string;
  maxEntries?: number;
  showFilters?: boolean;
  showExport?: boolean;
  currentUser?: User | null;
  onExport?: (exportedData: Blob) => void;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  resourceType,
  resourceId,
  title = 'Activity Log',
  maxEntries = 10,
  showFilters = false,
  showExport = false,
  currentUser,
  onExport,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    action: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load audit logs
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const logsData = await auditLogService.getLogsForResource(resourceType, resourceId);
        setLogs(logsData);
        setTotalPages(Math.ceil(logsData.length / maxEntries));
      } catch (err) {
        setError('Failed to load activity log. Please try again later.');
        console.error('Error loading audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [resourceType, resourceId, maxEntries]);

  // Function to get friendly action name
  const getFriendlyActionName = (action: string): string => {
    const actionMap: Record<string, string> = {
      [AuditAction.CREATE]: 'Created',
      [AuditAction.READ]: 'Viewed',
      [AuditAction.UPDATE]: 'Updated',
      [AuditAction.DELETE]: 'Deleted',
      [AuditAction.LOGIN]: 'Logged in',
      [AuditAction.LOGOUT]: 'Logged out',
      [AuditAction.EXPORT]: 'Exported',
      [AuditAction.IMPORT]: 'Imported',
      [AuditAction.PRINT]: 'Printed',
      [AuditAction.SEARCH]: 'Searched',
      [AuditAction.PAYMENT]: 'Payment processed',
      [AuditAction.REFUND]: 'Refund processed',
      [AuditAction.BOOKING_CREATE]: 'Booking created',
      [AuditAction.BOOKING_UPDATE]: 'Booking updated',
      [AuditAction.BOOKING_CANCEL]: 'Booking canceled',
      [AuditAction.BOOKING_VIEW]: 'Booking viewed',
      [AuditAction.SENSITIVE_ACTION]: 'Sensitive action performed',
    };

    return actionMap[action] || action;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (err) {
      return timestamp;
    }
  };

  // Get details to display
  const getActionDetails = (log: AuditLogEntry): string => {
    if (log.action === AuditAction.BOOKING_UPDATE && log.details?.changes) {
      const fields = Object.keys(log.details.changes);
      if (fields.length === 0) return '';
      if (fields.length === 1) return `Changed ${fields[0]}`;
      return `Changed ${fields.length} fields`;
    }

    if (log.action === AuditAction.BOOKING_CANCEL && log.details?.reason) {
      return `Reason: ${log.details.reason}`;
    }

    return '';
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = async () => {
    setLoading(true);

    try {
      const searchResult = await auditLogService.searchLogs({
        resourceType,
        resourceId,
        action: filters.action as AuditAction,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: 1,
        limit: maxEntries,
      });

      setLogs(searchResult.logs);
      setTotalPages(searchResult.totalPages);
      setPage(1);
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = async () => {
    setFilters({
      startDate: '',
      endDate: '',
      action: '',
    });

    const logsData = await auditLogService.getLogsForResource(resourceType, resourceId);
    setLogs(logsData);
    setTotalPages(Math.ceil(logsData.length / maxEntries));
    setPage(1);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const exportData = await auditLogService.exportLogs({
        resourceType,
        startDate:
          filters.startDate ||
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to last 90 days
        endDate: filters.endDate || new Date().toISOString().split('T')[0], // Default to today
        action: (filters.action as AuditAction) || undefined,
      });

      if (onExport) {
        onExport(exportData);
      } else {
        // Create download link
        const url = window.URL.createObjectURL(exportData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-log-${resourceType}-${resourceId}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('Failed to export logs. Please try again later.');
      console.error('Error exporting logs:', err);
    }
  };

  // Change page
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Get current page of logs
  const currentLogs = logs.slice((page - 1) * maxEntries, page * maxEntries);

  // Action options for filter
  const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: AuditAction.BOOKING_CREATE, label: 'Booking Created' },
    { value: AuditAction.BOOKING_UPDATE, label: 'Booking Updated' },
    { value: AuditAction.BOOKING_CANCEL, label: 'Booking Canceled' },
    { value: AuditAction.BOOKING_VIEW, label: 'Booking Viewed' },
    { value: AuditAction.PAYMENT, label: 'Payment Processed' },
    { value: AuditAction.REFUND, label: 'Refund Processed' },
    { value: AuditAction.EXPORT, label: 'Data Exported' },
  ];

  return (
    <div className="audit-log-viewer">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      {showFilters && (
        <div className="filters mb-4 rounded border bg-gray-50 p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Action</label>
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="w-full rounded border p-2"
              >
                {actionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="rounded border px-3 py-1 text-sm"
              type="button"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
              type="button"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading activity log...</div>
      ) : logs.length === 0 ? (
        <div className="rounded border p-6 text-center text-gray-500">
          No activity found for this {resourceType.toLowerCase()}.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {log.userName}
                      {log.employeeId && (
                        <span className="ml-1 text-xs text-gray-500">({log.employeeId})</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {getFriendlyActionName(log.action)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{getActionDetails(log)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className={`rounded border px-3 py-1 ${
                    page === 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  type="button"
                >
                  Previous
                </button>
                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className={`rounded border px-3 py-1 ${
                    page === totalPages ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showExport && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center rounded bg-green-600 px-3 py-1 text-sm text-white"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export Log
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogViewer;
