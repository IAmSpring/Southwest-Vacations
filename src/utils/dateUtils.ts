/**
 * Date formatting utilities for the Southwest Vacations app
 */

/**
 * Formats a date string (YYYY-MM-DD) into a more user-friendly format
 * @param dateString ISO date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "June 15, 2023")
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Returns a day of week label for a date
 * @param dateString ISO date string in YYYY-MM-DD format
 * @returns Day of week (e.g., "Monday")
 */
export const getDayOfWeek = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

/**
 * Gets the number of days between two dates
 * @param startDate Start date string in YYYY-MM-DD format
 * @param endDate End date string in YYYY-MM-DD format
 * @returns Number of days between dates
 */
export const getDaysBetween = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a date is in the past
 * @param dateString ISO date string in YYYY-MM-DD format
 * @returns Boolean indicating if date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date < today;
};

/**
 * Groups available dates by month
 * @param dates Array of date strings
 * @returns Object with months as keys and arrays of dates as values
 */
export const groupDatesByMonth = (dates: string[]): Record<string, string[]> => {
  if (!dates || !dates.length) return {};

  return dates.reduce(
    (groups, date) => {
      const month = new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(date);
      return groups;
    },
    {} as Record<string, string[]>
  );
};
