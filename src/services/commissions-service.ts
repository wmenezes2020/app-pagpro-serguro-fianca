import { apiClient } from '@/lib/api-client';

export interface CommissionRate {
  id: string;
  role: string;
  percentage: number;
  commissionType: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  beneficiary: {
    id: string;
    fullName?: string;
    email: string;
    role: string;
  };
  application?: {
    id: string;
    applicationNumber: string;
  };
  referral?: {
    id: string;
  };
  commissionType: string;
  amount: number;
  percentage: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  referrer: {
    id: string;
    fullName?: string;
    email: string;
  };
  referred: {
    id: string;
    fullName?: string;
    email: string;
  };
  application?: {
    id: string;
    applicationNumber: string;
  };
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  commissionAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionSummary {
  pendingAmount: number;
  approvedAmount: number;
  paidAmount: number;
  totalAmount: number;
}

export const commissionsService = {
  // Commission Rates
  async getCommissionRates(): Promise<CommissionRate[]> {
    const response = await apiClient.get('/commissions/rates');
    return response.data;
  },

  async createCommissionRate(data: {
    role: string;
    percentage: number;
    commissionType: string;
    isActive?: boolean;
    description?: string;
  }): Promise<CommissionRate> {
    const response = await apiClient.post('/commissions/rates', data);
    return response.data;
  },

  async updateCommissionRate(
    id: string,
    data: Partial<CommissionRate>,
  ): Promise<CommissionRate> {
    const response = await apiClient.put(`/commissions/rates/${id}`, data);
    return response.data;
  },

  async deleteCommissionRate(id: string): Promise<void> {
    await apiClient.delete(`/commissions/rates/${id}`);
  },

  // Commissions
  async getCommissions(): Promise<Commission[]> {
    const response = await apiClient.get('/commissions');
    return response.data;
  },

  async getCommissionSummary(): Promise<CommissionSummary> {
    const response = await apiClient.get('/commissions/summary');
    return response.data;
  },

  async updateCommissionStatus(
    id: string,
    status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED',
  ): Promise<Commission> {
    const response = await apiClient.put(`/commissions/${id}/status`, { status });
    return response.data;
  },

  // Referrals
  async getReferrals(): Promise<Referral[]> {
    const response = await apiClient.get('/commissions/referrals');
    return response.data;
  },
};

export const fetchMyCommissions = () => commissionsService.getCommissions();


