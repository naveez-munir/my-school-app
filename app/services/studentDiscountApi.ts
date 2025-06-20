// src/services/studentDiscountApi.ts
import api from './apiClient';
import type { 
  StudentDiscount,
  CreateStudentDiscountInput,
  UpdateStudentDiscountInput,
  PopulatedStudentDiscount
} from '../types/studentFee';

export const studentDiscountApi = {
  // Create a new student discount
  create: async (data: CreateStudentDiscountInput, syncWithFees = false): Promise<StudentDiscount> => {
    const response = await api.post<StudentDiscount>(
      `/student-discounts?syncWithFees=${syncWithFees}`, 
      data
    );
    return response.data;
  },
  
  // Get all discounts for a student
  getByStudent: async (studentId: string): Promise<StudentDiscount[]> => {
    const response = await api.get<StudentDiscount[]>(`/student-discounts/student/${studentId}`);
    return response.data;
  },
  
  // Get only active discounts for a student
  getActiveDiscounts: async (studentId: string): Promise<StudentDiscount[]> => {
    const response = await api.get<StudentDiscount[]>(`/student-discounts/active/${studentId}`);
    return response.data;
  },
  
  // Update a student discount
  update: async (id: string, data: UpdateStudentDiscountInput, syncWithFees = false): Promise<StudentDiscount> => {
    const response = await api.put<StudentDiscount>(
      `/student-discounts/${id}?syncWithFees=${syncWithFees}`, 
      data
    );
    return response.data;
  },
  
  // Toggle the active status of a discount
  toggleStatus: async (id: string, syncWithFees = false): Promise<StudentDiscount> => {
    const response = await api.put<StudentDiscount>(
      `/student-discounts/${id}/toggle-status?syncWithFees=${syncWithFees}`
    );
    return response.data;
  },
  
  // Manually sync a discount with all applicable fees
  syncFees: async (id: string): Promise<{ updated: number }> => {
    const response = await api.post<{ updated: number }>(`/student-discounts/${id}/sync-fees`);
    return response.data;
  },
  
  // Remove a student discount
  remove: async (id: string, syncWithFees = false): Promise<boolean> => {
    const response = await api.delete<boolean>(
      `/student-discounts/${id}?syncWithFees=${syncWithFees}`
    );
    return response.data;
  },
  
  // Sync all discounts for a student with their fees
  synchronizeDiscountsForStudent: async (studentId: string): Promise<{ updated: number }> => {
    const response = await api.post<{ updated: number }>(
      `/student-discounts/student/${studentId}/sync-discounts`
    );
    return response.data;
  }
};
