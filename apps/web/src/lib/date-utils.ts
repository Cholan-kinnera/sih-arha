/**
 * Time and date formatting utilities for LEWS telemetry and alerts.
 */

/**
 * Format relative elapsed time from timestamp string (e.g. "4s ago", "2m ago").
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return 'Just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

/**
 * Format timestamp into standard operational UTC/Local string (e.g. "14:30:15 UTC").
 */
export function formatOperationalTime(dateString: string | null | undefined): string {
  if (!dateString) return '--:--:--';
  const date = new Date(dateString);
  return date.toTimeString().split(' ')[0] ?? dateString;
}
