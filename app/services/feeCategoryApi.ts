import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import { 
  type CreateFeeCategoryInput, 
  type FeeCategory, 
  type UpdateFeeCategoryInput, 
  type ListFeeCategoriesParams,
  prepareQueryParams
} from '../types/studentFee';

// Create the base service with standard CRUD operations
const baseFeeCategoryService = createEntityService<
  FeeCategory, 
  CreateFeeCategoryInput, 
  UpdateFeeCategoryInput
>(api, '/fee-categories');

export const feeCategoryApi = {
  // Include all base CRUD operations
  ...baseFeeCategoryService,
  
  // Override getAll to handle params properly
  getAll: async (params?: ListFeeCategoriesParams): Promise<FeeCategory[]> => {
    const response = await api.get<FeeCategory[]>(
      '/fee-categories', 
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // Endpoint: PATCH /fee-categories/:id/toggle-status
  toggleStatus: async (id: string): Promise<FeeCategory> => {
    const response = await api.patch<FeeCategory>(`/fee-categories/${id}/toggle-status`);
    return response.data;
  },
  
  // Endpoint: GET /fee-categories/:id/usage
  getCategoryUsage: async (id: string, academicYear?: string): Promise<{
    categoryId: string;
    usedInStructures: number;
    financials: {
      total: number;
      collected: number;
      outstanding: number;
    };
    academicYear: string;
  }> => {
    const params = academicYear ? { academicYear } : undefined;
    const response = await api.get(`/fee-categories/${id}/usage`, { params });
    return response.data;
  },
  
  // Endpoint: GET /fee-categories/validate/bulk
  validateCategories: async (categoryIds: string[]): Promise<{
    valid: string[];
    invalid: string[];
  }> => {
    const idsParam = categoryIds.join(',');
    const response = await api.get(`/fee-categories/validate/bulk`, {
      params: { ids: idsParam }
    });
    return response.data;
  }
};
