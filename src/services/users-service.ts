import { request } from "@/lib/api-client";
import { AuthUser } from "@/store/auth-store";

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
}

export const updateProfile = (payload: UpdateProfilePayload) =>
  request<AuthUser>({
    method: "PATCH",
    url: "/users/me",
    data: payload,
  });

export const listUsers = (role?: string) =>
  request<AuthUser[]>({
    method: "GET",
    url: "/users",
    params: role ? { role } : undefined,
  });

