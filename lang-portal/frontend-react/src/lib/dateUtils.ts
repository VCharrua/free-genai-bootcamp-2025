/**
 * Calculates the duration between two dates and returns it in a human-readable format
 * @param startTime - The start date
 * @param endTime - The end date
 * @returns A formatted string representing the duration (e.g., "5 minutes" or "1 hour 30 minutes")
 */
export const calculateDuration = (startTime: Date, endTime: Date): string => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const minutes = Math.floor(durationMs / (1000 * 60));
  
  if (minutes < 1) {
    const seconds = Math.floor(durationMs / 1000);
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
  }
};

/**
 * Formats a date to a human-readable string
 * @param date - The date to format
 * @returns A formatted date string (e.g., "Jan 5, 2023")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Formats a time to a human-readable string
 * @param date - The date to format
 * @returns A formatted time string (e.g., "3:45 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};