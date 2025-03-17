import api from './apiClient';
import { 
  type CreateStaffRequest,
  type UpdateStaffRequest,
  type StaffListResponse,
  type StaffDetailResponse,
  type SearchStaffParams,
  type EducationHistory,
  type Experience,
  type Document,
  type EmergencyContact,
  type EmploymentStatus
} from '../types/staff';

export const staffApi = {
  getAll: async (params?: SearchStaffParams): Promise<StaffListResponse[]> => {
    const response = await api.get<StaffListResponse[]>('/staff', { params });
    return response.data;
  },

  getById: async (id: string): Promise<StaffDetailResponse> => {
    const response = await api.get<StaffDetailResponse>(`/staff/${id}`);
    return response.data;
  },

  create: async (data: CreateStaffRequest): Promise<StaffDetailResponse> => {
    const response = await api.post<StaffDetailResponse>('/staff', data);
    return response.data;
  },

  update: async (id: string, data: UpdateStaffRequest): Promise<StaffDetailResponse> => {
    const response = await api.put<StaffDetailResponse>(`/staff/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },

  addEducation: async (staffId: string, education: EducationHistory): Promise<StaffListResponse> => {
    const response = await api.put<StaffListResponse>(`/staff/${staffId}/education`, education);
    return response.data;
  },

  addExperience: async (staffId: string, experience: Experience): Promise<StaffListResponse> => {
    const response = await api.put<StaffListResponse>(`/staff/${staffId}/experience`, experience);
    return response.data;
  },

  addDocument: async (staffId: string, document: Document): Promise<StaffListResponse> => {
    const response = await api.put<StaffListResponse>(`/staff/${staffId}/documents`, document);
    return response.data;
  },

  updateEmergencyContact: async (staffId: string, contact: EmergencyContact): Promise<StaffListResponse> => {
    const response = await api.put<StaffListResponse>(`/staff/${staffId}/emergency-contact`, contact);
    return response.data;
  },

  updateStatus: async (staffId: string, status: EmploymentStatus): Promise<StaffListResponse> => {
    const response = await api.put<StaffListResponse>(`/staff/${staffId}/status`, { status });
    return response.data;
  }
};
