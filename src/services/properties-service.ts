import { request } from "@/lib/api-client";
import { Property, PropertyStatus } from "@/types";

export interface CreatePropertyPayload {
  title: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  rentValue: number;
  description?: string;
  status?: PropertyStatus;
  amenities?: Record<string, unknown>;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

export const listProperties = () =>
  request<Property[]>({
    method: "GET",
    url: "/properties",
  });

export const getProperty = (id: string) =>
  request<Property>({
    method: "GET",
    url: `/properties/${id}`,
  });

export const createProperty = (payload: CreatePropertyPayload) =>
  request<Property>({
    method: "POST",
    url: "/properties",
    data: payload,
  });

export const updateProperty = (id: string, payload: UpdatePropertyPayload) =>
  request<Property>({
    method: "PATCH",
    url: `/properties/${id}`,
    data: payload,
  });

export const removeProperty = (id: string) =>
  request<{ success: boolean }>({
    method: "DELETE",
    url: `/properties/${id}`,
  });

