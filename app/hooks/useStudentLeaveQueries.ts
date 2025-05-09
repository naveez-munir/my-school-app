import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentLeaveApi } from '../services/studentLeaveApi';
import type {
  CreateStudentLeaveRequest,
  ApproveLeaveRequest,
  SearchStudentLeaveRequest
} from '../types/studentLeave';

export const studentLeaveKeys = {
  all: ['studentLeaves'] as const,
  lists: () => [...studentLeaveKeys.all, 'list'] as const,
  list: (filters: SearchStudentLeaveRequest) => [...studentLeaveKeys.lists(), filters] as const,
  details: () => [...studentLeaveKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentLeaveKeys.details(), id] as const,
  pending: () => [...studentLeaveKeys.all, 'pending'] as const,
  myStudents: () => [...studentLeaveKeys.all, 'myStudents'] as const,
  student: () => [...studentLeaveKeys.all, 'student'] as const,
  studentLeaves: (studentId: string) => [...studentLeaveKeys.student(), studentId] as const,
  myLeaves: () => [...studentLeaveKeys.all, 'myLeaves'] as const,
};

export const useStudentLeaves = (params?: SearchStudentLeaveRequest) => {
  return useQuery({
    queryKey: studentLeaveKeys.list(params || {}),
    queryFn: () => studentLeaveApi.getAll(params)
  });
};

export const useStudentLeave = (id: string) => {
  return useQuery({
    queryKey: studentLeaveKeys.detail(id),
    queryFn: () => studentLeaveApi.getById(id),
    enabled: !!id
  });
};


export const usePendingLeaves = () => {
  return useQuery({
    queryKey: studentLeaveKeys.pending(),
    queryFn: () => studentLeaveApi.getPendingLeaves()
  });
};

export const useMyStudentsLeaves = () => {
  return useQuery({
    queryKey: studentLeaveKeys.myStudents(),
    queryFn: () => studentLeaveApi.getMyStudentsLeaves()
  });
};

export const useStudentLeavesByStudent = (studentId: string) => {
  return useQuery({
    queryKey: studentLeaveKeys.studentLeaves(studentId),
    queryFn: () => studentLeaveApi.getLeavesByStudent(studentId),
    enabled: !!studentId
  });
};

export const useMyLeaves = (params?: SearchStudentLeaveRequest) => {
  return useQuery({
    queryKey: studentLeaveKeys.myLeaves(),
    queryFn: () => studentLeaveApi.getMyLeaves(params)
  });
};

export const useCreateStudentLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStudentLeaveRequest) => studentLeaveApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.myStudents() });
    }
  });
};

export const useApproveStudentLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveLeaveRequest }) => 
      studentLeaveApi.approveLeave(id, data),
    onSuccess: (updatedLeave) => {
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.pending() });
      
      if (updatedLeave._id) {
        queryClient.setQueryData(studentLeaveKeys.detail(updatedLeave._id), updatedLeave);
        if (updatedLeave.studentId) {
          queryClient.invalidateQueries({ 
            queryKey: studentLeaveKeys.studentLeaves(updatedLeave.studentId) 
          });
        }
      }
    }
  });
};

export const useCancelStudentLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => studentLeaveApi.cancelLeave(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.myStudents() });
      queryClient.removeQueries({ queryKey: studentLeaveKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentLeaveKeys.myLeaves() });
    }
  });
};
