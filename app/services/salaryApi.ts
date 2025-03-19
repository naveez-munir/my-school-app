import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  Salary,
  SalaryResponse,
  CreateSalaryDto,
  UpdateSalaryDto,
  SearchSalaryParams,
  ApproveSalaryDto,
  ProcessPaymentDto
} from '../types/salary.types';

// Helper function to prepare query params
export const prepareQueryParams = (params: SearchSalaryParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.employeeId) queryParams.employeeId = params.employeeId;
  if (params.employeeType) queryParams.employeeType = params.employeeType;
  if (params.month !== undefined) queryParams.month = params.month.toString();
  if (params.year !== undefined) queryParams.year = params.year.toString();
  if (params.status) queryParams.status = params.status;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  if (params.approvedBy) queryParams.approvedBy = params.approvedBy;
  
  return queryParams;
};

// Create the base service with standard CRUD operations
const baseSalaryService = createEntityService<
  SalaryResponse,
  CreateSalaryDto,
  UpdateSalaryDto
>(api, '/salaries');

export const salaryApi = {
  // Include all base CRUD operations
  ...baseSalaryService,
  
  // Override getAll to handle params properly
  getAll: async (params?: SearchSalaryParams): Promise<SalaryResponse[]> => {
    const response = await api.get<SalaryResponse[]>(
      '/salaries',
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // Get salaries for specific employee
  getByEmployee: async (employeeId: string, employeeType: string, year?: number): Promise<SalaryResponse[]> => {
    const params: Record<string, string | number> = { employeeType };
    if (year) params.year = year;
    
    const response = await api.get<SalaryResponse[]>(
      `/salaries/employee/${employeeId}`,
      { params }
    );
    return response.data;
  },
  
  // Get salaries for a specific month/year
  getMonthly: async (month: number, year: number): Promise<SalaryResponse[]> => {
    const response = await api.get<SalaryResponse[]>(
      '/salaries/monthly',
      { params: { month, year } }
    );
    return response.data;
  },
  
  // Generate salary for an employee
  generateSalary: async (employeeId: string, employeeType: string, month: number, year: number): Promise<SalaryResponse> => {
    const response = await api.post<SalaryResponse>('/salaries/generate', {
      employeeId,
      employeeType,
      month,
      year
    });
    return response.data;
  },
  
  // Generate salaries for all employees
  generateAllSalaries: async (month: number, year: number, employeeType?: string): Promise<{ processed: number, failed: number, message: string }> => {
    const response = await api.post<{ processed: number, failed: number, message: string }>(
      '/salaries/generate-all',
      { month, year, employeeType }
    );
    return response.data;
  },
  
  // Approve a salary
  approveSalary: async (id: string, approveData: ApproveSalaryDto): Promise<SalaryResponse> => {
    const response = await api.put<SalaryResponse>(`/salaries/${id}/approve`, approveData);
    return response.data;
  },
  
  // Process payment for a salary
  processPayment: async (id: string, paymentData: ProcessPaymentDto): Promise<SalaryResponse> => {
    const response = await api.put<SalaryResponse>(`/salaries/${id}/payment`, paymentData);
    return response.data;
  },
  
  // Cancel a salary
  cancelSalary: async (id: string): Promise<void> => {
    await api.delete(`/salaries/${id}`);
  },
  
  // Generate salary slip (returns blob for PDF)
  generateSalarySlip: async (id: string): Promise<Blob> => {
    const response = await api.get(`/salaries/${id}/slip`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  // Generate bulk salary slips (returns blob for PDF)
  generateBulkSalarySlips: async (ids: string[]): Promise<Blob> => {
    const response = await api.post(
      '/salaries/bulk-slips',
      { ids },
      { responseType: 'blob' }
    );
    return response.data;
  }
};

export default salaryApi;
