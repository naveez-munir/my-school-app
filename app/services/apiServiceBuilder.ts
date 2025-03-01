import type { AxiosInstance } from 'axios';

export interface EntityService<T, CreateDTO, UpdateDTO> {
  getAll: (params?: any) => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (data: CreateDTO) => Promise<T>;
  update: (id: string, data: UpdateDTO) => Promise<T>;
  delete: (id: string) => Promise<any>;
}

export const createEntityService = <T, CreateDTO = any, UpdateDTO = any>(
  api: AxiosInstance,
  basePath: string
): EntityService<T, CreateDTO, UpdateDTO> => {
  return {
    getAll: async (params?: any) => {
      const response = await api.get<T[]>(basePath, { params });
      return response.data;
    },
    
    getById: async (id: string) => {
      const response = await api.get<T>(`${basePath}/${id}`);
      return response.data;
    },
    
    create: async (data: CreateDTO) => {
      const response = await api.post<T>(basePath, data);
      return response.data;
    },
    
    update: async (id: string, data: UpdateDTO) => {
      const response = await api.put<T>(`${basePath}/${id}`, data);
      return response.data;
    },
    
    delete: async (id: string) => {
      const response = await api.delete(`${basePath}/${id}`);
      return response.data;
    }
  };
};
