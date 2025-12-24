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

/**
 * Format ISO date string to YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
};

/**
 * Convert airport code number to airport code string
 */
export const formatAirportCode = (code) => {
  const airportMap = {
    0: 'SGN',
    1: 'DAD',
    2: 'HAN',
  };
  return airportMap[code] !== undefined ? airportMap[code] : code;
};

/**
 * Format API response data for better readability
 * - Converts numeric booleans (1/0) to true/false
 * - Formats ISO dates to YYYY-MM-DD
 * - Converts airport codes (0,1,2) to (SGN, DAD, HAN)
 * - Adds add_ons from original bookingData if available
 */
export const formatApiResponse = (apiResponse, originalBookingData = null) => {
  if (!apiResponse || !apiResponse.data) return apiResponse;

  const formatted = JSON.parse(JSON.stringify(apiResponse)); // Deep clone

  // Convert numeric booleans to actual booleans
  if (formatted.data.tarmac_pickup !== undefined) {
    formatted.data.tarmac_pickup = formatted.data.tarmac_pickup === 1 || formatted.data.tarmac_pickup === '1';
  }
  if (formatted.data.use_immigration_fast_track !== undefined) {
    formatted.data.use_immigration_fast_track = formatted.data.use_immigration_fast_track === 1 || formatted.data.use_immigration_fast_track === '1';
  }

  // Format dates from ISO to YYYY-MM-DD
  if (formatted.data.arrival_date) {
    formatted.data.arrival_date = formatDateToYYYYMMDD(formatted.data.arrival_date);
  }
  if (formatted.data.departure_date) {
    formatted.data.departure_date = formatDateToYYYYMMDD(formatted.data.departure_date);
  }

  // Convert airport codes to airport code strings
  if (formatted.data.arrival_airport !== undefined && formatted.data.arrival_airport !== null) {
    formatted.data.arrival_airport = formatAirportCode(formatted.data.arrival_airport);
  }
  if (formatted.data.departure_airport_code !== undefined && formatted.data.departure_airport_code !== null) {
    formatted.data.departure_airport_code = formatAirportCode(formatted.data.departure_airport_code);
  }

  // Add add_ons from original bookingData if available
  if (originalBookingData && Array.isArray(originalBookingData.add_ons) && originalBookingData.add_ons.length > 0) {
    formatted.data.add_ons = originalBookingData.add_ons;
  } else if (originalBookingData?.add_ons) {
    formatted.data.add_ons = originalBookingData.add_ons;
  }

  return formatted;
};

/**
 * Normalize API response to ensure all boolean/number values are converted to strings
 * This ensures consistent string format for automation/email systems
 * Converts: true -> "true", false -> "false", 1 -> "1", 0 -> "0"
 */
export const normalizeApiResponseToStrings = (apiResponse) => {
  if (!apiResponse) return apiResponse;

  const normalized = JSON.parse(JSON.stringify(apiResponse)); // Deep clone

  // Normalize the data object if it exists
  if (normalized.data) {
    // Convert boolean/number values to strings for specific fields
    if (normalized.data.tarmac_pickup !== undefined && normalized.data.tarmac_pickup !== null) {
      normalized.data.tarmac_pickup = (normalized.data.tarmac_pickup === true || normalized.data.tarmac_pickup === 1 || normalized.data.tarmac_pickup === '1') ? 'true' : 'false';
    }

    if (normalized.data.use_immigration_fast_track !== undefined && normalized.data.use_immigration_fast_track !== null) {
      normalized.data.use_immigration_fast_track = (normalized.data.use_immigration_fast_track === true || normalized.data.use_immigration_fast_track === 1 || normalized.data.use_immigration_fast_track === '1') ? 'true' : 'false';
    }

    if (normalized.data.use_departure_fast_track !== undefined && normalized.data.use_departure_fast_track !== null) {
      normalized.data.use_departure_fast_track = String(normalized.data.use_departure_fast_track);
    }
  }

  return normalized;
};

