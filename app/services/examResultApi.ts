import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  ExamResultResponse,
  CreateExamResultRequest,
  BulkResultInput,
  BulkResultResponse
} from '~/types/examResult';

const baseExamResultService = createEntityService<
  ExamResultResponse,
  CreateExamResultRequest,
  Partial<CreateExamResultRequest>
>(
  api,
  '/exam-results'
);

export const examResultApi = {
  ...baseExamResultService,
  getStudentResults: async (studentId: string) => {
    const response = await api.get<ExamResultResponse[]>(`/exam-results/student/${studentId}`);
    return response.data;
  },

  getClassResults: async (examId: string) => {
    const response = await api.get<ExamResultResponse[]>(`/exam-results/exam/${examId}`);
    return response.data;
  },

  generateClassRanks: async (examId: string) => {
    const response = await api.post<ExamResultResponse[]>(`/exam-results/generate-ranks/${examId}`);
    return response.data;
  },

  createBulkResults: async (data: BulkResultInput) => {
    const response = await api.post<BulkResultResponse>('/exam-results/bulk', data);
    return response.data;
  }
};
