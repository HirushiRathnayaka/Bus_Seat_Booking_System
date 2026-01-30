import axios from "axios";

const API_URL = "http://localhost:8080/api/seats";

export const getSeatsByBus = async (busId) => {
  try {
    const res = await axios.get(`${API_URL}/bus/${busId}`);
    return res;
  } catch (error) {
    console.error("Error fetching seats:", error);
    // Return empty array on error
    return { data: [] };
  }
};

export const bookSeat = async (seatId) => {
  try {
    const res = await axios.post(`${API_URL}/${seatId}/book`);
    return res.data;
  } catch (error) {
    console.error("Error booking seat:", error);
    throw error;
  }
};