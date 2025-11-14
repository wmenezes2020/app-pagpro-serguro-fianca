"use client";

import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { AuthUser, useAuthStore } from "@/store/auth-store";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

type QueuedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig & { _retry?: boolean };
};

const failedQueue: QueuedRequest[] = [];
let isRefreshing = false;

const processQueue = (error: unknown, token: string | null) => {
  while (failedQueue.length > 0) {
    const { resolve, reject, config } = failedQueue.shift()!;
    if (error) {
      reject(error);
    } else {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(apiClient(config));
    }
  }
};

export const apiClient = axios.create({
  baseURL,
});

const refreshClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Se for FormData, não definir Content-Type - deixar o axios fazer isso automaticamente
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config ??
      {}) as InternalAxiosRequestConfig & { _retry?: boolean };

    const status = error.response?.status;
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post<{
        tokens: { accessToken: string; refreshToken: string };
        user: AuthUser;
      }>("/auth/refresh", {
        refreshToken,
      });

      useAuthStore.getState().setTokens(data.tokens);
      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }

      processQueue(null, data.tokens.accessToken);
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export const request = <T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> => apiClient.request<T>(config).then((response) => response.data);

