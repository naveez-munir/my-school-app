import api from './api';
import type { 
  CreateTeacherDto, 
  UpdateTeacherDto, 
  TeacherFilters, 
  EducationHistory,
  Experience,
  Document 
} from '~/types/teacher';

export const teacherApi = {
  getAll: async (params?: TeacherFilters) => {
    const response = await api.get('/teachers', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: CreateTeacherDto) => {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTeacherDto) => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },

  assignToClass: async (teacherId: string, classId: string) => {
    const response = await api.put(`/teachers/${teacherId}/class`, { classId });
    return response.data;
  },

  addEducation: async (teacherId: string, education: EducationHistory) => {
    const response = await api.put(`/teachers/${teacherId}/education`, education);
    return response.data;
  },

  addExperience: async (teacherId: string, experience: Experience) => {
    const response = await api.put(`/teachers/${teacherId}/experience`, experience);
    return response.data;
  },

  uploadDocument: async (teacherId: string, document: Document) => {
    const response = await api.put(`/teachers/${teacherId}/documents`, document);
    return response.data;
  },

  updateStatus: async (teacherId: string, employmentStatus: string) => {
    const response = await api.put(`/teachers/${teacherId}/status`, { employmentStatus });
    return response.data;
  }
};
