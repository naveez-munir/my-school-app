import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi, baseStudentService } from '~/services/studentApi';
import { createQueryHooks } from './queryHookFactory';
import type {
  Student,
  StudentResponse,
  CreateStudentDto,
  UpdatePersonalInfoDto,
  UpdateAcademicInfoDto,
  UpdateGuardianInfoDto,
  UpdateStatusDto,
  AddDocumentDto,
  UpdateAttendanceDto,
  SearchStudentDto
} from '~/types/student';

const baseStudentHooks = createQueryHooks<StudentResponse, CreateStudentDto, Partial<Student>>(
  'students', 
  baseStudentService
);

export const useStudentsByClass = (gradeLevel: string, sectionId?: string) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'class', gradeLevel, sectionId],
    queryFn: () => studentApi.getByClass(gradeLevel, sectionId),
    enabled: !!gradeLevel
  });
};

export const useStudentsByGuardianCnic = (cnic: string) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'guardian', 'cnic', cnic],
    queryFn: () => studentApi.getByGuardianCnic(cnic),
    enabled: !!cnic
  });
};

export const useStudentsByGuardianId = (guardianId: string) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'guardian', 'id', guardianId],
    queryFn: () => studentApi.getByGuardianId(guardianId),
    enabled: !!guardianId
  });
};

// Custom hook for searching students
export const useSearchStudents = (params?: SearchStudentDto) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'search', params],
    queryFn: () => studentApi.getAll(params),
    enabled: !!params
  });
};

// Custom hook for getting detailed student information
export const useStudent = (id: string) => {
  return useQuery({
    queryKey: baseStudentHooks.keys.detail(id),
    queryFn: () => studentApi.getById(id),
    enabled: !!id
  });
};

// Specialized mutation hooks for different update operations
export const useUpdatePersonalInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonalInfoDto }) =>
      studentApi.updatePersonalInfo(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.all });
    }
  });
};

export const useUpdateAcademicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicInfoDto }) =>
      studentApi.updateAcademicInfo(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.all });
    }
  });
};

export const useUpdateGuardianInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGuardianInfoDto }) =>
      studentApi.updateGuardianInfo(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.all });
    }
  });
};

export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusDto }) =>
      studentApi.updateStatus(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.all });
    }
  });
};

export const useAddStudentDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddDocumentDto }) =>
      studentApi.addDocument(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.all });
    }
  });
};

export const useUpdateStudentAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceDto }) =>
      studentApi.updateAttendance(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: baseStudentHooks.keys.all });
    }
  });
};

export const {
  keys: studentKeys,
  useEntities: useStudents,
  useCreateEntity: useCreateStudent,
  useDeleteEntity: useDeleteStudent
} = baseStudentHooks;
