import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  Tenant,
  CreateTenantDto,
  UpdateTenantDto,
  TenantStatistics
} from '~/types/tenant';

// Export the base service for use with the hooks factory
export const baseTenantService = createEntityService<Tenant, CreateTenantDto, UpdateTenantDto>(
  api,
  '/tenants'
);

// Create the enhanced API with overridden and additional methods
export const tenantApi = {
  ...baseTenantService,

  getAll: async () => {
    const response = await api.get('/tenants');
    return response.data;
  },

  getById: async (id: string): Promise<Tenant> => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  },

  getStatistics: async (): Promise<TenantStatistics> => {
    const response = await api.get('/tenants/statistics');
    return response.data;
  },
};