import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { dailyDiaryApi } from '~/services/dailyDiary';
import { createQueryHooks } from './queryHookFactory';
import type { 
  DailyDiaryResponse,
  CreateDailyDiaryRequest, 
  UpdateDailyDiaryRequest,
  DiaryQueryParams,
  AttachmentRequest
} from '~/types/dailyDiary';

// Create base CRUD hooks for diary operations
const baseDiaryHooks = createQueryHooks<DailyDiaryResponse, CreateDailyDiaryRequest, UpdateDailyDiaryRequest>(
  'dailyDiaries', 
  dailyDiaryApi
);

// Add specialized hooks for diary-specific operations
export const useDiaryEntriesByClass = (classId: string, params?: DiaryQueryParams) => {
  return useQuery({
    queryKey: [...baseDiaryHooks.keys.lists(), 'class', classId, params],
    queryFn: () => dailyDiaryApi.getByClass(classId, params),
    enabled: !!classId
  });
};

export const useDiaryEntriesForStudent = (studentId: string, params?: DiaryQueryParams) => {
  return useQuery({
    queryKey: [...baseDiaryHooks.keys.lists(), 'student', studentId, params],
    queryFn: () => dailyDiaryApi.getForStudent(studentId, params),
    enabled: !!studentId
  });
};

export const useAddAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ diaryId, attachment }: { diaryId: string; attachment: AttachmentRequest }) => 
      dailyDiaryApi.addAttachment(diaryId, attachment),
    onSuccess: (updatedDiary) => {
      queryClient.invalidateQueries({ queryKey: baseDiaryHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseDiaryHooks.keys.detail(updatedDiary.id) }); // Changed from _id to id
    }
  });
};

export const useRemoveAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ diaryId, attachmentId }: { diaryId: string; attachmentId: string }) => 
      dailyDiaryApi.removeAttachment(diaryId, attachmentId),
    onSuccess: (_result, { diaryId }) => {
      queryClient.invalidateQueries({ queryKey: baseDiaryHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseDiaryHooks.keys.detail(diaryId) });
    }
  });
};

// Export the base hooks with renamed functions
export const {
  keys: diaryKeys,
  useEntities: useDiaryEntries,
  useEntity: useDiaryEntry,
  useCreateEntity: useCreateDiaryEntry,
  useUpdateEntity: useUpdateDiaryEntry,
  useDeleteEntity: useDeleteDiaryEntry
} = baseDiaryHooks;
