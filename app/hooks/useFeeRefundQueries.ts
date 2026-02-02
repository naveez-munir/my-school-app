import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feeRefundApi } from '../services/feeRefundApi';
import { 
  type FeeRefund,
  type CreateFeeRefundInput,
  type ProcessRefundInput,
  type ListRefundParams
} from '../types/studentFee';

const feeRefundKeys = {
  all: ['feeRefunds'] as const,
  lists: () => [...feeRefundKeys.all, 'list'] as const,
  list: (filters?: ListRefundParams) => [...feeRefundKeys.lists(), filters] as const,
  detail: (id: string) => [...feeRefundKeys.all, 'detail', id] as const,
  byStudent: (studentId: string, options?: { status?: string }) => 
    [...feeRefundKeys.all, 'byStudent', studentId, options] as const
};

export const useFeeRefunds = (filters?: ListRefundParams) => {
  return useQuery({
    queryKey: feeRefundKeys.list(filters),
    queryFn: () => feeRefundApi.listRefunds(filters)
  });
};

export const useFeeRefund = (id: string) => {
  return useQuery({
    queryKey: feeRefundKeys.detail(id),
    queryFn: () => feeRefundApi.getRefundById(id),
    enabled: !!id
  });
};

export const useFeeRefundsByStudent = (
  studentId: string, 
  options?: { status?: string }
) => {
  return useQuery({
    queryKey: feeRefundKeys.byStudent(studentId, options),
    queryFn: () => feeRefundApi.getRefundsByStudent(studentId, options),
    enabled: !!studentId
  });
};

export const useCreateFeeRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeeRefundInput) => feeRefundApi.createRefund(data),
    onSuccess: (newRefund: FeeRefund) => {
      queryClient.invalidateQueries({
        queryKey: feeRefundKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: feeRefundKeys.byStudent(newRefund.studentId.toString())
      });
      queryClient.setQueryData(
        feeRefundKeys.detail(newRefund._id),
        newRefund
      );
    }
  });
};

export const useProcessFeeRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessRefundInput }) =>
      feeRefundApi.processRefund(id, data),
    onSuccess: (updatedRefund: FeeRefund) => {
      queryClient.invalidateQueries({
        queryKey: feeRefundKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: feeRefundKeys.byStudent(updatedRefund.studentId.toString())
      });
      queryClient.setQueryData(
        feeRefundKeys.detail(updatedRefund._id),
        updatedRefund
      );
    }
  });
};

export { feeRefundKeys };

