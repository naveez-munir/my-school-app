import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  StudentLeaveResponse,
  CreateStudentLeaveRequest,
  ApproveLeaveRequest,
  SearchStudentLeaveRequest
} from '../types/studentLeave';

export const prepareLeaveQueryParams = (params: SearchStudentLeaveRequest): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.studentId) queryParams.studentId = params.studentId;
  if (params.status) queryParams.status = params.status;
  if (params.startDateFrom) queryParams.startDateFrom = params.startDateFrom;
  if (params.startDateTo) queryParams.startDateTo = params.startDateTo;
  if (params.endDateFrom) queryParams.endDateFrom = params.endDateFrom;
  if (params.endDateTo) queryParams.endDateTo = params.endDateTo;
  
  return queryParams;
};

const baseStudentLeaveService = createEntityService<
  StudentLeaveResponse,
  CreateStudentLeaveRequest
>(api, '/student-leaves');

export const studentLeaveApi = {
  ...baseStudentLeaveService,

  getAll: async (params?: SearchStudentLeaveRequest): Promise<StudentLeaveResponse[]> => {
    const response = await api.get<StudentLeaveResponse[]>(
      '/student-leaves',
      { params: params ? prepareLeaveQueryParams(params) : undefined }
    );
    return response.data;
  },
  getMyLeaves: async (params?: SearchStudentLeaveRequest): Promise<StudentLeaveResponse[]> => {
    const response = await api.get<StudentLeaveResponse[]>(
      'student-leaves/my-leaves',
      { params: params ? prepareLeaveQueryParams(params) : undefined }
    );
    return response.data;
  },

  getPendingLeaves: async (): Promise<StudentLeaveResponse[]> => {
    const response = await api.get<StudentLeaveResponse[]>('/student-leaves/pending');
    return response.data;
  },

  getMyStudentsLeaves: async (): Promise<StudentLeaveResponse[]> => {
    const response = await api.get<StudentLeaveResponse[]>('/student-leaves/my-students');
    return response.data;
  },

  getLeavesByStudent: async (studentId: string): Promise<StudentLeaveResponse[]> => {
    const response = await api.get<StudentLeaveResponse[]>('/student-leaves', {
      params: { studentId }
    });
    return response.data;
  },

  approveLeave: async (id: string, data: ApproveLeaveRequest): Promise<StudentLeaveResponse> => {
    const response = await api.put<StudentLeaveResponse>(`/student-leaves/${id}/approve`, data);
    return response.data;
  },

  cancelLeave: async (id: string): Promise<void> => {
    await api.delete(`/student-leaves/${id}`);
  }
};

export default studentLeaveApi;
