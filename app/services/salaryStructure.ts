import type { SalaryStructureResponse, CreateSalaryStructureDto, UpdateSalaryStructureDto, SearchSalaryStructureDto, EmployeeType } from '~/types/salaryStructure';
import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';

// Create the base service with standard CRUD operations
const baseSalaryStructureService = createEntityService<
  SalaryStructureResponse,
  CreateSalaryStructureDto,
  UpdateSalaryStructureDto
>(api, '/salary-structures');

// Helper function to prepare query parameters
const prepareQueryParams = (params: SearchSalaryStructureDto): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.employeeId) {
    queryParams.employeeId = params.employeeId;
  }
  
  if (params.employeeType) {
    queryParams.employeeType = params.employeeType;
  }
  
  if (params.employeeCategory) {
    queryParams.employeeCategory = params.employeeCategory;
  }
  
  if (params.isActive) {
    queryParams.isActive = params.isActive;
  }
  
  return queryParams;
};

export const salaryStructureApi = {
  // Include all base CRUD operations
  ...baseSalaryStructureService,
  
  // GET /salary-structures with query params
  getAll: async (params?: SearchSalaryStructureDto): Promise<SalaryStructureResponse[]> => {
    const response = await api.get<SalaryStructureResponse[]>(
      '/salary-structures',
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // GET /salary-structures/employee/:employeeId
  getByEmployee: async (employeeId: string, employeeType: EmployeeType): Promise<SalaryStructureResponse[]> => {
    const response = await api.get<SalaryStructureResponse[]>(
      `/salary-structures/employee/${employeeId}`,
      { params: { employeeType } }
    );
    return response.data;
  },
  
  // PUT /salary-structures/:id/activate
  activate: async (id: string): Promise<SalaryStructureResponse> => {
    const response = await api.put<SalaryStructureResponse>(`/salary-structures/${id}/activate`);
    return response.data;
  },
  
  // PUT /salary-structures/:id/deactivate
  deactivate: async (id: string): Promise<SalaryStructureResponse> => {
    const response = await api.put<SalaryStructureResponse>(`/salary-structures/${id}/deactivate`);
    return response.data;
  }
};
