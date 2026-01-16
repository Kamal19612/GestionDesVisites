/**
 * Formats a date string to a localized string.
 * @param {string|Date} dateString - The date to format.
 * @param {string} locale - The locale code (e.g., 'fr', 'en').
 * @returns {string} The formatted date string or '—' if invalid.
 */
export const formatDate = (dateString, locale = 'fr') => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formats a time string (HH:MM:SS) to HH:MM.
 * @param {string} timeString - The time string to format.
 * @returns {string} The formatted time string.
 */
export const formatTime = (timeString) => {
  if (!timeString) return '—';
  // Check if it's a full ISO string or just time
  if (timeString.includes('T')) {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return timeString.substring(0, 5);
};

/**
 * Formats a date and time.
 * @param {string|Date} dateString - The date/time to format.
 * @param {string} locale - The locale code.
 * @returns {string} The formatted date and time string.
 */
export const formatDateTime = (dateString, locale = 'fr') => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return date.toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
