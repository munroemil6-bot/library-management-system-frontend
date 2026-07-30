import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000, // 15s timeout — prevents hanging requests
});

// Response interceptor — handle session expiry and network failures globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or server down — return friendly message
      return Promise.reject({
        response: { data: { error: "Network error. Please check your connection." } },
      });
    }

    if (error.response.status === 401) {
      // Session expired — clear local user and redirect to login
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
