"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole =
  | "ADMIN"
  | "DIRECTOR"
  | "FRANQUEADO"
  | "IMOBILIARIA"
  | "INQUILINO"
  | "CORRETOR";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string | null;
  phone?: string | null;
  imobiliariaProfile?: unknown;
  inquilinoProfile?: unknown;
  corretorProfile?: unknown;
  franqueadoProfile?: unknown;
  parent?: Pick<AuthUser, "id" | "role" | "fullName" | "email"> | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticating: boolean;
  hasHydrated: boolean;
  setAuth: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setAuthenticating: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  clearAuth: () => void;
}

const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

const createStorage = () => {
  if (typeof window === "undefined") {
    return createJSONStorage(() => noopStorage);
  }
  return createJSONStorage(() => window.localStorage);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticating: false,
      hasHydrated: false,
      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticating: false,
        }),
      setUser: (user) => set({ user }),
      setTokens: ({ accessToken, refreshToken }) =>
        set({
          accessToken,
          refreshToken,
        }),
      setAuthenticating: (value) => set({ isAuthenticating: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticating: false,
        }),
    }),
    {
      name: "pagpro-auth",
      storage: createStorage(),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Marcar como hidratado após a reidratação
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);

