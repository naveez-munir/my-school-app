import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableApi, baseTimetableService } from '~/services/timetableApi';
import { createQueryHooks } from './queryHookFactory';
import type {
  Timetable,
  CreateTimetableDto,
  UpdateTimetableDto,
  TimetableSlot,
  TimetableQueryParams,
  AutoGenerateTimetableDto
} from '~/types/timetable';

const baseTimetableHooks = createQueryHooks<
  Timetable, 
  CreateTimetableDto, 
  UpdateTimetableDto
>('timetables', baseTimetableService);

export const useTimetables = (params?: TimetableQueryParams) => {
  return useQuery({
    queryKey: [...baseTimetableHooks.keys.lists(), params],
    queryFn: () => timetableApi.getAll(params)
  });
};

export const useTimetable = baseTimetableHooks.useEntity;

export const useTimetableByClass = (classId: string, academicYear?: string) => {
  return useQuery({
    queryKey: [...baseTimetableHooks.keys.lists(), 'class', classId, academicYear],
    queryFn: () => timetableApi.getByClass(classId, academicYear),
    enabled: !!classId
  });
};

export const useTimetableConflicts = (id: string) => {
  return useQuery({
    queryKey: [...baseTimetableHooks.keys.detail(id), 'conflicts'],
    queryFn: () => timetableApi.getConflicts(id),
    enabled: !!id,
    retry: false, // Don't retry if endpoint doesn't exist
    meta: {
      errorMessage: 'Conflict detection not available'
    }
  });
};

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimetableDto) => timetableApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
    }
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimetableDto }) => 
      timetableApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.detail(updated.id) });
    }
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timetableApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.removeQueries({ queryKey: baseTimetableHooks.keys.detail(id) });
    }
  });
};

export const useAddSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, slot }: { id: string; slot: TimetableSlot }) => 
      timetableApi.addSlot(id, slot),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.detail(updated.id) });
    }
  });
};

export const useUpdateSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, slotIndex, slot }: { id: string; slotIndex: number; slot: TimetableSlot }) => 
      timetableApi.updateSlot(id, slotIndex, slot),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.detail(updated.id) });
    }
  });
};

export const useRemoveSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, slotIndex }: { id: string; slotIndex: number }) => 
      timetableApi.removeSlot(id, slotIndex),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.detail(updated.id) });
    }
  });
};

export const useUpdateTimetableStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      timetableApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.detail(updated.id) });
    }
  });
};

export const useApproveTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      timetableApi.approve(id, notes),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.detail(updated.id) });
    }
  });
};

export const useAutoGenerateTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AutoGenerateTimetableDto) => timetableApi.autoGenerate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseTimetableHooks.keys.lists() });
    }
  });
};

