import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type { ExamResponse, CreateExamDto, UpdateExamDto } from '~/types/exam';

const baseExamService = createEntityService<ExamResponse, CreateExamDto, UpdateExamDto>(
  api, 
  '/exams'
);

export const examApi = {
  ...baseExamService,

  getUpcoming: async (classId?: string) => {
    const response = await api.get<ExamResponse[]>('/exams/upcoming', {
      params: classId ? { classId } : {}
    });
    return response.data;
  },

  updateStatus: async (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => {
    const response = await api.put<ExamResponse>(`/exams/${id}/status`, { status });
    return response.data;
  },

  getMyExams: async () => {
    const response = await api.get<ExamResponse[]>('/exams/my-exams');
    return response.data;
  },

  getMyTeachingExams: async () => {
    const response = await api.get<ExamResponse[]>('/exams/my-teaching-exams');
    return response.data;
  }
};
