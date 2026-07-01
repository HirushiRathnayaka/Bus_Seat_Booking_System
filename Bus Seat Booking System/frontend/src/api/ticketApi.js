import axios from "axios";

const BASE = "http://localhost:8083/api/tickets";

// MyProfile – user tickets
export const getUserTickets = async (userId) => {
  const res = await axios.get(`${BASE}/user/${userId}`);
  return res.data;
};

// (optional) ticket view by ticketNo
export const getTicketByNo = async (ticketNo) => {
  const res = await axios.get(`${BASE}/no/${ticketNo}`);
  return res.data;
};
