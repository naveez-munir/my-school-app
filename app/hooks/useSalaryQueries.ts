import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salaryApi } from '../services/salaryApi';
import { createQueryHooks } from './queryHookFactory';
import type {
  SalaryResponse,
  CreateSalaryDto,
  UpdateSalaryDto,
  ApproveSalaryDto,
  ProcessPaymentDto,
  SearchSalaryParams
} from '../types/salary.types';

// Create base hooks using the factory
const baseHooks = createQueryHooks<SalaryResponse, CreateSalaryDto, UpdateSalaryDto>(
  'salaries',
  salaryApi
);

// Override the useEntities hook to handle the custom params
export const useSalaries = (params?: SearchSalaryParams) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), params],
    queryFn: () => salaryApi.getAll(params)
  });
};

// Hook for fetching salaries for a specific employee
export const useEmployeeSalaries = (employeeId: string, employeeType: string, year?: number) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'employee', employeeId, employeeType, year],
    queryFn: () => salaryApi.getByEmployee(employeeId, employeeType, year),
    enabled: !!employeeId && !!employeeType
  });
};

// Hook for fetching monthly salaries
export const useMonthlySalaries = (month: number, year: number) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'monthly', month, year],
    queryFn: () => salaryApi.getMonthly(month, year),
    enabled: !!month && !!year
  });
};

// Hook for generating a salary for an employee
export const useGenerateSalary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      employeeId, 
      employeeType, 
      month, 
      year 
    }: { 
      employeeId: string; 
      employeeType: string; 
      month: number; 
      year: number 
    }) => salaryApi.generateSalary(employeeId, employeeType, month, year),
    onSuccess: (newSalary) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(newSalary.id as string), 
        newSalary
      );
    }
  });
};

// Hook for bulk generating salaries
export const useGenerateAllSalaries = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      month, 
      year, 
      employeeType 
    }: { 
      month: number; 
      year: number; 
      employeeType?: string 
    }) => salaryApi.generateAllSalaries(month, year, employeeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
    }
  });
};

// Hook for approving a salary
export const useApproveSalary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: ApproveSalaryDto 
    }) => salaryApi.approveSalary(id, data),
    onSuccess: (updatedSalary) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(updatedSalary.id as string), 
        updatedSalary
      );
    }
  });
};

// Hook for processing payment for a salary
export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: ProcessPaymentDto 
    }) => salaryApi.processPayment(id, data),
    onSuccess: (updatedSalary) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(updatedSalary.id as string), 
        updatedSalary
      );
    }
  });
};

// Hook for cancelling a salary
export const useCancelSalary = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => salaryApi.cancelSalary(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.detail(id) });
    }
  });
};

// Hook for generating a salary slip
export const useGenerateSalarySlip = () => {
  return useMutation({
    mutationFn: (id: string) => salaryApi.generateSalarySlip(id),
    onSuccess: (pdfBlob) => {
      // Create a URL for the blob and open it in a new window
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    }
  });
};

// Hook for generating bulk salary slips
export const useGenerateBulkSalarySlips = () => {
  return useMutation({
    mutationFn: (ids: string[]) => salaryApi.generateBulkSalarySlips(ids),
    onSuccess: (pdfBlob) => {
      // Create a URL for the blob and open it in a new window
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    }
  });
};

// Export other base hooks with renamed exports
export const {
  keys: salaryKeys,
  useEntity: useSalary,
  useCreateEntity: useCreateSalary,
  useUpdateEntity: useUpdateSalary,
  useDeleteEntity: useDeleteSalary
} = baseHooks;
