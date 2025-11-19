import { request } from "@/lib/api-client";
import { UserRole } from "@/store/auth-store";

export interface ImobiliariaUser {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  imobiliariaProfile?: {
    id: string;
    companyName: string;
    cnpj: string;
    creci?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
}

export interface ListImobiliariasParams {
  search?: string;
}

export const listImobiliarias = (params?: ListImobiliariasParams) =>
  request<ImobiliariaUser[]>({
    method: "GET",
    url: "/users",
    params: {
      role: "IMOBILIARIA",
      ...(params?.search ? { search: params.search } : {}),
    },
  });

