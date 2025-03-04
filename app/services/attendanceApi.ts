import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  AttendanceRecord,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  BatchAttendanceInput,
  BatchResponse,
  ClassAttendanceFilter,
  UserAttendanceFilter,
  MonthlyReportFilter,
  ClassAttendanceReport,
  UserAttendanceReport,
  MonthlyAttendanceReport
} from '~/types/attendance';

const baseAttendanceService = createEntityService<AttendanceRecord, CreateAttendanceInput, UpdateAttendanceInput>(
  api,
  '/attendance'
);

export const attendanceApi = {
  ...baseAttendanceService,
  
  // Batch attendance creation
  createBatch: async (data: BatchAttendanceInput): Promise<BatchResponse> => {
    const response = await api.post<BatchResponse>('/attendance/batch', data);
    return response.data;
  },
  
  // Class attendance report
  getClassReport: async (classId: string, filter?: ClassAttendanceFilter): Promise<ClassAttendanceReport> => {
    const response = await api.get<ClassAttendanceReport>(`/attendance/report/class/${classId}`, { params: filter });
    return response.data;
  },
  
  // User attendance report
  getUserReport: async (userId: string, filter?: UserAttendanceFilter): Promise<UserAttendanceReport> => {
    const response = await api.get<UserAttendanceReport>(`/attendance/report/user/${userId}`, { params: filter });
    return response.data;
  },
  
  // Monthly attendance report
  getMonthlyReport: async (filter: MonthlyReportFilter): Promise<MonthlyAttendanceReport> => {
    const response = await api.get<MonthlyAttendanceReport>('/attendance/report/monthly', { params: filter });
    return response.data;
  }
};
