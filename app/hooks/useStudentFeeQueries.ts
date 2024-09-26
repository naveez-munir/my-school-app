import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentFeeApi } from '../services/studentFeeApi';
import { 
  type StudentFee, 
  type PopulatedStudentFee,
  type GenerateStudentFeeInput, 
  type BulkGenerateStudentFeeInput,
  type ApplyDiscountInput,
  type GetStudentFeesParams,
  type GetPendingFeesParams,
  type PendingFeesResult,
  FeeStatus
} from '../types/studentFee';

type AnyStudentFee = StudentFee | PopulatedStudentFee;

const studentFeeKeys = {
  all: ['studentFees'] as const,
  lists: () => [...studentFeeKeys.all, 'list'] as const,
  detail: (id: string) => [...studentFeeKeys.all, 'detail', id] as const,
  byStudent: (studentId: string, params?: GetStudentFeesParams) => 
    [...studentFeeKeys.all, 'byStudent', studentId, params] as const,
  pending: (params?: GetPendingFeesParams) => [...studentFeeKeys.all, 'pending', params] as const
};

// Base query for getting a single student fee
export const useStudentFee = (id: string) => {
  return useQuery({
    queryKey: studentFeeKeys.detail(id),
    queryFn: () => studentFeeApi.getById(id),
    enabled: !!id
  });
};

// Get fees by student with optional filtering
export const useStudentFees = (studentId: string, params?: GetStudentFeesParams) => {
  return useQuery<AnyStudentFee[]>({
    queryKey: studentFeeKeys.byStudent(studentId, params),
    queryFn: () => studentFeeApi.getByStudent(studentId, params),
    enabled: !!studentId
  });
};

// Get pending fees with summary from backend
export const usePendingFees = (params?: GetPendingFeesParams) => {
  return useQuery<PendingFeesResult>({
    queryKey: studentFeeKeys.pending(params),
    queryFn: () => studentFeeApi.getPendingFees(params)
  });
};

export const useGenerateStudentFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateStudentFeeInput) => studentFeeApi.generateFee(data),
    onSuccess: (newFee: AnyStudentFee) => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.byStudent(newFee.studentId.toString())
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });
      queryClient.setQueryData(
        studentFeeKeys.detail(newFee._id),
        newFee
      );
    }
  });
};

export const useBulkGenerateStudentFees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkGenerateStudentFeeInput) => studentFeeApi.bulkGenerateFees(data),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });

      const fees = result.fees || result;
      if (Array.isArray(fees)) {
        fees.forEach((fee: AnyStudentFee) => {
          queryClient.setQueryData(
            studentFeeKeys.detail(fee._id),
            fee
          );
          queryClient.invalidateQueries({
            queryKey: studentFeeKeys.byStudent(fee.studentId.toString())
          });
        });
      }
    }
  });
};

// Apply discount to a fee
export const useApplyDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApplyDiscountInput }) =>
      studentFeeApi.applyDiscount(id, data),
    onSuccess: (updatedFee: AnyStudentFee) => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.byStudent(updatedFee.studentId.toString())
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });
      queryClient.setQueryData(
        studentFeeKeys.detail(updatedFee._id),
        updatedFee
      );
    }
  });
};

// Cancel a fee
export const useCancelFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      studentFeeApi.cancelFee(id, reason),
    onSuccess: (updatedFee: AnyStudentFee) => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.byStudent(updatedFee.studentId.toString())
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });
      queryClient.setQueryData(
        studentFeeKeys.detail(updatedFee._id),
        updatedFee
      );
    }
  });
};

// Calculate late fees
export const useCalculateLateFees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => studentFeeApi.calculateLateFees(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });
    }
  });
};

// Update fee statuses
export const useUpdateFeeStatuses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => studentFeeApi.updateFeeStatuses(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });
    }
  });
};

// Generate recurring fees
export const useGenerateRecurringFees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: {
      academicYear: string;
      month?: number;
      quarter?: number;
      billType: string;
      feeStructureSelections?: Record<string, string>;
    }) => studentFeeApi.generateRecurringFees(options),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.lists()
      });
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'pending']
      });
    }
  });
};

// Synchronize discounts
export const useSynchronizeDiscounts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (studentId: string) => studentFeeApi.synchronizeDiscounts(studentId),
    onSuccess: (_, studentId) => {
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.byStudent(studentId)
      });
      queryClient.invalidateQueries({
        queryKey: studentFeeKeys.pending()
      });
    }
  });
};

// Get student fee analytics using backend summary
export const useStudentFeeAnalytics = (params?: GetPendingFeesParams) => {
  const { data: pendingData, isLoading, isError, error } = usePendingFees(params);
  
  return {
    summary: pendingData?.summary,
    fees: pendingData?.fees,
    isLoading,
    isError,
    error
  };
};

// Get fee payment status distribution for a student
export const useStudentFeeStatusDistribution = (studentId: string, params?: GetStudentFeesParams) => {
  const { data: fees, isLoading, isError, error } = useStudentFees(studentId, params);
  
  const distribution = !isLoading && fees ? {
    [FeeStatus.PENDING]: fees.filter(fee => fee.status === FeeStatus.PENDING).length,
    [FeeStatus.PARTIAL]: fees.filter(fee => fee.status === FeeStatus.PARTIAL).length,
    [FeeStatus.PAID]: fees.filter(fee => fee.status === FeeStatus.PAID).length,
    [FeeStatus.OVERDUE]: fees.filter(fee => fee.status === FeeStatus.OVERDUE).length,
    [FeeStatus.CANCELLED]: fees.filter(fee => fee.status === FeeStatus.CANCELLED).length
  } : null;

  return {
    distribution,
    isLoading,
    isError,
    error
  };
};

export { studentFeeKeys };
