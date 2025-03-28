// src/hooks/useExamQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examApi } from '~/services/examApi';
import { createQueryHooks } from './queryHookFactory';
import type { ExamResponse, CreateExamDto, UpdateExamDto } from '~/types/exam';

// Create base hooks
const baseHooks = createQueryHooks<ExamResponse, CreateExamDto, UpdateExamDto>(
  'exams', 
  examApi
);

// Add custom hooks
export const useUpcomingExams = (classId?: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'upcoming', classId],
    queryFn: () => examApi.getUpcoming(classId),
  });
};

export const useUpdateExamStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared' }) => 
      examApi.updateStatus(id, status),
    onSuccess: (updatedExam) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.detail(updatedExam.id) });
      queryClient.invalidateQueries({ queryKey: [...baseHooks.keys.lists(), 'upcoming'] });
    }
  });
};

// Export all hooks
export const {
  keys: examKeys,
  useEntities: useExams,
  useEntity: useExam,
  useCreateEntity: useCreateExam,
  useUpdateEntity: useUpdateExam,
  useDeleteEntity: useDeleteExam
} = baseHooks;
