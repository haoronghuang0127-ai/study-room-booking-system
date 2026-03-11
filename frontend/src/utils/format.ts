// Utility functions for formatting dates and times
import dayjs from 'dayjs';

// Format a date string into a more readable format (e.g., "DD MMM YYYY")
export function formatDate(date?: string) {
  return date ? dayjs(date).format('DD MMM YYYY') : '-';
}

// Format a time string (e.g., "HH:mm") or return '-' if the time is not provided
export function formatTime(time?: string) {
  return time ? dayjs(`2000-01-01T${time}`).format('HH:mm') : '-';
}

// Format a date-time string into a more readable format (e.g., "DD MMM YYYY HH:mm")
export function formatDateTime(value?: string) {
  return value ? dayjs(value).format('DD MMM YYYY HH:mm') : '-';
}