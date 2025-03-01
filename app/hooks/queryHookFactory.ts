import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  type UseQueryOptions,
  type QueryKey
} from '@tanstack/react-query';
import type { EntityService } from '~/services/apiServiceBuilder';

export const createQueryHooks = <T, CreateDTO, UpdateDTO>(
  entityName: string,
  service: EntityService<T, CreateDTO, UpdateDTO>
) => {
  // Query keys
  const keys = {
    all: [entityName] as const,
    lists: () => [...keys.all, 'list'] as const,
    list: (filters: any = {}) => [...keys.lists(), filters] as const,
    details: () => [...keys.all, 'detail'] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };

  // Fetch all entities
  const useEntities = (params?: any, options?: UseQueryOptions<T[]>) => {
    return useQuery({
      queryKey: keys.list(params || {}),
      queryFn: () => service.getAll(params),
      ...options
    });
  };

  // Fetch a single entity by ID
  const useEntity = (id: string, options?: UseQueryOptions<T>) => {
    return useQuery({
      queryKey: keys.detail(id),
      queryFn: () => service.getById(id),
      enabled: !!id,
      ...options
    });
  };

  // Create a new entity
  const useCreateEntity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (data: CreateDTO) => service.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
      }
    });
  };

  // Update an existing entity
  const useUpdateEntity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateDTO }) => 
        service.update(id, data),
      onSuccess: (updated: any) => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        queryClient.invalidateQueries({ queryKey: keys.detail(updated.id || updated._id) });
      }
    });
  };

  // Delete an entity
  const useDeleteEntity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (id: string) => service.delete(id),
      onSuccess: (_data, id) => {
        queryClient.invalidateQueries({ queryKey: keys.lists() });
        queryClient.removeQueries({ queryKey: keys.detail(id) });
      }
    });
  };

  return {
    keys,
    useEntities,
    useEntity,
    useCreateEntity,
    useUpdateEntity,
    useDeleteEntity
  };
};
