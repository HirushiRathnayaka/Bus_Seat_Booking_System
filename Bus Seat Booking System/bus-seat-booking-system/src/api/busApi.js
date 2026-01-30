import axios from "axios";

const API_URL = "http://localhost:8080/api/buses";

export const getBusesByRoute = (routeId) =>
  axios.get(`${API_URL}/route/${routeId}`);