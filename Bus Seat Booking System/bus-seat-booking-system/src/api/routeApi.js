import axios from "axios";

const BASE_URL = "http://localhost:8080/api/routes";

export const getAllRoutes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching routes", error);
    return []; // Return empty array instead of throwing
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching route", error);
    throw error;
  }
};