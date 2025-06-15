import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQueryHooks } from './queryHookFactory';
import { salaryStructureApi } from '~/services/salaryStructure';
import type { SalaryStructureResponse, CreateSalaryStructureDto, UpdateSalaryStructureDto, SearchSalaryStructureDto, EmployeeType } from '~/types/salaryStructure';

// Create base hooks using the factory
const baseHooks = createQueryHooks<SalaryStructureResponse, CreateSalaryStructureDto, UpdateSalaryStructureDto>(
  'salaryStructures',
  salaryStructureApi
);

// Override the useEntities hook to handle the custom params
export const useSalaryStructures = (params?: SearchSalaryStructureDto) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), params],
    queryFn: () => salaryStructureApi.getAll(params)
  });
};

// Hook for getting structures by employee
export const useSalaryStructuresByEmployee = (employeeId: string, employeeType: EmployeeType) => {
  return useQuery({
    queryKey: [...baseHooks.keys.lists(), 'byEmployee', employeeId, employeeType],
    queryFn: () => salaryStructureApi.getByEmployee(employeeId, employeeType),
    enabled: !!employeeId && !!employeeType
  });
};

// Hook for activating a salary structure
export const useActivateSalaryStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => salaryStructureApi.activate(id),
    onSuccess: (updatedStructure) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(updatedStructure.id as string), 
        updatedStructure
      );
    }
  });
};

// Hook for deactivating a salary structure
export const useDeactivateSalaryStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => salaryStructureApi.deactivate(id),
    onSuccess: (updatedStructure) => {
      queryClient.invalidateQueries({ queryKey: baseHooks.keys.lists() });
      queryClient.setQueryData(
        baseHooks.keys.detail(updatedStructure.id as string), 
        updatedStructure
      );
    }
  });
};

// Export other base hooks with renamed exports
export const {
  keys: salaryStructureKeys,
  useEntity: useSalaryStructure,
  useCreateEntity: useCreateSalaryStructure,
  useUpdateEntity: useUpdateSalaryStructure,
  useDeleteEntity: useDeleteSalaryStructure
} = baseHooks;
