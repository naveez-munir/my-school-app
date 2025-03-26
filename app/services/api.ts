import axios from 'axios';
import { getAuthData } from '~/utils/auth';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
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

export default api;
