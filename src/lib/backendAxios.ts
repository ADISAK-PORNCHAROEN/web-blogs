import axios from "axios";

const backendAxios = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default backendAxios;
