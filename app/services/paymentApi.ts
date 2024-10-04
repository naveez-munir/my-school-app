import api from './apiClient';
import type {
  Payment,
  SearchPaymentParams,
  PaymentSummary,
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

export const paymentApi = {
  // Override getAll to handle params properly
  getAll: async (params?: SearchPaymentParams): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(
      '/payments',
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },

  // Get single payment by ID
  getById: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
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
};

export default paymentApi;
