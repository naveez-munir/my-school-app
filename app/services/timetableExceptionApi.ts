import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type { 
  TimetableException,
  CreateExceptionDto,
  UpdateExceptionDto,
  ApproveExceptionDto,
  ExceptionQueryParams
} from '~/types/timetable';

// ============================================
// TIMETABLE EXCEPTION SERVICE
// ============================================

export const baseExceptionService = createEntityService<
  TimetableException, 
  CreateExceptionDto, 
  UpdateExceptionDto
>(api, '/timetable/exceptions');

export const exceptionApi = {
  ...baseExceptionService,

  getAll: async (params?: ExceptionQueryParams) => {
    const response = await api.get<TimetableException[]>(
      '/timetable/exceptions',
      { params }
    );
    return response.data;
  },

  getByDate: async (date: string, classId?: string) => {
    const response = await api.get<TimetableException[]>(
      `/timetable/exceptions/date/${date}`,
      { params: { classId } }
    );
    return response.data;
  },

  getByTimetable: async (timetableId: string) => {
    const response = await api.get<TimetableException[]>(
      `/timetable/exceptions/timetable/${timetableId}`
    );
    return response.data;
  },

  getTeacherSubstitutions: async (teacherId: string, date: string) => {
    const response = await api.get<TimetableException[]>(
      `/timetable/exceptions/teacher/${teacherId}/date/${date}`
    );
    return response.data;
  },

  approve: async (id: string, notes?: string) => {
    const response = await api.put<TimetableException>(
      `/timetable/exceptions/${id}/approve`,
      { notes }
    );
    return response.data;
  }
};

