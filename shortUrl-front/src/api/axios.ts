import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: "https://url-shortener-04ga.onrender.com:3000/api",
  withCredentials: true, // Automatically send cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Get refresh token from store
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token available");

        // Request new access token (stored in cookies)
        await axiosInstance.post("/auth/refresh", { refreshToken });

        // Retry the original request without manually setting the Authorization header
        return axiosInstance(originalRequest);
      } catch (err) {
        useAuthStore.getState().clearTokens();
        window.location.href = "/auth";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default useAuthStore;
