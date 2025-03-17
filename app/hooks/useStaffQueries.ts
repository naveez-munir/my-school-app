// src/hooks/useStaffQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../services/staffApi';
import type { 
  StaffDetailResponse,
  StaffListResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
  SearchStaffParams,
  EducationHistory,
  Experience,
  Document,
  EmergencyContact,
  EmploymentStatus
} from '../types/staff';

// Query keys for caching and invalidation
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: any = {}) => [...staffKeys.lists(), filters] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
};

// Get all staff members with optional search parameters
export const useStaffList = (params?: SearchStaffParams) => {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffApi.getAll(params)
  });
};

// Get a specific staff member by ID
export const useStaff = (id: string) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getById(id),
    enabled: !!id // Only run the query if an ID is provided
  });
};

// Create a new staff member
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStaffRequest) => staffApi.create(data),
    onSuccess: () => {
      // Invalidate the staff list query to refresh the data
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    }
  });
};

// Update an existing staff member
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) => 
      staffApi.update(id, data),
    onSuccess: (updatedStaff) => {
      // Invalidate both the list and the specific staff member
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: staffKeys.detail(updatedStaff.id) 
      });
    }
  });
};

// Delete a staff member
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: (_, id) => {
      // Invalidate the list and remove the specific staff member from cache
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.removeQueries({ queryKey: staffKeys.detail(id) });
    }
  });
};

// Add education history to a staff member
export const useAddEducation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, education }: { staffId: string; education: EducationHistory }) => 
      staffApi.addEducation(staffId, education),
    onSuccess: (_, { staffId }) => {
      // Invalidate just this staff member's details
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    }
  });
};

// Add work experience to a staff member
export const useAddExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, experience }: { staffId: string; experience: Experience }) => 
      staffApi.addExperience(staffId, experience),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    }
  });
};

// Add a document to a staff member
export const useAddDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, document }: { staffId: string; document: Document }) => 
      staffApi.addDocument(staffId, document),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    }
  });
};

// Update emergency contact for a staff member
export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, contact }: { staffId: string; contact: EmergencyContact }) => 
      staffApi.updateEmergencyContact(staffId, contact),
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    }
  });
};

// Update the status of a staff member
export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ staffId, status }: { staffId: string; status: EmploymentStatus }) => 
      staffApi.updateStatus(staffId, status),
    onSuccess: (_, { staffId }) => {
      // Status changes might affect both list views and detail view
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
    }
  });
};
