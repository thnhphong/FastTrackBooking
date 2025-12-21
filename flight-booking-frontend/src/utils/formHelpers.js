/**
 * Shared form helper utilities
 */

/**
 * Check if input value is empty
 */
export const isInputEmpty = (value) => !value || (typeof value === 'string' && value.trim() === '');

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Format date string to YYYY/MM/DD format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

/**
 * Get numeric value from form input, handling both number and string
 */
export const getNumericValue = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  const num = Number(value);
  return isNaN(num) ? '' : num;
};

/**
 * Fields that should be converted to numbers
 */
export const NUMERIC_FIELDS = [
  'pickup_vehicle_using',
  'entry_fast_track_option',
  'departure_fast_track_option',
  'arrival_airport',
  'departure_airport_code',
  'seating_pref',
  'departure_seating_preferences',
  'sex',
  'survey_channel',
  'contact_method',
];

