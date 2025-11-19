import { request } from "@/lib/api-client";
import { UserRole } from "@/store/auth-store";

export interface PartnerLink {
  id: string;
  token: string;
  targetRole: UserRole;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
}

export interface CreatePartnerLinkPayload {
  targetRole: UserRole;
  maxUses?: number;
  expiresAt?: string;
  notes?: string;
}

export interface UpdatePartnerLinkPayload {
  targetRole?: UserRole;
  maxUses?: number;
  expiresAt?: string;
  notes?: string;
  isActive?: boolean;
}

export interface InviteDetails {
  token: string;
  targetRole: UserRole;
  issuer: {
    id: string;
    name: string;
    role: UserRole;
  };
  expiresAt?: string;
  maxUses: number;
  remainingUses: number;
  notes?: string;
}

export const createPartnerLink = (payload: CreatePartnerLinkPayload) =>
  request<PartnerLink>({
    method: "POST",
    url: "/partner-links",
    data: payload,
  });

export const listPartnerLinks = () =>
  request<PartnerLink[]>({
    method: "GET",
    url: "/partner-links",
  });

export const fetchInviteDetails = (token: string) =>
  request<InviteDetails>({
    method: "GET",
    url: `/partner-links/${token}`,
  });

export const updatePartnerLink = (id: string, payload: UpdatePartnerLinkPayload) =>
  request<PartnerLink>({
    method: "PUT",
    url: `/partner-links/${id}`,
    data: payload,
  });


