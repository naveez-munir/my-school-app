import { useMutation, useQueryClient } from '@tanstack/react-query';
import { examTypeApi } from '~/services/examTypeApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  ExamType, 
  CreateExamTypeDto, 
  UpdateExamTypeDto 
} from '~/types/examType';

// Create base hooks using the factory
const baseHooks = createQueryHooks<ExamType, CreateExamTypeDto, UpdateExamTypeDto>(
  'examTypes', 
  examTypeApi
);

// Add the custom toggle status hook
export const useToggleExamTypeStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => examTypeApi.toggleStatus(id),
    onSuccess: (updatedExamType) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.detail(updatedExamType._id) });
    }
  });
};

// Export all the hooks with appropriate names
export const {
  keys: examTypeKeys,
  useEntities: useExamTypes,
  useEntity: useExamType,
  useCreateEntity: useCreateExamType,
  useUpdateEntity: useUpdateExamType,
  useDeleteEntity: useDeleteExamType
} = baseHooks;

// Additional export to maintain the same API for filtering by activeOnly
export const useExamTypesWithFilter = (activeOnly?: boolean) => {
  return useExamTypes({ activeOnly });
};
