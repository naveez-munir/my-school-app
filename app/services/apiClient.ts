import axios from 'axios';

export const createApiClient = (baseURL: string = 'http://localhost:3000') => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add auth interceptor
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const tenantName = localStorage.getItem('tenantName') || 'academy';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-tenant-name'] = tenantName;
    
    return config;
  });

  return api;
};

export default createApiClient();
