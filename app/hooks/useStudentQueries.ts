import { useQuery } from '@tanstack/react-query';
import { studentApi } from '~/services/studentApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  Student, 
  StudentResponse, 
  CreateStudentDto, 
  UpdateStudentDto,
  SearchStudentDto
} from '~/types/student';

// Create base CRUD hooks for student operations
const baseStudentHooks = createQueryHooks<StudentResponse, CreateStudentDto, UpdateStudentDto>(
  'students', 
  studentApi
);

// Add specialized hooks
export const useStudentsByClass = (classId: string) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'class', classId],
    queryFn: () => studentApi.getByClass(classId),
    enabled: !!classId
  });
};

export const useStudentsByGradeLevel = (gradeLevel: string) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'gradeLevel', gradeLevel],
    queryFn: () => studentApi.getByGradeLevel(gradeLevel),
    enabled: !!gradeLevel
  });
};

// Custom hook for searching students
export const useSearchStudents = (params?: SearchStudentDto) => {
  return useQuery({
    queryKey: [...baseStudentHooks.keys.lists(), 'search', params],
    queryFn: () => studentApi.getAll(params),
    enabled: !!params // Only run the query if search params are provided
  });
};

// Custom hook for getting detailed student information
export const useStudent = (id: string) => {
  return useQuery({
    queryKey: baseStudentHooks.keys.detail(id),
    queryFn: () => studentApi.getById(id) as Promise<Student>,
    enabled: !!id
  });
};

// Export the base hooks with renamed functions for better readability
export const {
  keys: studentKeys,
  useEntities: useStudents,
  // Don't export the factory's useEntity since we have our custom one
  useCreateEntity: useCreateStudent,
  useUpdateEntity: useUpdateStudent,
  useDeleteEntity: useDeleteStudent
} = baseStudentHooks;
