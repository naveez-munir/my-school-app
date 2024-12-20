import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { allocationApi, baseAllocationService } from '~/services/timetableApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  ClassSubjectAllocation, 
  CreateAllocationDto, 
  UpdateAllocationDto 
} from '~/types/timetable';

const baseAllocationHooks = createQueryHooks<
  ClassSubjectAllocation, 
  CreateAllocationDto, 
  UpdateAllocationDto
>('allocations', baseAllocationService);

export const useAllocations = baseAllocationHooks.useEntities;

export const useAllocation = baseAllocationHooks.useEntity;

export const useAllocationsByClass = (classId: string, academicYear?: string) => {
  return useQuery({
    queryKey: [...baseAllocationHooks.keys.lists(), 'class', classId, academicYear],
    queryFn: () => allocationApi.getByClass(classId, academicYear),
    enabled: !!classId
  });
};

export const useAllocationsByTeacher = (teacherId: string, academicYear?: string) => {
  return useQuery({
    queryKey: [...baseAllocationHooks.keys.lists(), 'teacher', teacherId, academicYear],
    queryFn: () => allocationApi.getByTeacher(teacherId, academicYear),
    enabled: !!teacherId
  });
};

export const useAllocationsByAcademicYear = (academicYear: string) => {
  return useQuery({
    queryKey: [...baseAllocationHooks.keys.lists(), 'academicYear', academicYear],
    queryFn: () => allocationApi.getByAcademicYear(academicYear),
    enabled: !!academicYear
  });
};

export const useCreateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAllocationDto) => allocationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.lists() });
    }
  });
};

export const useUpdateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAllocationDto }) => 
      allocationApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.detail(updated.id) });
    }
  });
};

export const useDeleteAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => allocationApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.lists() });
      queryClient.removeQueries({ queryKey: baseAllocationHooks.keys.detail(id) });
    }
  });
};

export const useActivateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => allocationApi.activate(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.detail(updated.id) });
    }
  });
};

export const useDeactivateAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => allocationApi.deactivate(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseAllocationHooks.keys.detail(updated.id) });
    }
  });
};

