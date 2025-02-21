import api from './api';
import type { 
  Student, 
  CreateStudentDto, 
  UpdateStudentDto, 
  SearchStudentDto 
} from '~/types/student';

export const studentApi = {
  getAll: async (params?: SearchStudentDto) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentDto) => {
    const response = await api.post('/students', data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudentDto) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  getByClass: async (classId: string) => {
    const response = await api.get(`/students/class/${classId}`);
    return response.data;
  },

  getByGradeLevel: async (gradeLevel: string) => {
    const response = await api.get(`/students/grade/${gradeLevel}`);
    return response.data;
  }
};
