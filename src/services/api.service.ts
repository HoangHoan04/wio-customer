import axios from "axios";
import tokenCache from "@/utils/token-cache";

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4300",
  headers: { "Content-Type": "application/json" },
});

apiService.interceptors.request.use(
  (config) => {
    const token = tokenCache.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthEndpoint = error.config?.url?.includes("/auth/");
      if (!isAuthEndpoint) {
        tokenCache.clear();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("unauthorized-event"));
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiService;
