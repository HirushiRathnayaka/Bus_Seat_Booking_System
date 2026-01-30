import axios from "axios";

const API = "http://localhost:8080/api/auth";

export const login = (data) => axios.post(`${API}/login`, data);

export const register = (data) => axios.post(`${API}/register`, data);

// Add these new API calls
export const createAdmin = (data, token) => 
  axios.post(`${API}/create-admin`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getAllUsers = (token) => 
  axios.get(`${API}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateUserRole = (userId, role, token) =>
  axios.put(`${API}/users/${userId}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` }
  });