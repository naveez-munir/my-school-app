import api from './apiClient';

export interface FileUploadResponse {
  key: string;
  url: string;
  isPrivate: boolean;
  message: string;
}

export interface FileUrlResponse {
  url: string;
}

export const fileApi = {
  upload: async (file: File, folder?: string, isPrivate: boolean = false): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = '/files/upload';
    const params = { folder, private: isPrivate };
    
    const response = await api.post(url, formData, { 
      params,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  getSignedUrl: async (key: string, expiresIn: number = 3600): Promise<FileUrlResponse> => {
    const response = await api.get(`/files/${key}`, { params: { expiresIn } });
    return response.data;
  },
  
  delete: async (key: string): Promise<{ message: string }> => {
    const response = await api.delete(`/files/${key}`);
    return response.data;
  },
  
  listFiles: async (folder: string): Promise<{ files: string[] }> => {
    const response = await api.get(`/files/list/${folder}`);
    return response.data;
  }
};
