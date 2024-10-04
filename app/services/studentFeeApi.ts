import api from './apiClient';
import { 
  type GenerateStudentFeeInput, 
  type StudentFee, 
  type BulkGenerateStudentFeeInput, 
  type ApplyDiscountInput,
  type GetStudentFeesParams,
  type GetPendingFeesParams,
  type PendingFeesResult,
  prepareQueryParams,
  cleanObject
} from '../types/studentFee';

export const studentFeeApi = {
  // Endpoint: GET /student-fees/:id
  getById: async (id: string): Promise<StudentFee> => {
    const response = await api.get<StudentFee>(`/student-fees/${id}`);
    return response.data;
  },
  
  // Endpoint: POST /student-fees/generate
  generateFee: async (data: GenerateStudentFeeInput): Promise<StudentFee> => {
    const response = await api.post<StudentFee>('/student-fees/generate', data);
    return response.data;
  },
  
  // Endpoint: POST /student-fees/bulk-generate
  bulkGenerateFees: async (data: BulkGenerateStudentFeeInput): Promise<StudentFee[]> => {
    const response = await api.post<StudentFee[]>('/student-fees/bulk-generate', data);
    return response.data;
  },
  
  // Endpoint: GET /student-fees/student/:studentId
  getByStudent: async (studentId: string, params?: GetStudentFeesParams): Promise<StudentFee[]> => {
    const queryParams = params ? prepareQueryParams(params) : undefined;
    const response = await api.get<StudentFee[]>(
      `/student-fees/student/${studentId}`, 
      { params: queryParams }
    );
    return response.data;
  },
  
  // Endpoint: GET /student-fees/pending
  getPendingFees: async (params?: GetPendingFeesParams): Promise<PendingFeesResult> => {
    const queryParams = params ? prepareQueryParams(params) : undefined;
    const response = await api.get<PendingFeesResult>(
      '/student-fees/pending', 
      { params: queryParams }
    );
    return response.data;
  },
  
  // Endpoint: GET /student-fees/overdue
  getOverdueFees: async (params?: GetPendingFeesParams): Promise<StudentFee[]> => {
    const queryParams = params ? prepareQueryParams(params) : undefined;
    const response = await api.get<StudentFee[]>(
      '/student-fees/overdue', 
      { params: queryParams }
    );
    return response.data;
  },
  
  // Endpoint: PATCH /student-fees/:id/discount
  applyDiscount: async (id: string, data: ApplyDiscountInput): Promise<StudentFee> => {
    const response = await api.patch<StudentFee>(`/student-fees/${id}/discount`, data);
    return response.data;
  },
  
  // Endpoint: PATCH /student-fees/:id/cancel
  cancelFee: async (id: string, reason: string): Promise<StudentFee> => {
    const response = await api.patch<StudentFee>(`/student-fees/${id}/cancel`, { reason });
    return response.data;
  },
  
  // Endpoint: POST /student-fees/calculate-late-fees
  calculateLateFees: async (): Promise<{ updatedCount: number }> => {
    const response = await api.post<{ updatedCount: number }>('/student-fees/calculate-late-fees');
    return response.data;
  },
  
  // Endpoint: POST /student-fees/update-statuses
  updateFeeStatuses: async (): Promise<{ updatedCount: number }> => {
    const response = await api.post<{ updatedCount: number }>('/student-fees/update-statuses');
    return response.data;
  },
  
  // Endpoint: POST /student-fees/generate-recurring
  generateRecurringFees: async (options: {
    academicYear: string;
    month?: number;
    quarter?: number;
    billType: string;
    feeStructureSelections?: Record<string, string>;
  }): Promise<{
    generated: number;
    skipped: number;
    classesRequiringSelection?: Array<{
      classId: string;
      className: string;
      availableStructures: Array<{ id: string; description: string }>;
    }>;
  }> => {
    const response = await api.post(
      '/student-fees/generate-recurring',
      options
    );
    return response.data;
  },
  
  // Endpoint: POST /student-fees/student/:studentId/sync-discounts
  synchronizeDiscounts: async (studentId: string): Promise<{ updated: number }> => {
    const response = await api.post<{ updated: number }>(
      `/student-fees/student/${studentId}/sync-discounts`
    );
    return response.data;
  }
};
