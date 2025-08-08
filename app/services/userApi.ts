import api from './apiClient';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto
} from '~/types/user';

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<string> => {
    const response = await api.post<string>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string): Promise<User> => {
    const response = await api.put<User>(`/users/${id}/status`);
    return response.data;
  },

  updatePassword: async (id: string, data: UpdatePasswordDto): Promise<{ message: string }> => {
    const response = await api.put(`/users/${id}/password`, data);
    return response.data;
  }
};
