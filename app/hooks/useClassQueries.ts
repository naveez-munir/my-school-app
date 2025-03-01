import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { classApi } from '~/services/classApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  ClassResponse, 
  Class,
  CreateClassDto, 
  UpdateClassDto
} from '~/types/class';

// Create base CRUD hooks for list operations
const baseClassHooks = createQueryHooks<ClassResponse, CreateClassDto, UpdateClassDto>(
  'classes', 
  classApi
);

// Add specialized hooks
export const useAssignTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, teacherId }: { classId: string; teacherId: string }) => 
      classApi.assignTeacher(classId, teacherId),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.detail(updatedClass._id) });
    }
  });
};

export const useRemoveTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (classId: string) => classApi.removeTeacher(classId),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.detail(updatedClass._id) });
    }
  });
};

export const useAssignTempTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, teacherId }: { classId: string; teacherId: string }) => 
      classApi.assignTempTeacher(classId, teacherId),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.detail(updatedClass._id) });
    }
  });
};

export const useRemoveTempTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (classId: string) => classApi.removeTempTeacher(classId),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.detail(updatedClass._id) });
    }
  });
};

export const useAddSubjectsToClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, subjectIds }: { classId: string; subjectIds: string[] }) => 
      classApi.addSubjects(classId, subjectIds),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.detail(updatedClass._id) });
    }
  });
};

export const useRemoveSubjectsFromClass = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ classId, subjectIds }: { classId: string; subjectIds: string[] }) => 
      classApi.removeSubjects(classId, subjectIds),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.lists() });
      queryClient.invalidateQueries({ queryKey: baseClassHooks.keys.detail(updatedClass._id) });
    }
  });
};

export const useClassesByGradeLevel = (gradeLevel: string, sectionId?: string) => {
  return useQuery({
    queryKey: [...baseClassHooks.keys.lists(), 'gradeLevel', gradeLevel, sectionId],
    queryFn: () => classApi.getByGradeLevel(gradeLevel, sectionId),
    enabled: !!gradeLevel
  });
};

// Custom hook for getting detailed class information (returns Class instead of ClassResponse)
export const useClass = (id: string) => {
  return useQuery({
    queryKey: baseClassHooks.keys.detail(id),
    queryFn: () => classApi.getById(id) as Promise<Class>,
    enabled: !!id
  });
};

// Export the base hooks with renamed functions
export const {
  keys: classKeys,
  useEntities: useClasses,
  // Don't export the factory's useEntity since we have our custom one
  useCreateEntity: useCreateClass,
  useUpdateEntity: useUpdateClass,
  useDeleteEntity: useDeleteClass
} = baseClassHooks;
