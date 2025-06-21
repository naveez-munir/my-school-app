import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import { 
  type CreateFeePaymentInput, 
  type FeePayment, 
  type UpdateFeePaymentStatusInput, 
  type BulkFeePaymentInput, 
  type BulkFeePaymentResult, 
  type ReceiptResult, 
  type DailyPaymentsResult, 
  type DateRangePaymentsResult, 
  type FeePaymentFilterParams, 
  type PaymentStatsResult,
  prepareQueryParams
} from '../types/studentFee';

// Create the base service with standard CRUD operations
const baseFeePaymentService = createEntityService<
  FeePayment, 
  CreateFeePaymentInput, 
  UpdateFeePaymentStatusInput
>(api, '/fee-payments');

export const feePaymentApi = {
  // Include all base CRUD operations
  ...baseFeePaymentService,
  
  // Endpoint: POST /fee-payments/bulk
  createBulkPayments: async (data: BulkFeePaymentInput): Promise<BulkFeePaymentResult> => {
    const response = await api.post<BulkFeePaymentResult>('/fee-payments/bulk', data);
    return response.data;
  },
  
  // Endpoint: PATCH /fee-payments/:id/status
  updateStatus: async (id: string, data: UpdateFeePaymentStatusInput): Promise<FeePayment> => {
    const response = await api.patch<FeePayment>(`/fee-payments/${id}/status`, data);
    return response.data;
  },
  
  // Endpoint: GET /fee-payments/student-fee/:studentFeeId
  getByStudentFee: async (studentFeeId: string): Promise<FeePayment[]> => {
    const response = await api.get<FeePayment[]>(`/fee-payments/student-fee/${studentFeeId}`);
    return response.data;
  },
  
  // Endpoint: GET /fee-payments/student/:studentId
  getByStudent: async (studentId: string, filters?: Partial<FeePaymentFilterParams>): Promise<FeePayment[]> => {
    const response = await api.get<FeePayment[]>(
      `/fee-payments/student/${studentId}`, 
      { params: filters ? prepareQueryParams(filters) : undefined }
    );
    return response.data;
  },
  
  // Endpoint: GET /fee-payments/daily
  getDailyPayments: async (date: Date): Promise<DailyPaymentsResult> => {
    const params = prepareQueryParams({ date });
    const response = await api.get<DailyPaymentsResult>('/fee-payments/daily', { params });
    return response.data;
  },
  
  // Endpoint: GET /fee-payments/date-range
  getPaymentsByDateRange: async (
    startDate: Date, 
    endDate: Date, 
    filters?: Partial<Omit<FeePaymentFilterParams, 'startDate' | 'endDate'>>
  ): Promise<DateRangePaymentsResult> => {
    const params = prepareQueryParams({
      startDate,
      endDate,
      ...filters
    });
    
    const response = await api.get<DateRangePaymentsResult>('/fee-payments/date-range', { params });
    return response.data;
  },
  
  // Endpoint: GET /fee-payments/stats/:academicYear
  getPaymentStats: async (academicYear: string): Promise<PaymentStatsResult> => {
    const response = await api.get<PaymentStatsResult>(`/fee-payments/stats/${academicYear}`);
    return response.data;
  },
  
  // Endpoint: GET /fee-payments/receipt/:id
  generateReceipt: async (paymentId: string): Promise<ReceiptResult> => {
    const response = await api.get<ReceiptResult>(`/fee-payments/receipt/${paymentId}`);
    return response.data;
  }
};
