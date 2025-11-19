import { request } from "@/lib/api-client";

export interface CreateFranqueadoPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  document?: string;
  region?: string;
  notes?: string;
}

export interface CreateImobiliariaPayload {
  fullName: string;
  email: string;
  password: string;
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

export interface CreateCorretorPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  cpf: string;
  creci?: string;
  brokerageName?: string;
}

export const createFranqueado = (payload: CreateFranqueadoPayload) =>
  request({
    method: "POST",
    url: "/users/franqueados",
    data: payload,
  });

export const createImobiliaria = (payload: CreateImobiliariaPayload) =>
  request({
    method: "POST",
    url: "/users/imobiliarias",
    data: payload,
  });

export const createCorretor = (payload: CreateCorretorPayload) =>
  request({
    method: "POST",
    url: "/users/corretores",
    data: payload,
  });

