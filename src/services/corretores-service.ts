import { request } from "@/lib/api-client";
import { UserRole } from "@/store/auth-store";

export interface CorretorUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  corretorProfile?: {
    id: string;
    fullName?: string;
    cpf?: string;
    creci?: string;
    phone?: string;
    brokerageName?: string;
  };
}

export interface ListCorretoresParams {
  search?: string;
}

export const listCorretores = (params?: ListCorretoresParams) =>
  request<CorretorUser[]>({
    method: "GET",
    url: "/users",
    params: {
      role: "CORRETOR",
      ...(params?.search ? { search: params.search } : {}),
    },
  });

