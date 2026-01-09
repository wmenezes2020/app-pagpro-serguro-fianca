import { request } from "@/lib/api-client";

export interface Invoice {
  id: string;
  policyId: string;
  dueDate: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  paymentMethod: "BOLETO" | "PIX";
  paidAt?: string;
  paymentReference?: string;
  barcode?: string;
  qrCode?: string;
  qrCodeImageUrl?: string;
  externalPaymentId?: string;
  paymentMetadata?: Record<string, unknown>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  policy?: {
    id: string;
    policyNumber: string;
    application?: {
      id: string;
      applicant?: {
        id: string;
        fullName?: string;
        email: string;
      };
      property?: {
        id: string;
        title: string;
        address: string;
      };
    };
  };
}

export const listInvoices = () =>
  request<Invoice[]>({
    method: "GET",
    url: "/payments/invoices",
  });

export const getInvoice = (invoiceId: string) =>
  request<Invoice>({
    method: "GET",
    url: `/payments/invoices/${invoiceId}`,
  });

export const generatePayment = (
  invoiceId: string,
  paymentMethod: "BOLETO" | "PIX"
) =>
  request<Invoice>({
    method: "POST",
    url: `/payments/invoices/${invoiceId}/generate`,
    data: { paymentMethod },
  });

export const generateAllPayments = (
  policyId: string,
  paymentMethod: "BOLETO" | "PIX" = "BOLETO"
) =>
  request<Invoice[]>({
    method: "POST",
    url: `/payments/policies/${policyId}/generate-all`,
    data: { paymentMethod },
  });

export const checkPaymentStatus = (invoiceId: string) =>
  request<Invoice>({
    method: "POST",
    url: `/payments/invoices/${invoiceId}/check-status`,
  });
