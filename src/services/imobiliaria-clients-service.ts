import { request } from "@/lib/api-client";

export type ClientStatus =
  | "NEW"
  | "IN_ANALYSIS"
  | "APPROVED"
  | "REJECTED"
  | "DOCUMENTS_PENDING"
  | "ONBOARDING";

export interface ImobiliariaClient {
  id: string;
  fullName: string;
  document: string;
  email?: string;
  phone?: string;
  monthlyIncome?: number | null;
  origin?: string | null;
  status: ClientStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImobiliariaClientPayload {
  fullName: string;
  document: string;
  email?: string;
  phone?: string;
  monthlyIncome?: number;
  origin?: string;
  status?: ClientStatus;
  notes?: string;
}

export type UpdateImobiliariaClientPayload = Partial<
  CreateImobiliariaClientPayload
>;

export interface ListImobiliariaClientsParams {
  status?: ClientStatus;
  search?: string;
}

export const listImobiliariaClients = (
  params: ListImobiliariaClientsParams = {},
) =>
  request<ImobiliariaClient[]>({
    method: "GET",
    url: "/imobiliaria/clients",
    params,
  });

export const createImobiliariaClient = (
  payload: CreateImobiliariaClientPayload,
) =>
  request<ImobiliariaClient>({
    method: "POST",
    url: "/imobiliaria/clients",
    data: payload,
  });

export const updateImobiliariaClient = (
  id: string,
  payload: UpdateImobiliariaClientPayload,
) =>
  request<ImobiliariaClient>({
    method: "PATCH",
    url: `/imobiliaria/clients/${id}`,
    data: payload,
  });

export const deleteImobiliariaClient = (id: string) =>
  request<void>({
    method: "DELETE",
    url: `/imobiliaria/clients/${id}`,
  });


