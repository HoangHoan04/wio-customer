import tokenCache from "@/utils/token-cache";
import axios from "axios";

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4300",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      const isAuthEndpoint = originalRequest.url?.includes(
        "/auth/refresh-token",
      );

      if (isAuthEndpoint) {
        tokenCache.clear();
        window.dispatchEvent(new CustomEvent("unauthorized-event"));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiService(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenCache.getRefreshToken();
      if (!refreshToken) {
        tokenCache.clear();
        window.dispatchEvent(new CustomEvent("unauthorized-event"));
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4300"
          }/api/user/auth/refresh-token`,
          { refreshToken },
        );

        tokenCache.setAuthData(
          data.accessToken,
          data.refreshToken,
          tokenCache.getUser(),
        );

        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiService(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenCache.clear();
        window.dispatchEvent(new CustomEvent("unauthorized-event"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiService;
