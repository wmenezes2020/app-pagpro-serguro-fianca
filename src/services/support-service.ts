import { request } from "@/lib/api-client";
import { SupportTicket, TicketStatus } from "@/types";

export interface CreateSupportTicketPayload {
  subject: string;
  message: string;
}

export interface UpdateSupportTicketPayload {
  status?: TicketStatus;
  assignedToId?: string;
  message?: string;
}

export const createTicket = (payload: CreateSupportTicketPayload) =>
  request<SupportTicket>({
    method: "POST",
    url: "/support",
    data: payload,
  });

export const listTickets = () =>
  request<SupportTicket[]>({
    method: "GET",
    url: "/support",
  });

export const updateTicket = (
  id: string,
  payload: UpdateSupportTicketPayload,
) =>
  request<SupportTicket>({
    method: "PATCH",
    url: `/support/${id}`,
    data: payload,
  });

