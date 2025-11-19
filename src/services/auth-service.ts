import { request } from "@/lib/api-client";
import { AuthUser } from "@/store/auth-store";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterImobiliariaPayload {
  inviteToken: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  companyName: string;
  cnpj: string;
  creci?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface RegisterInquilinoPayload {
  inviteToken: string;
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  birthDate?: string;
  phone?: string;
  monthlyIncome: number;
  hasNegativeRecords: boolean;
  employmentStatus?: string;
}

export interface RegisterCorretorPayload {
  inviteToken: string;
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  creci?: string;
  phone?: string;
  brokerageName?: string;
}

export interface RegisterFranqueadoPayload {
  inviteToken: string;
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  document?: string;
  region?: string;
  phone?: string;
  notes?: string;
}

export const login = (payload: LoginPayload) =>
  request<AuthResponse>({
    method: "POST",
    url: "/auth/login",
    data: payload,
  });

export const registerImobiliaria = (payload: RegisterImobiliariaPayload) =>
  request<AuthResponse>({
    method: "POST",
    url: "/auth/register/imobiliaria",
    data: payload,
  });

export const registerInquilino = (payload: RegisterInquilinoPayload) =>
  request<AuthResponse>({
    method: "POST",
    url: "/auth/register/inquilino",
    data: payload,
  });

export const registerCorretor = (payload: RegisterCorretorPayload) =>
  request<AuthResponse>({
    method: "POST",
    url: "/auth/register/corretor",
    data: payload,
  });

export const registerFranqueado = (payload: RegisterFranqueadoPayload) =>
  request<AuthResponse>({
    method: "POST",
    url: "/auth/register/franqueado",
    data: payload,
  });

export const fetchCurrentUser = () =>
  request<AuthUser>({
    method: "GET",
    url: "/auth/me",
  });

export const logout = () =>
  request<{ success: boolean }>({
    method: "POST",
    url: "/auth/logout",
  });

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  request<{ success: boolean }>({
    method: "POST",
    url: "/auth/forgot-password",
    data: payload,
  });

export const resetPassword = (payload: ResetPasswordPayload) =>
  request<{ success: boolean }>({
    method: "POST",
    url: "/auth/reset-password",
    data: payload,
  });

