import { request } from "@/lib/api-client";
import {
  ApplicationStatus,
  DashboardMetrics,
  PaymentStatus,
  RentalApplication,
} from "@/types";

export interface CreateApplicationPayload {
  propertyId: string;
  applicantId?: string;
  brokerId?: string;
  monthlyIncome: number;
  hasNegativeRecords: boolean;
  employmentStatus?: string;
  documents?: Record<string, string>;
  notes?: string;
}

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
  notes?: string;
}

export interface UpdatePaymentStatusPayload {
  paymentId: string;
  status: PaymentStatus;
  paymentReference?: string;
  notes?: string;
}

export const listApplications = () =>
  request<RentalApplication[]>({
    method: "GET",
    url: "/applications",
  });

export const getApplication = (id: string) =>
  request<RentalApplication>({
    method: "GET",
    url: `/applications/${id}`,
  });

export const createApplication = (payload: CreateApplicationPayload) =>
  request<RentalApplication>({
    method: "POST",
    url: "/applications",
    data: payload,
  });

export const updateApplicationStatus = (
  id: string,
  payload: UpdateApplicationStatusPayload,
) =>
  request<RentalApplication>({
    method: "PATCH",
    url: `/applications/${id}/status`,
    data: payload,
  });

export const updatePaymentStatus = (payload: UpdatePaymentStatusPayload) =>
  request({
    method: "PATCH",
    url: "/applications/payments/status",
    data: payload,
  });

export const fetchDashboardMetrics = () =>
  request<DashboardMetrics>({
    method: "GET",
    url: "/applications/dashboard/kpis",
  });

export const reanalyzeApplication = (id: string) =>
  request<RentalApplication>({
    method: "POST",
    url: `/applications/${id}/reanalyze`,
  });

