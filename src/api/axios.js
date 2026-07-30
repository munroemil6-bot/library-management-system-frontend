import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "https://library-management-system-backend-91dw.onrender.com/api").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        response: { data: { error: "Network error. Please check your connection." } },
      });
    }

    if (error.response.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
