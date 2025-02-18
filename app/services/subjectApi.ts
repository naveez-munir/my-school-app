import type { CreateSubjectDto, UpdateSubjectDto } from "~/types/subject";
import api from "./api";

export const subjectApi = {
  getAll: async (params?: { subjectName?: string; subjectCode?: string }) => {
    const response = await api.get('/subjects', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  create: async (data: CreateSubjectDto) => {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSubjectDto) => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  }
};
