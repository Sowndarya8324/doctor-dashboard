import axios from "axios";

export const api = axios.create({
  baseURL: "https://gold-experts-cover.loca.lt",
  headers: {
    "Content-Type": "application/json",
  },
});