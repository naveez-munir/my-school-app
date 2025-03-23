import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type { 
  Student, 
  CreateStudentDto, 
  UpdatePersonalInfoDto,
  UpdateAcademicInfoDto,
  UpdateGuardianInfoDto,
  UpdateStatusDto,
  AddDocumentDto,
  UpdateAttendanceDto,
  SearchStudentDto,
  StudentResponse
} from '~/types/student';

// Export the base service for use with the hooks factory
export const baseStudentService = createEntityService<StudentResponse, CreateStudentDto, Partial<Student>>(
  api,
  '/students'
);

// Create the enhanced API with overridden and additional methods
export const studentApi = {
  ...baseStudentService,
  
  getAll: async (params?: SearchStudentDto) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  addDocument: async (id: string, data: AddDocumentDto) => {
    const response = await api.post(`/students/${id}/documents`, data);
    return response.data;
  },
  
  updateAttendance: async (id: string, data: UpdateAttendanceDto) => {
    const response = await api.put(`/students/${id}/attendance`, data);
    return response.data;
  },
  
  updateStatus: async (id: string, data: UpdateStatusDto) => {
    const response = await api.put(`/students/${id}/status`, data);
    return response.data;
  },
  
  updatePersonalInfo: async (id: string, data: UpdatePersonalInfoDto) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  
  updateAcademicInfo: async (id: string, data: UpdateAcademicInfoDto) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  
  updateGuardianInfo: async (id: string, data: UpdateGuardianInfoDto) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  
  getByClass: async (gradeLevel: string, sectionId?: string) => {
    const url = `/students/class/${gradeLevel}`;
    const params = sectionId ? { sectionId } : undefined;
    const response = await api.get(url, { params });
    return response.data;
  },
  
  getByGuardianCnic: async (cnic: string) => {
    const response = await api.get(`/students/guardian/${cnic}`);
    return response.data;
  },
  
  getByGuardianId: async (guardianId: string) => {
    const response = await api.get(`/students/guardian/id/${guardianId}`);
    return response.data;
  }
};
