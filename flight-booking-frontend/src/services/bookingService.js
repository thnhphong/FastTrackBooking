import axios from 'axios';
import api from './api';

export const createBooking = async (bookingData) => {
  try{
  // Send directly to operator web-booking API (production endpoint)
  // Use axios directly to avoid baseURL interference
  const response = await axios.post(
    'https://operator-dev.vietjapan.vip/api/fast-track-bookings/web-booking',
    bookingData,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );
  return response.data;
  } catch (error) {
    console.error('Booking Error:', error.response?.data || error.message);
    throw error;
  }
};

export const validateCoupon = async (couponCode) => {
  // Trim and encode the coupon code for URL
  const encodedCode = encodeURIComponent(couponCode.trim().toUpperCase());
  const response = await api.get(`/coupons/validate/${encodedCode}`);
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

