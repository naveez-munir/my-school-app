import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tenantSettingsApi, type LeavePolicy, type GradeLevel, type CreateGradeLevelDto, type UpdateGradeLevelDto } from '~/services/tenantSettingsApi';

export const useLeavePolicy = () => {
  return useQuery({
    queryKey: ['tenant', 'leave-policy'],
    queryFn: tenantSettingsApi.getLeavePolicy,
  });
};

export const useUpdateLeavePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policy: LeavePolicy) => tenantSettingsApi.updateLeavePolicy(policy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', 'leave-policy'] });
    },
  });
};

export const useGradeLevels = () => {
  return useQuery({
    queryKey: ['tenant', 'grade-levels'],
    queryFn: tenantSettingsApi.getGradeLevels,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useAddGradeLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateGradeLevelDto) => tenantSettingsApi.addGradeLevel(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', 'grade-levels'] });
    },
  });
};

export const useUpdateGradeLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, dto }: { code: string; dto: UpdateGradeLevelDto }) =>
      tenantSettingsApi.updateGradeLevel(code, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', 'grade-levels'] });
    },
  });
};

export const useDeleteGradeLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => tenantSettingsApi.deleteGradeLevel(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', 'grade-levels'] });
    },
  });
};

export const useReorderGradeLevels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gradeLevels: GradeLevel[]) => tenantSettingsApi.reorderGradeLevels(gradeLevels),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', 'grade-levels'] });
    },
  });
};
