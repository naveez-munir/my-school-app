import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentDiscountApi } from '../services/studentDiscountApi';
import type { 
  StudentDiscount, 
  CreateStudentDiscountInput, 
  UpdateStudentDiscountInput 
} from '../types/studentFee';

const studentDiscountKeys = {
  all: ['studentDiscounts'] as const,
  lists: () => [...studentDiscountKeys.all, 'list'] as const,
  list: (filters: any = {}) => [...studentDiscountKeys.lists(), filters] as const,
  details: () => [...studentDiscountKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentDiscountKeys.details(), id] as const,
  byStudent: (studentId: string) => 
    [...studentDiscountKeys.lists(), 'byStudent', studentId] as const,
  activeByStudent: (studentId: string) => 
    [...studentDiscountKeys.lists(), 'activeByStudent', studentId] as const,
};

export const useStudentDiscountsByStudent = (studentId: string) => {
  return useQuery({
    queryKey: studentDiscountKeys.byStudent(studentId),
    queryFn: () => studentDiscountApi.getByStudent(studentId),
    enabled: !!studentId
  });
};

export const useActiveStudentDiscounts = (studentId: string) => {
  return useQuery({
    queryKey: studentDiscountKeys.activeByStudent(studentId),
    queryFn: () => studentDiscountApi.getActiveDiscounts(studentId),
    enabled: !!studentId
  });
};

export const useCreateStudentDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      data, 
      syncWithFees = false
    }: {
      data: CreateStudentDiscountInput; 
      syncWithFees?: boolean;
    }) => studentDiscountApi.create(data, syncWithFees),
    onSuccess: (newDiscount) => {
      // Invalidate student discount lists
      queryClient.invalidateQueries({ 
        queryKey: studentDiscountKeys.lists() 
      });
      
      // Invalidate student-specific discount list
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.byStudent(newDiscount.studentId.toString())
      });
      
      // Invalidate active discounts list for student
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.activeByStudent(newDiscount.studentId.toString())
      });
      
      // Invalidate student fee lists as they may have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });
      
      // Invalidate student-specific fee list
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', newDiscount.studentId.toString()]
      });
    }
  });
};

// Hook for updating a student discount
export const useUpdateStudentDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      syncWithFees = false,
      studentId
    }: {
      id: string;
      data: UpdateStudentDiscountInput;
      syncWithFees?: boolean;
      studentId: string;
    }) => studentDiscountApi.update(id, data, syncWithFees),

    // Optimistic update
    onMutate: async ({ id, data, studentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: studentDiscountKeys.byStudent(studentId)
      });

      // Snapshot the previous value
      const previousDiscounts = queryClient.getQueryData<StudentDiscount[]>(
        studentDiscountKeys.byStudent(studentId)
      );

      // Optimistically update the discount
      if (previousDiscounts) {
        queryClient.setQueryData<StudentDiscount[]>(
          studentDiscountKeys.byStudent(studentId),
          previousDiscounts.map(discount =>
            discount._id === id
              ? {
                  ...discount,
                  ...data,
                  startDate: typeof data.startDate === 'string' ? data.startDate : discount.startDate,
                  endDate: data.endDate ? (typeof data.endDate === 'string' ? data.endDate : discount.endDate) : discount.endDate
                }
              : discount
          )
        );
      }

      // Return context with snapshot
      return { previousDiscounts, studentId };
    },

    // If mutation fails, rollback
    onError: (err, variables, context) => {
      if (context?.previousDiscounts) {
        queryClient.setQueryData(
          studentDiscountKeys.byStudent(context.studentId),
          context.previousDiscounts
        );
      }
      console.error("Error updating discount:", err);
    },

    // Always refetch after success or error
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.byStudent(variables.studentId)
      });

      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.activeByStudent(variables.studentId)
      });

      // Invalidate student fee lists as they may have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });

      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', variables.studentId]
      });
    }
  });
};

// Hook for toggling a discount's status
export const useToggleDiscountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      syncWithFees = false,
      studentId
    }: {
      id: string;
      syncWithFees?: boolean;
      studentId: string;
    }) => studentDiscountApi.toggleStatus(id, syncWithFees),

    // Optimistic update
    onMutate: async ({ id, studentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: studentDiscountKeys.byStudent(studentId)
      });

      // Snapshot the previous value
      const previousDiscounts = queryClient.getQueryData<StudentDiscount[]>(
        studentDiscountKeys.byStudent(studentId)
      );

      // Optimistically toggle the status
      if (previousDiscounts) {
        queryClient.setQueryData<StudentDiscount[]>(
          studentDiscountKeys.byStudent(studentId),
          previousDiscounts.map(discount =>
            discount._id === id
              ? { ...discount, isActive: !discount.isActive }
              : discount
          )
        );
      }

      // Return context with snapshot
      return { previousDiscounts, studentId };
    },

    // If mutation fails, rollback
    onError: (err, variables, context) => {
      if (context?.previousDiscounts) {
        queryClient.setQueryData(
          studentDiscountKeys.byStudent(context.studentId),
          context.previousDiscounts
        );
      }
      console.error("Error toggling discount status:", err);
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.byStudent(variables.studentId)
      });

      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.activeByStudent(variables.studentId)
      });

      // Invalidate student fee lists as they may have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });

      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', variables.studentId]
      });
    }
  });
};

// Hook for manually syncing a discount with fees
export const useSyncDiscountWithFees = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => studentDiscountApi.syncFees(id),
    onSuccess: (_, id) => {
      // Get the discount data from cache to get the studentId
      const discount = queryClient.getQueryData<StudentDiscount>(
        studentDiscountKeys.detail(id)
      );
      
      if (discount) {
        // Invalidate student fee lists
        queryClient.invalidateQueries({
          queryKey: ['studentFees', 'list', 'byStudent', discount.studentId.toString()]
        });
      }
      
      // Also invalidate all fee lists as they could have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });
    }
  });
};

// Hook for removing a student discount
export const useRemoveStudentDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      syncWithFees = false,
      studentId
    }: {
      id: string;
      syncWithFees?: boolean;
      studentId: string;
    }) => studentDiscountApi.remove(id, syncWithFees),

    // Optimistic update
    onMutate: async ({ id, studentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: studentDiscountKeys.byStudent(studentId)
      });

      // Snapshot the previous value
      const previousDiscounts = queryClient.getQueryData<StudentDiscount[]>(
        studentDiscountKeys.byStudent(studentId)
      );

      // Optimistically remove the discount from cache
      if (previousDiscounts) {
        queryClient.setQueryData<StudentDiscount[]>(
          studentDiscountKeys.byStudent(studentId),
          previousDiscounts.filter(discount => discount._id !== id)
        );
      }

      // Return context with snapshot
      return { previousDiscounts, studentId };
    },

    // If mutation fails, rollback
    onError: (err, variables, context) => {
      if (context?.previousDiscounts) {
        queryClient.setQueryData(
          studentDiscountKeys.byStudent(context.studentId),
          context.previousDiscounts
        );
      }
      console.error("Error removing discount:", err);
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.byStudent(variables.studentId)
      });

      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.activeByStudent(variables.studentId)
      });

      // Invalidate student fee lists as they may have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });

      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', variables.studentId]
      });
    }
  });
};

// Hook for synchronizing all discounts for a student
export const useSynchronizeStudentDiscounts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (studentId: string) => studentDiscountApi.synchronizeDiscountsForStudent(studentId),
    onSuccess: (_, studentId) => {
      // Invalidate student fee lists
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', studentId]
      });
      
      // Also invalidate all fee lists as they could have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });
    }
  });
};

// Export query keys
export { studentDiscountKeys };
