import type { CreateExamTypeDto, UpdateExamTypeDto } from "~/types/examType";
import api from "./api";

export const examTypeApi = {
  getAll: async (activeOnly?: boolean) => {
    const response = await api.get('/exam-types'
      //  { params: activeOnly !== undefined ? { activeOnly } : {} }
      );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/exam-types/${id}`);
    return response.data;
  },

  create: async (data: CreateExamTypeDto) => {
    const response = await api.post('/exam-types', data);
    return response.data;
  },

  update: async (id: string, data: UpdateExamTypeDto) => {
    const response = await api.put(`/exam-types/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/exam-types/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.put(`/exam-types/${id}/toggle-status`);
    return response.data;
  }
};
