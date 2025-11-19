import { request } from "@/lib/api-client";
import { UserRole } from "@/store/auth-store";

export interface FranqueadoUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  franqueadoProfile?: {
    id: string;
    companyName: string;
    document?: string;
    region?: string;
    notes?: string;
  };
}

export interface ListFranqueadosParams {
  search?: string;
}

export const listFranqueados = (params?: ListFranqueadosParams) =>
  request<FranqueadoUser[]>({
    method: "GET",
    url: "/users",
    params: {
      role: "FRANQUEADO",
      ...(params?.search ? { search: params.search } : {}),
    },
  });

