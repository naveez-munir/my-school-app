import type { 
  CreateExamDto, 
  UpdateExamDto, 
  ExamQueryDto,
  ExamResponse
} from "~/types/exam";
import api from "./api";

export const examApi = {
  getAll: async (params?: ExamQueryDto) => {
    const response = await api.get<ExamResponse[]>('/exams', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ExamResponse>(`/exams/${id}`);
    return response.data;
  },

  getUpcoming: async (classId?: string) => {
    const response = await api.get<ExamResponse[]>('/exams/upcoming', { 
      params: classId ? { classId } : {} 
    });
    return response.data;
  },

  create: async (data: CreateExamDto) => {
    const response = await api.post<ExamResponse>('/exams', data);
    return response.data;
  },

  update: async (id: string, data: UpdateExamDto) => {
    const response = await api.put<ExamResponse>(`/exams/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => {
    const response = await api.put<ExamResponse>(`/exams/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/exams/${id}`);
    return response.data;
  }
};
