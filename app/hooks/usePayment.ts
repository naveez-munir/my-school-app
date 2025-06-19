import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../services/paymentApi';
import type {
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  SearchPaymentParams,
  CreateReferencePaymentDto,
  PaymentSummary
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
export const usePayments = (params?: SearchPaymentParams) => {
  return useQuery({
    queryKey: paymentKeys.list(params || {}),
    queryFn: () => paymentApi.getAll(params)
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

// Hook for creating a new payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    }
  });
};

// Hook for creating a salary payment
export const useCreateSalaryPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ salaryId, data }: { salaryId: string; data: CreateReferencePaymentDto }) => 
      paymentApi.createSalaryPayment(salaryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      // Also invalidate potential salary queries
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
    }
  });
};

// Hook for creating an expense payment
export const useCreateExpensePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ expenseId, data }: { expenseId: string; data: CreateReferencePaymentDto }) => 
      paymentApi.createExpensePayment(expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      // Also invalidate potential expense queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });
};

// Hook for updating a payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) => paymentApi.update(id, data),
    onSuccess: (updatedPayment) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      if (updatedPayment.id) {
        queryClient.setQueryData(paymentKeys.detail(updatedPayment.id), updatedPayment);
      }
    }
  });
};

// Hook for updating payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      paymentApi.updateStatus(id, status),
    onSuccess: (updatedPayment) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      if (updatedPayment.id) {
        queryClient.setQueryData(paymentKeys.detail(updatedPayment.id), updatedPayment);
      }
      
      // Also invalidate summary data since status changes affect summary
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() });
      
      // Invalidate related entities based on payment type
      if (updatedPayment.paymentFor === 'Salary') {
        queryClient.invalidateQueries({ queryKey: ['salaries'] });
      } else if (updatedPayment.paymentFor === 'Expense') {
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
      } else if (updatedPayment.paymentFor === 'StudentFee') {
        queryClient.invalidateQueries({ queryKey: ['studentFees'] });
      }
    }
  });
};

// Hook for deleting a payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => paymentApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.removeQueries({ queryKey: paymentKeys.detail(id) });
      
      // Also invalidate summary data
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() });
    }
  });
};
