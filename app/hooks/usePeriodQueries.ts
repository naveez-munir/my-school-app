import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { periodApi, basePeriodService } from '~/services/timetableApi';
import { createQueryHooks } from './queryHookFactory';
import type { Period, CreatePeriodDto, UpdatePeriodDto } from '~/types/timetable';

const basePeriodHooks = createQueryHooks<Period, CreatePeriodDto, UpdatePeriodDto>(
  'periods',
  basePeriodService
);

export const usePeriods = (activeOnly?: boolean) => {
  return useQuery({
    queryKey: [...basePeriodHooks.keys.lists(), { activeOnly }],
    queryFn: () => periodApi.getAll(activeOnly)
  });
};

export const usePeriod = basePeriodHooks.useEntity;

export const useCreatePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePeriodDto) => periodApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.lists() });
    }
  });
};

export const useUpdatePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePeriodDto }) => 
      periodApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.detail(updated.id) });
    }
  });
};

export const useDeletePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => periodApi.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.lists() });
      queryClient.removeQueries({ queryKey: basePeriodHooks.keys.detail(id) });
    }
  });
};

export const useActivatePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => periodApi.activate(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.detail(updated.id) });
    }
  });
};

export const useDeactivatePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => periodApi.deactivate(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: basePeriodHooks.keys.detail(updated.id) });
    }
  });
};

