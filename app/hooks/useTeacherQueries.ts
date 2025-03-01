import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { teacherApi } from '~/services/teacherApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  TeacherResponse, 
  Teacher,
  CreateTeacherDto, 
  UpdateTeacherDto,
  TeacherFilters,
  EducationHistory,
  Experience,
  Document,
  EmploymentStatus
} from '~/types/teacher';

const baseTeacherHooks = createQueryHooks<TeacherResponse, CreateTeacherDto, UpdateTeacherDto>(
  'teachers', 
  teacherApi
);

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: baseTeacherHooks.keys.detail(id),
    queryFn: () => teacherApi.getById(id) as Promise<Teacher>,
    enabled: !!id
  });
};


export const useAssignTeacherToClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teacherId, classId }: { teacherId: string; classId: string }) => 
      teacherApi.assignToClass(teacherId, classId),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.detail(updatedTeacher._id) });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
};

export const useAddEducationHistory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teacherId, education }: { teacherId: string; education: EducationHistory }) => 
      teacherApi.addEducation(teacherId, education),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.detail(updatedTeacher._id) });
    }
  });
};

export const useAddExperience = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teacherId, experience }: { teacherId: string; experience: Experience }) => 
      teacherApi.addExperience(teacherId, experience),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.detail(updatedTeacher._id) });
    }
  });
};

export const useAddDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teacherId, document }: { teacherId: string; document: Document }) => 
      teacherApi.uploadDocument(teacherId, document),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.detail(updatedTeacher._id) });
    }
  });
};

export const useUpdateTeacherStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teacherId, status }: { teacherId: string; status: EmploymentStatus }) => 
      teacherApi.updateStatus(teacherId, status),
    onSuccess: (updatedTeacher) => {
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseTeacherHooks.keys.detail(updatedTeacher._id) });
    }
  });
};

export const {
  keys: teacherKeys,
  useEntities: useTeachers,
  useCreateEntity: useCreateTeacher,
  useUpdateEntity: useUpdateTeacher,
  useDeleteEntity: useDeleteTeacher
} = baseTeacherHooks;


export const useFilteredTeachers = (filters: TeacherFilters) => {
  return useTeachers(filters);
};
