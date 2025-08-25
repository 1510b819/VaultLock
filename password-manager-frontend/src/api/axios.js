/* src/api/axios.js */

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000", // backend URL
});

// Attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
