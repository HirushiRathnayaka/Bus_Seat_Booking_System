import axios from "axios";
import { getAdminCreds } from "./adminAuth";

const BASE = "http://localhost:8083/api/admin/users";

const adminHeaders = () => {
  const { username, password } = getAdminCreds();
  if (!username || !password) throw new Error("Admin creds missing. Please login again.");
  return { Authorization: "Basic " + btoa(username + ":" + password) };
};

export const getAllUsersAdmin = async () => {
  const res = await axios.get(BASE, { headers: adminHeaders() });
  return res.data;
};

export const updateUserRoleAdmin = async (id, role) => {
  const res = await axios.patch(
    `${BASE}/${id}/role`,
    { role },
    { headers: { ...adminHeaders(), "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteUserAdmin = async (id) => {
  const res = await axios.delete(`${BASE}/${id}`, { headers: adminHeaders() });
  return res.data;
};