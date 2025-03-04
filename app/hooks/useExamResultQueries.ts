import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examResultApi } from '~/services/examResultApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  ExamResultResponse, 
  CreateExamResultRequest 
} from '~/types/examResult';

const baseHooks = createQueryHooks<
  ExamResultResponse, 
  CreateExamResultRequest, 
  Partial<CreateExamResultRequest>
>(
  'examResults', 
  examResultApi
);

export const useStudentResults = (studentId: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'student', studentId],
    queryFn: () => examResultApi.getStudentResults(studentId),
    enabled: !!studentId,
  });
};

export const useClassResults = (examId: string) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'class', examId],
    queryFn: () => examResultApi.getClassResults(examId),
    enabled: !!examId,
  });
};

export const useGenerateClassRanks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (examId: string) => examResultApi.generateClassRanks(examId),
    onSuccess: (data, examId) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: [...baseHooks.keys.lists(), 'class', examId] });
    }
  });
};

export const {
  keys: examResultKeys,
  useEntities: useExamResults,
  useEntity: useExamResult,
  useCreateEntity: useCreateExamResult,
  useUpdateEntity: useUpdateExamResult,
  useDeleteEntity: useDeleteExamResult
} = baseHooks;
