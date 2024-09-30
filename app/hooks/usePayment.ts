import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { paymentApi } from '../services/paymentApi';
import type {
  SearchPaymentParams,
  Payment
} from '../types/payment.types';

// Query keys for React Query
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: SearchPaymentParams) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  references: () => [...paymentKeys.all, 'reference'] as const,
  reference: (type: string, id: string) => [...paymentKeys.references(), type, id] as const,
  summary: () => [...paymentKeys.all, 'summary'] as const,
  yearlySummary: (year: number) => [...paymentKeys.summary(), year] as const,
  monthlySummary: (year: number, month: number) => [...paymentKeys.yearlySummary(year), month] as const,
};

// Hook for fetching payments with filters
export const usePayments = (
  params?: SearchPaymentParams,
  options?: Omit<UseQueryOptions<Payment[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: paymentKeys.list(params || {}),
    queryFn: () => paymentApi.getAll(params),
    ...options
  });
};

// Hook for fetching a single payment by ID
export const usePayment = (id: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentApi.getById(id),
    enabled: !!id
  });
};

// Hook for fetching payments by reference
export const usePaymentsByReference = (paymentFor: string, referenceId: string) => {
  return useQuery({
    queryKey: paymentKeys.reference(paymentFor, referenceId),
    queryFn: () => paymentApi.getByReference(paymentFor, referenceId),
    enabled: !!paymentFor && !!referenceId
  });
};

// Hook for fetching payment summary
export const usePaymentSummary = (year: number, month?: number) => {
  return useQuery({
    queryKey: month !== undefined
      ? paymentKeys.monthlySummary(year, month)
      : paymentKeys.yearlySummary(year),
    queryFn: () => paymentApi.getSummary(year, month),
    enabled: !!year
  });
};
