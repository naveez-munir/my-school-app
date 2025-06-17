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
      syncWithFees = false
    }: {
      id: string; 
      data: UpdateStudentDiscountInput; 
      syncWithFees?: boolean;
    }) => studentDiscountApi.update(id, data, syncWithFees),
    onSuccess: (updatedDiscount) => {
      queryClient.invalidateQueries({ 
        queryKey: studentDiscountKeys.lists() 
      });
      
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.byStudent(updatedDiscount.studentId.toString())
      });
      
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.activeByStudent(updatedDiscount.studentId.toString())
      });
      
      queryClient.setQueryData(
        studentDiscountKeys.detail(updatedDiscount._id),
        updatedDiscount
      );
      
      // Invalidate student fee lists as they may have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });
      
      // Invalidate student-specific fee list
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', updatedDiscount.studentId.toString()]
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
      syncWithFees = false
    }: {
      id: string; 
      syncWithFees?: boolean;
    }) => studentDiscountApi.toggleStatus(id, syncWithFees),
    onSuccess: (updatedDiscount) => {
      queryClient.invalidateQueries({ 
        queryKey: studentDiscountKeys.lists() 
      });
      
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.byStudent(updatedDiscount.studentId.toString())
      });
      
      queryClient.invalidateQueries({
        queryKey: studentDiscountKeys.activeByStudent(updatedDiscount.studentId.toString())
      });
      
      queryClient.setQueryData(
        studentDiscountKeys.detail(updatedDiscount._id),
        updatedDiscount
      );
      
      // Invalidate student fee lists as they may have changed
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list']
      });
      
      // Invalidate student-specific fee list
      queryClient.invalidateQueries({
        queryKey: ['studentFees', 'list', 'byStudent', updatedDiscount.studentId.toString()]
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
      syncWithFees = false
    }: {
      id: string; 
      syncWithFees?: boolean;
    }) => {
      // Get the discount data from cache before removing
      const discount = queryClient.getQueryData<StudentDiscount>(
        studentDiscountKeys.detail(id)
      );
      
      return studentDiscountApi.remove(id, syncWithFees).then(result => {
        return { result, discount };
      });
    },
    onSuccess: ({ result, discount }) => {
      if (discount) {
        queryClient.invalidateQueries({ 
          queryKey: studentDiscountKeys.lists() 
        });
        
        queryClient.invalidateQueries({
          queryKey: studentDiscountKeys.byStudent(discount.studentId.toString())
        });
        
        queryClient.invalidateQueries({
          queryKey: studentDiscountKeys.activeByStudent(discount.studentId.toString())
        });
        
        queryClient.removeQueries({
          queryKey: studentDiscountKeys.detail(discount._id)
        });
        
        // Invalidate student fee lists as they may have changed
        queryClient.invalidateQueries({
          queryKey: ['studentFees', 'list']
        });
        
        // Invalidate student-specific fee list
        queryClient.invalidateQueries({
          queryKey: ['studentFees', 'list', 'byStudent', discount.studentId.toString()]
        });
      }
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
