import type { CreateClassDto, UpdateClassDto } from '~/types/class';
import api from './api';

export const classApi = {
  getAll: async (params?: { className?: string; classSection?: string }) => {
    const response = await api.get('/classes', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  create: async (data: CreateClassDto) => {
    const response = await api.post('/classes', data);
    return response.data;
  },

  update: async (id: string, data: UpdateClassDto) => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  assignTeacher: async (classId: string, teacherId: string) => {
    const response = await api.put(`/classes/${classId}/teacher`, { teacherId });
    return response.data;
  },

  removeTeacher: async (classId: string) => {
    const response = await api.put(`/classes/${classId}/teacher/remove`);
    return response.data;
  },

  assignTempTeacher: async (classId: string, teacherId: string) => {
    const response = await api.put(`/classes/${classId}/temp-teacher/assign`, { teacherId });
    return response.data;
  },

  removeTempTeacher: async (classId: string) => {
    const response = await api.put(`/classes/${classId}/temp-teacher/remove`);
    return response.data;
  },

  addSubjects: async (classId: string, subjectIds: string[]) => {
    const response = await api.put(`/classes/${classId}/subjects/add`, { subjectIds });
    return response.data;
  },

  removeSubjects: async (classId: string, subjectIds: string[]) => {
    const response = await api.put(`/classes/${classId}/subjects/remove`, { subjectIds });
    return response.data;
  },

  getByGradeLevel: async (gradeLevel: string, sectionId?: string) => {
    const response = await api.get(`/classes/grade/${gradeLevel}`, {
      params: { sectionId }
    });
    return response.data;
  }
};
