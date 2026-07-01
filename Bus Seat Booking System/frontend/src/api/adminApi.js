import axios from "axios";
import { getAdminCreds } from "./adminAuth";

const API_URL = "http://localhost:8083/api/admin";
const PUBLIC_API_URL = "http://localhost:8083/api";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const publicApi = axios.create({
  baseURL: PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// helpers
const toError = (error, fallbackMsg) => {
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    (typeof error?.response?.data === "string" ? error.response.data : null) ||
    error?.message ||
    fallbackMsg;

  return new Error(msg);
};

// auth interceptor
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
  try {
    const res = await api.get("/hello");
    return res.data;
  } catch (error) {
    throw toError(error, "Failed to call admin hello");
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to fetch dashboard stats");
  }
};


// Routes
export const getRoutes = async () => {
  try {
    const response = await axios.get("http://localhost:8083/api/routes");
    return response.data;
  } catch (error) {
    throw new Error ( "Failed to load routes" );
  }
};

export const getRouteById = async (routeId) => {
  try {
    const res = await publicApi.get(`/routes/${routeId}`); // GET /api/admin/routes/{id}
    return res.data;
  } catch (error) {
    throw toError(error, "Failed to fetch route");
  }
};

export const createRoute = async (payload) => {
  try {
    const response = await api.post("/routes", payload); // POST /api/admin/routes
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to create route");
  }
};


// Buses
export const getBusesByRoute = async (routeId) => {
  try {
    const response = await api.get(`/buses/route/${routeId}`);
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to fetch buses by route");
  }
};


// Bus schedule
export const createSchedule = async (payload) => {
  try {
    const response = await publicApi.post("/buses", payload);
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to fetch schedules");
  }
};

export const getSchedules = async () => {
  try {
    const res = await api.get("/schedules"); // GET /api/admin/schedules
    return res.data;
  } catch (error) {
    throw toError(error, "Failed to fetch schedules");
  }
};


export const deleteBus = async (busId) => {
  try {
    const res = await api.delete(`/buses/${busId}`);
    return res.data;
  } catch (error) {
    throw toError(error, "Failed to delete bus");
  }
};


// Seat management
export const reserveSeat = async (payload) => {
  try {
    const response = await api.post("/seats/reserve", payload);
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to reserve seat");
  }
};

export const cancelReservation = async (bookingId) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to cancel reservation");
  }
};


// User management
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    throw toError(error, "Failed to fetch users");
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


// Reports

export const getRevenueReport = async (startDate, endDate) => {
  try {
    const response = await api.get("/revenue", {
      params: { startDate, endDate },
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
