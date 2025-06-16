import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feeStructureApi } from '../services/feeStructureApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  FeeStructure, 
  CreateFeeStructureInput, 
  UpdateFeeStructureInput,
  BulkGenerateFeeStructureInput,
  CloneFeeStructureInput,
  ListFeeStructuresParams
} from '../types/studentFee';

// Create base hooks using the factory
const baseHooks = createQueryHooks<FeeStructure, CreateFeeStructureInput, UpdateFeeStructureInput>(
  'feeStructures',
  feeStructureApi
);

// Override the useEntities hook to handle the custom params
export const useFeeStructures = (params?: ListFeeStructuresParams) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), params],
    queryFn: () => feeStructureApi.getAll(params)
  });
};

// Custom hook for bulk generation
export const useBulkGenerateFeeStructures = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BulkGenerateFeeStructureInput) => feeStructureApi.bulkGenerate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
    }
  });
};

// Hook for getting structure by class and academic year
export const useFeeStructureByClassAndYear = (classId: string, academicYear: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'byClassAndYear', classId, academicYear],
    queryFn: () => feeStructureApi.getByClassAndYear(classId, academicYear),
    enabled: !!classId && !!academicYear
  });
};

// Custom hook for cloning
export const useCloneFeeStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CloneFeeStructureInput }) => 
      feeStructureApi.cloneStructure(id, data),
    onSuccess: (newStructure) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(newStructure._id), 
        newStructure
      );
    }
  });
};

// Hook for toggling status
export const useToggleFeeStructureStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => feeStructureApi.toggleStatus(id),
    onSuccess: (updatedStructure) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(updatedStructure._id), 
        updatedStructure
      );
    }
  });
};

// Export other base hooks with renamed exports
export const {
  keys: feeStructureKeys,
  useEntity: useFeeStructure,
  useCreateEntity: useCreateFeeStructure,
  useUpdateEntity: useUpdateFeeStructure,
  useDeleteEntity: useDeleteFeeStructure
} = baseHooks;
