import axios from "axios";

export const api = axios.create({
  baseURL: "https://doctor-dashboard-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});