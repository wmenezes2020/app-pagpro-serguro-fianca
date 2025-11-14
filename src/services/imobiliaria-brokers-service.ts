import { request } from "@/lib/api-client";

export type BrokerStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "INVITED"
  | "PENDING_DOCUMENTS";

export interface ImobiliariaBroker {
  id: string;
  fullName: string;
  cpf: string;
  creci?: string;
  email?: string;
  phone?: string;
  status: BrokerStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImobiliariaBrokerPayload {
  fullName: string;
  cpf: string;
  creci?: string;
  email?: string;
  phone?: string;
  status?: BrokerStatus;
  notes?: string;
}

export type UpdateImobiliariaBrokerPayload = Partial<
  CreateImobiliariaBrokerPayload
>;

export interface ListImobiliariaBrokersParams {
  status?: BrokerStatus;
  search?: string;
}

export const listImobiliariaBrokers = (
  params: ListImobiliariaBrokersParams = {},
) =>
  request<ImobiliariaBroker[]>({
    method: "GET",
    url: "/imobiliaria/brokers",
    params,
  });

export const createImobiliariaBroker = (
  payload: CreateImobiliariaBrokerPayload,
) =>
  request<ImobiliariaBroker>({
    method: "POST",
    url: "/imobiliaria/brokers",
    data: payload,
  });

export const updateImobiliariaBroker = (
  id: string,
  payload: UpdateImobiliariaBrokerPayload,
) =>
  request<ImobiliariaBroker>({
    method: "PATCH",
    url: `/imobiliaria/brokers/${id}`,
    data: payload,
  });

export const deleteImobiliariaBroker = (id: string) =>
  request<void>({
    method: "DELETE",
    url: `/imobiliaria/brokers/${id}`,
  });


