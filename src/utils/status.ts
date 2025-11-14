import {
  ApplicationStatus,
  PaymentStatus,
  PolicyStatus,
  TicketStatus,
} from "@/types";
import { BadgeProps } from "@/components/ui/badge";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  SUBMITTED: "Recebida",
  IN_ANALYSIS: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  CANCELLED: "Cancelada",
};

export const policyStatusLabels: Record<PolicyStatus, string> = {
  PENDING: "Pendente",
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  CANCELLED: "Cancelada",
  CLOSED: "Encerrada",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  OVERDUE: "Em atraso",
  CANCELLED: "Cancelado",
};

export const ticketStatusLabels: Record<TicketStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em atendimento",
  RESOLVED: "Resolvido",
  CLOSED: "Encerrado",
};

export const statusVariant = (
  status: ApplicationStatus | PolicyStatus | PaymentStatus | TicketStatus,
): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    APPROVED: "success",
    ACTIVE: "success",
    PAID: "success",
    RESOLVED: "success",

    SUBMITTED: "default",
    PENDING: "default",
    IN_ANALYSIS: "default",
    IN_PROGRESS: "default",

    CANCELLED: "danger",
    REJECTED: "danger",
    OVERDUE: "danger",
    CLOSED: "danger",

    SUSPENDED: "warning",
  };

  return map[status] ?? "outline";
};

