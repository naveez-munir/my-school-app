import axios from 'axios';
const getAuthData = () => {
  try {
    const authDataStr = localStorage.getItem('authData');
    if (!authDataStr) return null;
    
    const authData = JSON.parse(authDataStr);
    const now = new Date().getTime();

    if (authData.expiry && now > authData.expiry) {
      localStorage.removeItem('authData');
      return null;
    }
    
    return authData;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
};

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
