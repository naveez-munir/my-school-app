import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type { 
  DailyDiaryResponse, 
  CreateDailyDiaryRequest, 
  UpdateDailyDiaryRequest, 
  DiaryQueryParams,
  AttachmentRequest
} from '~/types/dailyDiary';

const baseDiaryService = createEntityService<DailyDiaryResponse, CreateDailyDiaryRequest, UpdateDailyDiaryRequest>(
  api,
  '/daily-diary'
);

export const dailyDiaryApi = {
  ...baseDiaryService,
  
  // Get diary entries by class ID
  getByClass: async (classId: string, params?: DiaryQueryParams) => {
    const response = await api.get<DailyDiaryResponse[]>(`/daily-diary/class/${classId}`, { params });
    return response.data;
  },
  
  // Get diary entries for a student
  getForStudent: async (studentId: string, params?: DiaryQueryParams) => {
    const response = await api.get<DailyDiaryResponse[]>(`/daily-diary/student/${studentId}`, { params });
    return response.data;
  },
  
  // Add attachment to a diary entry
  addAttachment: async (diaryId: string, attachment: AttachmentRequest) => {
    const response = await api.post<DailyDiaryResponse>(`/daily-diary/${diaryId}/attachments`, attachment);
    return response.data;
  },
  
  // Remove attachment from a diary entry
  removeAttachment: async (diaryId: string, attachmentId: string) => {
    await api.delete(`/daily-diary/${diaryId}/attachments/${attachmentId}`);
    return { success: true };
  }
};
