/**
 * Terminal-style formatting utilities for the hacker theme
 */

/**
 * Format text as a file size-like metadata (based on word count)
 */
export function formatAsSize(text: string): string {
  const words = text?.split(' ').length || 0;
  return `${words * 50}B`;
}

/**
 * Format date as ls -la style (e.g., "Jan  5 2024")
 */
export function formatLsDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate().toString().padStart(2, ' ');
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
}
