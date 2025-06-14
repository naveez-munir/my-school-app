import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feePaymentApi } from '../services/feePaymentApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  FeePayment, 
  CreateFeePaymentInput, 
  UpdateFeePaymentStatusInput,
  BulkFeePaymentInput,
  FeePaymentFilterParams
} from '../types/studentFee';

// Create base hooks using the factory
const baseHooks = createQueryHooks<FeePayment, CreateFeePaymentInput, UpdateFeePaymentStatusInput>(
  'feePayments',
  feePaymentApi
);

// Custom hook for bulk payments
export const useCreateBulkPayments = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BulkFeePaymentInput) => feePaymentApi.createBulkPayments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
    }
  });
};

// Custom hook for updating payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeePaymentStatusInput }) => 
      feePaymentApi.updateStatus(id, data),
    onSuccess: (updatedPayment) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.detail(updatedPayment._id) });
      // Also invalidate related student fee data
      queryClient.invalidateQueries({ 
        queryKey: ['studentFees', 'detail', updatedPayment.studentFeeId] 
      });
    }
  });
};

// Hook for getting payments by student fee ID
export const usePaymentsByStudentFee = (studentFeeId: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'byStudentFee', studentFeeId],
    queryFn: () => feePaymentApi.getByStudentFee(studentFeeId),
    enabled: !!studentFeeId
  });
};

// Hook for getting payments by student ID
export const usePaymentsByStudent = (
  studentId: string, 
  filters?: Partial<FeePaymentFilterParams>
) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'byStudent', studentId, filters],
    queryFn: () => feePaymentApi.getByStudent(studentId, filters),
    enabled: !!studentId
  });
};

// Hook for daily payments
export const useDailyPayments = (date: Date) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'daily', date.toISOString().split('T')[0]],
    queryFn: () => feePaymentApi.getDailyPayments(date)
  });
};

// Hook for payments by date range
export const usePaymentsByDateRange = (
  startDate: Date,
  endDate: Date,
  filters?: Partial<Omit<FeePaymentFilterParams, 'startDate' | 'endDate'>>
) => {
  return useQuery({
    queryKey: [
      ...baseHooks.keys.lists(), 
      'dateRange', 
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0], 
      filters
    ],
    queryFn: () => feePaymentApi.getPaymentsByDateRange(startDate, endDate, filters)
  });
};

// Hook for payment statistics
export const usePaymentStats = (academicYear: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'stats', academicYear],
    queryFn: () => feePaymentApi.getPaymentStats(academicYear),
    enabled: !!academicYear
  });
};

// Hook for generating receipt
export const usePaymentReceipt = (paymentId: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.details(), 'receipt', paymentId],
    queryFn: () => feePaymentApi.generateReceipt(paymentId),
    enabled: !!paymentId
  });
};

// Export base hooks with renamed exports
export const {
  keys: feePaymentKeys,
  useEntities: useFeePayments,
  useEntity: useFeePayment,
  useCreateEntity: useCreateFeePayment,
  useUpdateEntity: useUpdateFeePayment,
  useDeleteEntity: useDeleteFeePayment
} = baseHooks;
