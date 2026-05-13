// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "https://fypmanagementsystem-production.up.railway.app",
//   withCredentials: true,
// });

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export default api;
