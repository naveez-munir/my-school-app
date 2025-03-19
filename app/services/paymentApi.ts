import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  SearchPaymentParams,
  CreateReferencePaymentDto,
  PaymentSummary
} from '../types/payment.types';

// Prepare query params for API requests
export const prepareQueryParams = (params: SearchPaymentParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.paymentType) queryParams.paymentType = params.paymentType;
  if (params.paymentMode) queryParams.paymentMode = params.paymentMode;
  if (params.paymentFor) queryParams.paymentFor = params.paymentFor;
  if (params.referenceId) queryParams.referenceId = params.referenceId;
  if (params.status) queryParams.status = params.status;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  if (params.minAmount) queryParams.minAmount = params.minAmount;
  if (params.maxAmount) queryParams.maxAmount = params.maxAmount;
  if (params.transactionId) queryParams.transactionId = params.transactionId;
  if (params.receivedBy) queryParams.receivedBy = params.receivedBy;
  
  return queryParams;
};

// Create the base service with standard CRUD operations
const basePaymentService = createEntityService<
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto
>(api, '/payments');

export const paymentApi = {
  // Include all base CRUD operations
  ...basePaymentService,
  
  // Override getAll to handle params properly
  getAll: async (params?: SearchPaymentParams): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(
      '/payments',
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // Get payment by reference
  getByReference: async (paymentFor: string, referenceId: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments/reference/${paymentFor}/${referenceId}`);
    return response.data;
  },
  
  // Get payment summary
  getSummary: async (year: number, month?: number): Promise<PaymentSummary> => {
    const params: Record<string, string> = { year: year.toString() };
    if (month !== undefined) {
      params.month = month.toString();
    }
    
    const response = await api.get<PaymentSummary>('/payments/summary', { params });
    return response.data;
  },
  
  // Update payment status
  updateStatus: async (id: string, status: string): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${id}/status`, { status });
    return response.data;
  },
  
  // Create payment for salary
  createSalaryPayment: async (
    salaryId: string, 
    data: CreateReferencePaymentDto
  ): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/salary/${salaryId}`, data);
    return response.data;
  },
  
  // Create payment for expense
  createExpensePayment: async (
    expenseId: string, 
    data: CreateReferencePaymentDto
  ): Promise<Payment> => {
    const response = await api.post<Payment>(`/payments/expense/${expenseId}`, data);
    return response.data;
  }
};

export default paymentApi;
