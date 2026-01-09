import { AuthUser, UserRole } from "@/store/auth-store";

export type ApplicationStatus =
  | "SUBMITTED"
  | "IN_ANALYSIS"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type PolicyStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "CANCELLED"
  | "CLOSED";

export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export type PropertyStatus = "AVAILABLE" | "RESERVED" | "RENTED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  rentValue: number;
  description?: string;
  status: PropertyStatus;
  amenities?: Record<string, unknown>;
  owner: AuthUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreditAnalysis {
  id: string;
  score: number;
  riskLevel: RiskLevel;
  maximumCoverage: number;
  recommendedMonthlyFee: number;
  recommendedAdhesionFee: number;
  indicators?: Record<string, unknown>;
  analystNotes?: string;
  createdAt: string;
}

export interface PaymentSchedule {
  id: string;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  status: PolicyStatus;
  coverageAmount: number;
  monthlyPremium: number;
  adhesionFee: number;
  startDate?: string;
  endDate?: string;
  contractUrl?: string;
  createdAt: string;
  updatedAt: string;
  paymentSchedule?: PaymentSchedule[];
}

export interface RentalApplication {
  id: string;
  applicationNumber: string;
  property: Property;
  applicant: AuthUser;
  broker?: AuthUser;
  status: ApplicationStatus;
  requestedRentValue: number;
  monthlyIncome: number;
  hasNegativeRecords: boolean;
  employmentStatus?: string;
  documents?: Record<string, string>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  creditAnalysis?: CreditAnalysis;
  insurancePolicy?: InsurancePolicy;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: AuthUser;
  assignedTo?: AuthUser;
}

export interface DashboardMetrics {
  approvals: number;
  totalApplications: number;
  clients: number;
  defaultRate: number;
  averageScore: number | null;
  approvalRate: number; // Taxa de aprovação em %
  totalDeliveries: number; // Total de entregas em valor financeiro
  monthlyTrends: Array<{
    month: string;
    approvalRate: number;
    defaultRate: number;
    totalApplications: number;
    approvals: number;
  }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface ApiListParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  role?: UserRole;
}

