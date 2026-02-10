import api from './apiClient';
import {
  type GenerateStudentFeeInput,
  type PopulatedStudentFee,
  type BulkGenerateStudentFeeInput,
  type ApplyDiscountInput,
  type GetStudentFeesParams,
  type GetPendingFeesParams,
  type PendingFeesResult,
  type CreateAdhocFeeInput,
  type StudentFeeSettlementInput,
  type SettlementSummary,
  type StudentClassTransferInput,
  type TransferSummary,
  prepareQueryParams,
  cleanObject
} from '../types/studentFee';

export const studentFeeApi = {
  // Endpoint: GET /student-fees/:id
  getById: async (id: string): Promise<PopulatedStudentFee> => {
    const response = await api.get<PopulatedStudentFee>(`/student-fees/${id}`);
    return response.data;
  },

  // Endpoint: POST /student-fees/generate
  generateFee: async (data: GenerateStudentFeeInput): Promise<PopulatedStudentFee> => {
    const response = await api.post<PopulatedStudentFee>('/student-fees/generate', data);
    return response.data;
  },

  // Endpoint: POST /student-fees/bulk-generate
  bulkGenerateFees: async (data: BulkGenerateStudentFeeInput): Promise<PopulatedStudentFee[]> => {
    const response = await api.post<PopulatedStudentFee[]>('/student-fees/bulk-generate', data);
    return response.data;
  },

  // Endpoint: GET /student-fees/student/:studentId
  getByStudent: async (studentId: string, params?: GetStudentFeesParams): Promise<PopulatedStudentFee[]> => {
    const queryParams = params ? prepareQueryParams(params) : undefined;
    const response = await api.get<PopulatedStudentFee[]>(
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
  getOverdueFees: async (params?: GetPendingFeesParams): Promise<PopulatedStudentFee[]> => {
    const queryParams = params ? prepareQueryParams(params) : undefined;
    const response = await api.get<PopulatedStudentFee[]>(
      '/student-fees/overdue',
      { params: queryParams }
    );
    return response.data;
  },

  // Endpoint: PATCH /student-fees/:id/discount
  applyDiscount: async (id: string, data: ApplyDiscountInput): Promise<PopulatedStudentFee> => {
    const response = await api.patch<PopulatedStudentFee>(`/student-fees/${id}/discount`, data);
    return response.data;
  },

  // Endpoint: PATCH /student-fees/:id/cancel
  cancelFee: async (id: string, reason: string): Promise<PopulatedStudentFee> => {
    const response = await api.patch<PopulatedStudentFee>(`/student-fees/${id}/cancel`, { reason });
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
  },

  // Endpoint: POST /student-fees/adhoc
  createAdhocFee: async (data: CreateAdhocFeeInput): Promise<PopulatedStudentFee> => {
    const response = await api.post<PopulatedStudentFee>('/student-fees/adhoc', cleanObject(data));
    return response.data;
  },

  // Endpoint: POST /student-fees/student/:studentId/settle
  settleStudentFees: async (
    studentId: string,
    data: StudentFeeSettlementInput
  ): Promise<SettlementSummary> => {
    const response = await api.post<SettlementSummary>(
      `/student-fees/student/${studentId}/settle`,
      cleanObject(data)
    );
    return response.data;
  },

  // Endpoint: POST /student-fees/student/:studentId/class-transfer
  handleClassTransfer: async (
    studentId: string,
    data: StudentClassTransferInput
  ): Promise<TransferSummary> => {
    const response = await api.post<TransferSummary>(
      `/student-fees/student/${studentId}/class-transfer`,
      cleanObject(data)
    );
    return response.data;
  }
};
