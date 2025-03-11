import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feeCategoryApi } from '../services/feeCategoryApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  FeeCategory, 
  CreateFeeCategoryInput, 
  UpdateFeeCategoryInput,
  ListFeeCategoriesParams
} from '../types/studentFee';

// Create base hooks using the factory
const baseHooks = createQueryHooks<FeeCategory, CreateFeeCategoryInput, UpdateFeeCategoryInput>(
  'feeCategories',
  feeCategoryApi
);

// Override the useEntities hook to handle the custom params
export const useFeeCategories = (params?: ListFeeCategoriesParams) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), params],
    queryFn: () => feeCategoryApi.getAll(params)
  });
};

// Hook for toggling category status
export const useToggleFeeCategoryStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => feeCategoryApi.toggleStatus(id),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(updatedCategory._id), 
        updatedCategory
      );
    }
  });
};

// Hook for getting category usage stats
export const useCategoryUsage = (id: string, academicYear?: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.details(), id, 'usage', academicYear],
    queryFn: () => feeCategoryApi.getCategoryUsage(id, academicYear),
    enabled: !!id
  });
};

// Hook for validating multiple categories
export const useValidateCategories = (categoryIds: string[]) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'validate', categoryIds],
    queryFn: () => feeCategoryApi.validateCategories(categoryIds),
    enabled: categoryIds.length > 0
  });
};

// Export other base hooks with renamed exports
export const {
  keys: feeCategoryKeys,
  useEntity: useFeeCategory,
  useCreateEntity: useCreateFeeCategory,
  useUpdateEntity: useUpdateFeeCategory,
  useDeleteEntity: useDeleteFeeCategory
} = baseHooks;
