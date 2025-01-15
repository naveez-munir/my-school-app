import type { CreateAcademicYearDto, UpdateAcademicYearDto } from "~/types/academicYear";
import api from "./api";

export const academicYearApi = {
  getAll: async () => {
    const response = await api.get("/academic-years");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/academic-years/${id}`);
    return response.data;
  },

  create: async (data: CreateAcademicYearDto) => {
    const response = await api.post("/academic-years", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAcademicYearDto) => {
    const response = await api.put(`/academic-years/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/academic-years/${id}`);
    return response.data;
  },
};
