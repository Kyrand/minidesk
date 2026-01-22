/**
 * Format a timestamp into a human-readable relative date string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string (e.g., "Today", "Yesterday", "3 days ago", "Jan 15, 2026")
 */
export function formatDate(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  // Reset time components to compare dates only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = today.getTime() - compareDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays > 1 && diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    // Format as "MMM DD, YYYY"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }
}
