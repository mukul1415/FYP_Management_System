import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://fypmanagementsystem-production.up.railway.app",
  withCredentials: true,
});
