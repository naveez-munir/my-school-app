import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import { 
  type CreateFeeStructureInput, 
  type FeeStructure, 
  type UpdateFeeStructureInput, 
  type BulkGenerateFeeStructureInput,
  type CloneFeeStructureInput,
  type ListFeeStructuresParams,
  prepareQueryParams
} from '../types/studentFee';

// Create the base service with standard CRUD operations
const baseFeeStructureService = createEntityService<
  FeeStructure, 
  CreateFeeStructureInput, 
  UpdateFeeStructureInput
>(api, '/fee-structures');

export const feeStructureApi = {
  // Include all base CRUD operations with override for getAll
  ...baseFeeStructureService,
  
  // Override getAll to handle params properly
  getAll: async (params?: ListFeeStructuresParams): Promise<FeeStructure[]> => {
    const response = await api.get<FeeStructure[]>(
      '/fee-structures', 
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // Endpoint: POST /fee-structures/bulk-generate
  bulkGenerate: async (data: BulkGenerateFeeStructureInput): Promise<FeeStructure[]> => {
    const response = await api.post<FeeStructure[]>('/fee-structures/bulk-generate', data);
    return response.data;
  },
  
  // Endpoint: GET /fee-structures/class/:classId/academic-year/:year
  getByClassAndYear: async (classId: string, academicYear: string): Promise<FeeStructure> => {
    const response = await api.get<FeeStructure>(
      `/fee-structures/class/${classId}/academic-year/${academicYear}`
    );
    return response.data;
  },
  
  // Endpoint: POST /fee-structures/:id/clone
  cloneStructure: async (id: string, data: CloneFeeStructureInput): Promise<FeeStructure> => {
    const response = await api.post<FeeStructure>(`/fee-structures/${id}/clone`, data);
    return response.data;
  },
  
  // Endpoint: PATCH /fee-structures/:id/toggle-status
  toggleStatus: async (id: string): Promise<FeeStructure> => {
    const response = await api.patch<FeeStructure>(`/fee-structures/${id}/toggle-status`);
    return response.data;
  }
};
