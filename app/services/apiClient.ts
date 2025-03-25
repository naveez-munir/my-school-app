import axios from 'axios';
import { getAuthData } from '~/utils/auth';

export const createApiClient = (baseURL: string = 'http://localhost:3000') => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  api.interceptors.request.use((config) => {
    const authData = getAuthData();
    
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    
    config.headers['x-tenant-name'] = authData?.tenantName || 'academy';
    
    return config;
  });

  return api;
};

export default createApiClient();
