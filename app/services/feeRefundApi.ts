import api from './apiClient';
import { 
  type FeeRefund,
  type CreateFeeRefundInput,
  type ProcessRefundInput,
  type ListRefundParams,
  prepareQueryParams,
  cleanObject
} from '../types/studentFee';

export const feeRefundApi = {
  // Endpoint: POST /fee-refunds
  createRefund: async (data: CreateFeeRefundInput): Promise<FeeRefund> => {
    const response = await api.post<FeeRefund>('/fee-refunds', cleanObject(data));
    return response.data;
  },

  // Endpoint: GET /fee-refunds
  listRefunds: async (filters?: ListRefundParams): Promise<FeeRefund[]> => {
    const queryParams = filters ? prepareQueryParams(filters) : undefined;
    const response = await api.get<FeeRefund[]>('/fee-refunds', { params: queryParams });
    return response.data;
  },

  // Endpoint: GET /fee-refunds/student/:studentId
  getRefundsByStudent: async (
    studentId: string, 
    options?: { status?: string }
  ): Promise<FeeRefund[]> => {
    const queryParams = options ? prepareQueryParams(options) : undefined;
    const response = await api.get<FeeRefund[]>(
      `/fee-refunds/student/${studentId}`,
      { params: queryParams }
    );
    return response.data;
  },

  // Endpoint: GET /fee-refunds/:id
  getRefundById: async (id: string): Promise<FeeRefund> => {
    const response = await api.get<FeeRefund>(`/fee-refunds/${id}`);
    return response.data;
  },

  // Endpoint: PATCH /fee-refunds/:id/process
  processRefund: async (id: string, data: ProcessRefundInput): Promise<FeeRefund> => {
    const response = await api.patch<FeeRefund>(
      `/fee-refunds/${id}/process`, 
      cleanObject(data)
    );
    return response.data;
  }
};

