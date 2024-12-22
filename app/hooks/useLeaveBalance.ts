import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  leaveBalanceApi,
  type LeaveBalance,
  type CreateLeaveBalanceDto,
  type UpdateLeaveBalanceDto,
} from '~/services/leaveBalanceApi';

export const useLeaveBalance = (
  employeeId: string,
  employeeType: 'Teacher' | 'Staff',
  year?: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ['leave-balance', employeeId, employeeType, year],
    queryFn: () => leaveBalanceApi.getLeaveBalance(employeeId, employeeType, year),
    enabled: enabled && !!employeeId && !!employeeType,
  });
};

export const useMyLeaveBalance = (year?: number) => {
  return useQuery({
    queryKey: ['leave-balance', 'my-balance', year],
    queryFn: () => leaveBalanceApi.getMyLeaveBalance(year),
  });
};

export const useLeaveBalanceById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['leave-balance', id],
    queryFn: () => leaveBalanceApi.getLeaveBalanceById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeaveBalanceDto) =>
      leaveBalanceApi.createLeaveBalance(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['leave-balance', data.employeeId],
      });
    },
  });
};

export const useUpdateLeaveBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaveBalanceDto }) =>
      leaveBalanceApi.updateLeaveBalance(id, data),
    onSuccess: (updatedBalance) => {
      queryClient.invalidateQueries({
        queryKey: ['leave-balance', updatedBalance.employeeId],
      });
      queryClient.invalidateQueries({
        queryKey: ['leave-balance', updatedBalance.id],
      });
    },
  });
};
