import axios from "axios";

const API_URL = "http://localhost:8083/api/admin";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const { username, password } = getAdminCreds();

    if (username && password) {
      const basic = btoa(username + ":" + password);
      config.headers.Authorization = "Basic " + basic;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Test endpoint
export const adminHello = async () => {
  const response = await api.get("/hello");
  return response.data;
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch dashboard stats" };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user role" };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete user" };
  }
};

export const getRevenueReport = async (startDate, endDate) => {
  try {
    const response = await api.get("/revenue", {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch revenue report" };
  }
};