"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/services/auth-service";
import { AuthUser, useAuthStore } from "@/store/auth-store";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      clearAuth();
      router.replace("/login");
    }
  }, [accessToken, refreshToken, router, clearAuth]);

  const shouldFetch = Boolean(accessToken && refreshToken && !user);

  const {
    data,
    isLoading,
    error,
  } = useQuery<AuthUser>({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error) {
      clearAuth();
      router.replace("/login");
    }
  }, [error, clearAuth, router]);

  return {
    user,
    isLoading: shouldFetch || isLoading,
    pathname,
  };
}

