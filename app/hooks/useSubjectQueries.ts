import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { subjectApi } from '~/services/subjectApi';
import { createQueryHooks } from './queryHookFactory';
import type { 
  Subject,
  SubjectDto,
  CreateSubjectDto, 
  UpdateSubjectDto 
} from '~/types/subject';


const baseSubjectHooks = createQueryHooks<Subject, CreateSubjectDto, UpdateSubjectDto>(
  'subjects', 
  subjectApi
);

// Custom hook for getting detailed subject information
export const useSubject = (id: string) => {
  return useQuery({
    queryKey: baseSubjectHooks.keys.detail(id),
    queryFn: () => subjectApi.getById(id) as Promise<Subject>,
    enabled: !!id
  });
};

// Export the base hooks with renamed functions
export const {
  keys: subjectKeys,
  useEntities: useSubjects,
  useCreateEntity: useCreateSubject,
  useUpdateEntity: useUpdateSubject,
  useDeleteEntity: useDeleteSubject
} = baseSubjectHooks;
