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
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Aguardar a hidratação antes de verificar tokens
  useEffect(() => {
    // Se ainda não hidratou, não fazer nada
    if (!hasHydrated) {
      return;
    }

    // Após hidratação, verificar se há tokens
    if (!accessToken || !refreshToken) {
      clearAuth();
      router.replace("/login");
    }
  }, [hasHydrated, accessToken, refreshToken, router, clearAuth]);

  // Só buscar usuário se tiver tokens E já hidratou E não tem user
  const shouldFetch = Boolean(
    hasHydrated && accessToken && refreshToken && !user
  );

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
    // Só tratar erro se já hidratou
    if (hasHydrated && error) {
      clearAuth();
      router.replace("/login");
    }
  }, [hasHydrated, error, clearAuth, router]);

  // Retornar loading enquanto não hidratou OU enquanto está buscando user
  const isLoadingState = !hasHydrated || (shouldFetch && isLoading);

  return {
    user,
    isLoading: isLoadingState,
    pathname,
  };
}

