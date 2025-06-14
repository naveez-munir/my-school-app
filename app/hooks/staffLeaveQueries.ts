import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leaveApi } from '../services/leaveApi';
import type {
  LeaveResponse,
  LeaveBalanceResponse,
  CreateLeaveRequest,
  UpdateLeaveRequest,
  ApproveLeaveRequest,
  CreateLeaveBalanceRequest,
  UpdateLeaveBalanceRequest,
  SearchLeaveRequest,
  EmployeeType
} from '../types/staffLeave';

// Query keys for React Query
export const leaveKeys = {
  all: ['leaves'] as const,
  lists: () => [...leaveKeys.all, 'list'] as const,
  list: (filters: SearchLeaveRequest) => [...leaveKeys.lists(), filters] as const,
  details: () => [...leaveKeys.all, 'detail'] as const,
  detail: (id: string) => [...leaveKeys.details(), id] as const,
  employee: () => [...leaveKeys.all, 'employee'] as const,
  employeeLeaves: (employeeId: string, employeeType: EmployeeType) => 
    [...leaveKeys.employee(), employeeId, employeeType] as const,
  balances: () => [...leaveKeys.all, 'balance'] as const,
  employeeBalance: (employeeId: string, employeeType: EmployeeType, year?: number) => 
    [...leaveKeys.balances(), employeeId, employeeType, year] as const,
  balanceDetail: (id: string) => [...leaveKeys.balances(), 'detail', id] as const,
};

// Hook for fetching leaves with filters
export const useLeaves = (params?: SearchLeaveRequest) => {
  return useQuery({
    queryKey: leaveKeys.list(params || {}),
    queryFn: () => leaveApi.getAll(params)
  });
};

// Hook for fetching a single leave by ID
export const useLeave = (id: string) => {
  return useQuery({
    queryKey: leaveKeys.detail(id),
    queryFn: () => leaveApi.getById(id),
    enabled: !!id
  });
};

// Hook for fetching leaves by employee
export const useEmployeeLeaves = (employeeId: string, employeeType: EmployeeType) => {
  return useQuery({
    queryKey: leaveKeys.employeeLeaves(employeeId, employeeType),
    queryFn: () => leaveApi.getByEmployee(employeeId, employeeType),
    enabled: !!employeeId && !!employeeType
  });
};

// Hook for creating a new leave request
export const useCreateLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLeaveRequest) => leaveApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() });
    }
  });
};

// Hook for updating a leave request
export const useUpdateLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaveRequest }) => 
      leaveApi.update(id, data),
    onSuccess: (updatedLeave) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() });
      if (updatedLeave.id) {
        queryClient.setQueryData(leaveKeys.detail(updatedLeave.id), updatedLeave);
        
        // Also invalidate employee-specific queries
        if (updatedLeave.employeeId) {
          queryClient.invalidateQueries({ 
            queryKey: leaveKeys.employeeLeaves(
              updatedLeave.employeeId, 
              updatedLeave.employeeType
            ) 
          });
        }
      }
    }
  });
};

// Hook for approving or rejecting a leave request
export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveLeaveRequest }) => 
      leaveApi.approveLeave(id, data),
    onSuccess: (updatedLeave) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() });
      if (updatedLeave.id) {
        queryClient.setQueryData(leaveKeys.detail(updatedLeave.id), updatedLeave);
        
        // Also invalidate employee-specific queries and balance
        if (updatedLeave.employeeId) {
          queryClient.invalidateQueries({ 
            queryKey: leaveKeys.employeeLeaves(
              updatedLeave.employeeId, 
              updatedLeave.employeeType
            ) 
          });
          
          // Status changes might affect leave balance
          queryClient.invalidateQueries({ 
            queryKey: leaveKeys.employeeBalance(
              updatedLeave.employeeId, 
              updatedLeave.employeeType
            )
          });
        }
      }
    }
  });
};

// Hook for cancelling a leave request
export const useCancelLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => leaveApi.cancelLeave(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.lists() });
      queryClient.removeQueries({ queryKey: leaveKeys.detail(id) });
      
      // We don't know the employee ID here, so invalidate all employee leave lists
      // This is slightly less efficient but ensures consistency
      queryClient.invalidateQueries({ queryKey: leaveKeys.employee() });
    }
  });
};

// Hook for fetching employee leave balance
export const useLeaveBalance = (employeeId: string, employeeType: EmployeeType, year?: number) => {
  return useQuery({
    queryKey: leaveKeys.employeeBalance(employeeId, employeeType, year),
    queryFn: () => leaveApi.getLeaveBalance(employeeId, employeeType, year),
    enabled: !!employeeId && !!employeeType
  });
};

// Hook for fetching leave balance by ID
export const useLeaveBalanceById = (id: string) => {
  return useQuery({
    queryKey: leaveKeys.balanceDetail(id),
    queryFn: () => leaveApi.getLeaveBalanceById(id),
    enabled: !!id
  });
};

// Hook for creating a new leave balance
export const useCreateLeaveBalance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLeaveBalanceRequest) => leaveApi.createLeaveBalance(data),
    onSuccess: (newBalance) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() });
      
      // Also invalidate employee-specific balance queries
      if (newBalance.employeeId) {
        queryClient.invalidateQueries({ 
          queryKey: leaveKeys.employeeBalance(
            newBalance.employeeId, 
            newBalance.employeeType, 
            newBalance.year
          ) 
        });
      }
    }
  });
};

// Hook for updating a leave balance
export const useUpdateLeaveBalance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaveBalanceRequest }) => 
      leaveApi.updateLeaveBalance(id, data),
    onSuccess: (updatedBalance) => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.balances() });
      if (updatedBalance.id) {
        queryClient.setQueryData(leaveKeys.balanceDetail(updatedBalance.id), updatedBalance);
        
        // Also invalidate employee-specific balance queries
        if (updatedBalance.employeeId) {
          queryClient.invalidateQueries({ 
            queryKey: leaveKeys.employeeBalance(
              updatedBalance.employeeId, 
              updatedBalance.employeeType,
              updatedBalance.year
            ) 
          });
        }
      }
    }
  });
};
