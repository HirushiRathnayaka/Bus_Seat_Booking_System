import axios from "axios";

const API_URL = "http://localhost:8083/api/bookings";

export const createBooking = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data; // backend response
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error; // frontend catch
  }
};

export const getAllBookings = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return []; // Return empty array instead of throwing
  }
};

export const getUserBookings = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

export const getBookingsByBus = async (busId) => {
  const res = await axios.get(`${API_URL}/bus/${busId}`);
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await axios.put(`${API_URL}/${bookingId}/cancel`);
  return res.data;
};