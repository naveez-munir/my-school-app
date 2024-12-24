import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '~/services/tenantApi';
import { createQueryHooks } from './queryHookFactory';
import type { TenantStatistics } from '~/types/tenant';

// Create standard CRUD hooks using the factory
const tenantHooks = createQueryHooks('tenant', tenantApi);

// Custom hook for tenant statistics
export const useTenantStatistics = () => {
  return useQuery({
    queryKey: ['tenant', 'statistics'],
    queryFn: tenantApi.getStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export the generated hooks with descriptive names
export const {
  useEntities: useTenants,
  useEntity: useTenant,
  useCreateEntity: useCreateTenant,
  useUpdateEntity: useUpdateTenant,
  useDeleteEntity: useDeleteTenant,
} = tenantHooks;