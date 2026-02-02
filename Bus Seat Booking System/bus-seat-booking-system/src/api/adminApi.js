import axios from "axios";
import { getAdminCreds } from "./adminAuth";

const API_URL = "http://localhost:8083/api/admin";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//auth interceptor
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

// Test / dashboard
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

// bus schedule

export const createSchedule = async (payload) => {
  try {
    const response = await api.post("/schedules", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to create bus schedule" }
    );
  }
};

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await api.delete(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to delete bus schedule" }
    );
  }
};

//seat management

export const reserveSeat = async (payload) => {
  try {
    const response = await api.post("/seats/reserve", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to reserve seat" }
    );
  }
};

export const cancelReservation = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to cancel reservation" }
    );
  }
};

//user management

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

// reports

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

export const getReservedSeats = async () => {
  try {
    const response = await api.get("/seats/reserved");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch reserved seats" };
  }
};

export const getCancelledSeats = async () => {
  try {
    const response = await api.get("/seats/cancelled");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch cancelled seats" };
  }
};

