import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exceptionApi, baseExceptionService } from '~/services/timetableExceptionApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  TimetableException, 
  CreateExceptionDto, 
  UpdateExceptionDto,
  ExceptionQueryParams
} from '~/types/timetable';

const baseExceptionHooks = createQueryHooks<
  TimetableException, 
  CreateExceptionDto, 
  UpdateExceptionDto
>('exceptions', baseExceptionService);

export const useExceptions = (params?: ExceptionQueryParams) => {
  return useQuery({
    queryKey: [...baseExceptionHooks.keys.lists(), params],
    queryFn: () => exceptionApi.getAll(params)
  });
};

export const useException = baseExceptionHooks.useEntity;

export const useExceptionsByDate = (date: string, classId?: string) => {
  return useQuery({
    queryKey: [...baseExceptionHooks.keys.lists(), 'date', date, classId],
    queryFn: () => exceptionApi.getByDate(date, classId),
    enabled: !!date
  });
};

export const useExceptionsByTimetable = (timetableId: string) => {
  return useQuery({
    queryKey: [...baseExceptionHooks.keys.lists(), 'timetable', timetableId],
    queryFn: () => exceptionApi.getByTimetable(timetableId),
    enabled: !!timetableId
  });
};

export const useTeacherSubstitutions = (teacherId: string, date: string) => {
  return useQuery({
    queryKey: [...baseExceptionHooks.keys.lists(), 'teacher', teacherId, 'date', date],
    queryFn: () => exceptionApi.getTeacherSubstitutions(teacherId, date),
    enabled: !!teacherId && !!date
  });
};

export const useCreateException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExceptionDto) => exceptionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseExceptionHooks.keys.lists() });
    }
  });
};

export const useUpdateException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExceptionDto }) => 
      exceptionApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseExceptionHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseExceptionHooks.keys.detail(updated.id) });
    }
  });
};

export const useDeleteException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exceptionApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: baseExceptionHooks.keys.lists() });
      queryClient.removeQueries({ queryKey: baseExceptionHooks.keys.detail(id) });
    }
  });
};

export const useApproveException = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      exceptionApi.approve(id, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseExceptionHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseExceptionHooks.keys.detail(updated.id) });
    }
  });
};

