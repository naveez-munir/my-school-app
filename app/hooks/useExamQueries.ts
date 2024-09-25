import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examApi } from '~/services/examApi';
import { createQueryHooks } from './queryHookFactory';
import type { ExamResponse, CreateExamDto, UpdateExamDto } from '~/types/exam';

const baseHooks = createQueryHooks<ExamResponse, CreateExamDto, UpdateExamDto>(
  'exams', 
  examApi
);

export const useUpcomingExams = (classId?: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'upcoming', classId],
    queryFn: () => examApi.getUpcoming(classId),
  });
};

export const useMyExams = () => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'my-exams'],
    queryFn: () => examApi.getMyExams(),
  });
};

export const useMyTeachingExams = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'my-teaching-exams'],
    queryFn: () => examApi.getMyTeachingExams(),
    enabled: options?.enabled ?? true,
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
      queryClient.invalidateQueries({ queryKey: [...baseHooks.keys.lists(), 'my-exams'] });
    }
  });
};

export const {
  keys: examKeys,
  useEntities: useExams,
  useEntity: useExam,
  useCreateEntity: useCreateExam,
  useUpdateEntity: useUpdateExam,
  useDeleteEntity: useDeleteExam
} = baseHooks;
