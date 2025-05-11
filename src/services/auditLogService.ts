import axios from 'axios';
import authService from './authService';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  employeeId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
  PRINT = 'print',
  SEARCH = 'search',
  PAYMENT = 'payment',
  REFUND = 'refund',
  BOOKING_CREATE = 'booking_create',
  BOOKING_UPDATE = 'booking_update',
  BOOKING_CANCEL = 'booking_cancel',
  BOOKING_VIEW = 'booking_view',
  SENSITIVE_ACTION = 'sensitive_action',
}

export enum ResourceType {
  USER = 'user',
  BOOKING = 'booking',
  TRIP = 'trip',
  PAYMENT = 'payment',
  CUSTOMER = 'customer',
  SYSTEM = 'system',
  REPORT = 'report',
  ITINERARY = 'itinerary',
}

class AuditLogService {
  private logQueue: Array<Omit<AuditLogEntry, 'id' | 'timestamp' | 'ip' | 'userAgent'>> = [];
  private isSending = false;
  private flushInterval: number | null = null;

  constructor() {
    // Set up periodic flush of log queue
    this.flushInterval = window.setInterval(() => this.flushLogs(), 30000);
  }

  /**
   * Log an action to the audit log
   */
  async log(
    action: AuditAction,
    resourceType: ResourceType,
    resourceId: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    const user = authService.getCurrentUser();

    if (!user) {
      console.warn('Attempted to log action but no user is authenticated');
      return;
    }

    // Create log entry (ID and timestamp will be added by the server)
    const logEntry = {
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      employeeId: user.employeeId,
      action,
      resourceType,
      resourceId,
      details,
    };

    // Add to queue
    this.logQueue.push(logEntry);

    // If queue gets too large, flush immediately
    if (this.logQueue.length >= 10) {
      this.flushLogs();
    }
  }

  /**
   * Log a booking modification
   */
  async logBookingModification(
    bookingId: string,
    changes: Record<string, any>,
    reason?: string
  ): Promise<void> {
    return this.log(AuditAction.BOOKING_UPDATE, ResourceType.BOOKING, bookingId, {
      changes,
      reason,
    });
  }

  /**
   * Log a booking creation
   */
  async logBookingCreation(bookingId: string, bookingDetails: Record<string, any>): Promise<void> {
    return this.log(AuditAction.BOOKING_CREATE, ResourceType.BOOKING, bookingId, bookingDetails);
  }

  /**
   * Log a booking cancellation
   */
  async logBookingCancellation(bookingId: string, reason?: string): Promise<void> {
    return this.log(AuditAction.BOOKING_CANCEL, ResourceType.BOOKING, bookingId, { reason });
  }

  /**
   * Log a sensitive action that requires two-factor auth
   */
  async logSensitiveAction(
    resourceType: ResourceType,
    resourceId: string,
    action: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    return this.log(AuditAction.SENSITIVE_ACTION, resourceType, resourceId, {
      ...details,
      sensitiveAction: action,
      twoFactorVerified: true,
    });
  }

  /**
   * Get audit logs for a specific resource
   */
  async getLogsForResource(
    resourceType: ResourceType,
    resourceId: string
  ): Promise<AuditLogEntry[]> {
    try {
      const response = await axios.get(`/api/audit-logs`, {
        params: {
          resourceType,
          resourceId,
        },
      });

      return response.data.logs;
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return [];
    }
  }

  /**
   * Get audit logs for a specific user
   */
  async getLogsForUser(userId: string): Promise<AuditLogEntry[]> {
    try {
      const response = await axios.get(`/api/audit-logs`, {
        params: {
          userId,
        },
      });

      return response.data.logs;
    } catch (error) {
      console.error('Failed to retrieve user audit logs:', error);
      return [];
    }
  }

  /**
   * Search audit logs with filters
   */
  async searchLogs(filters: {
    userId?: string;
    action?: AuditAction;
    resourceType?: ResourceType;
    resourceId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLogEntry[]; total: number; page: number; totalPages: number }> {
    try {
      const response = await axios.get(`/api/audit-logs/search`, {
        params: filters,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to search audit logs:', error);
      return { logs: [], total: 0, page: 1, totalPages: 0 };
    }
  }

  /**
   * Flush log queue to server
   */
  private async flushLogs(): Promise<void> {
    if (this.isSending || this.logQueue.length === 0) {
      return;
    }

    try {
      this.isSending = true;
      const logsToSend = [...this.logQueue];
      this.logQueue = [];

      await axios.post('/api/audit-logs/batch', {
        logs: logsToSend,
      });
    } catch (error) {
      console.error('Failed to send audit logs:', error);
      // Put logs back in queue to retry later
      this.logQueue = [...this.logQueue, ...this.logQueue];

      // Cap queue size to prevent memory issues
      if (this.logQueue.length > 100) {
        console.warn('Audit log queue too large, dropping oldest entries');
        this.logQueue = this.logQueue.slice(-100);
      }
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Export logs for compliance reporting
   */
  async exportLogs(filters: {
    startDate: string;
    endDate: string;
    userId?: string;
    action?: AuditAction;
    resourceType?: ResourceType;
  }): Promise<Blob> {
    try {
      const response = await axios.get('/api/audit-logs/export', {
        params: filters,
        responseType: 'blob',
      });

      // Log the export action
      this.log(AuditAction.EXPORT, ResourceType.REPORT, 'audit-logs', { filters });

      return response.data;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw error;
    }
  }

  /**
   * Clean up resources when service is destroyed
   */
  destroy(): void {
    if (this.flushInterval !== null) {
      window.clearInterval(this.flushInterval);
    }

    // Flush any remaining logs
    this.flushLogs();
  }
}

// Create and export a singleton instance
const auditLogService = new AuditLogService();

export default auditLogService;
