import axios from "axios";

const API_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (data) => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
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