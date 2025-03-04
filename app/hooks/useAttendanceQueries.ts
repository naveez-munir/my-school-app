import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { attendanceApi } from '~/services/attendanceApi';
import { createQueryHooks } from './queryHookFactory';

import type {
  AttendanceRecord,
  AttendanceResponse,
  CreateAttendanceInput,
  UpdateAttendanceInput,
  BatchAttendanceInput,
  BatchResponse,
  ClassAttendanceFilter,
  UserAttendanceFilter,
  MonthlyReportFilter,
  ClassAttendanceReport,
  UserAttendanceReport,
  MonthlyAttendanceReport
} from '~/types/attendance'; // Update path as needed

// Create base CRUD hooks for attendance operations
const baseAttendanceHooks = createQueryHooks<AttendanceRecord, CreateAttendanceInput, UpdateAttendanceInput>(
  'attendance',
  attendanceApi
);

// Modified version of useAttendanceRecords to accept filter parameters
export const useAttendanceRecords = (params?: any) => {
  return useQuery({
    queryKey: [...baseAttendanceHooks.keys.lists(), params],
    queryFn: () => attendanceApi.getAll(params),
  });
};

// Specialized hook for batch attendance creation
export const useCreateBatchAttendance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: BatchAttendanceInput) => attendanceApi.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseAttendanceHooks.keys.lists() });
    }
  });
};

// Class Attendance Report Hook
export const useClassAttendanceReport = (
  classId: string, 
  filter?: ClassAttendanceFilter,
  options?: any
) => {
  return useQuery({
    queryKey: [...baseAttendanceHooks.keys.all, 'class-report', classId, filter],
    queryFn: () => attendanceApi.getClassReport(classId, filter),
    enabled: !!classId,
    ...options
  });
};

// User Attendance Report Hook
export const useUserAttendanceReport = (
  userId: string, 
  filter?: UserAttendanceFilter,
  options?: any
) => {
  return useQuery({
    queryKey: [...baseAttendanceHooks.keys.all, 'user-report', userId, filter],
    queryFn: () => attendanceApi.getUserReport(userId, filter),
    enabled: !!userId,
    ...options
  });
};

// Monthly Attendance Report Hook
export const useMonthlyAttendanceReport = (
  filter: MonthlyReportFilter,
  options?: any
) => {
  return useQuery({
    queryKey: [...baseAttendanceHooks.keys.all, 'monthly-report', filter],
    queryFn: () => attendanceApi.getMonthlyReport(filter),
    enabled: !!filter.month && !!filter.year,
    ...options
  });
};

// Export the remaining base hooks
export const {
  keys: attendanceKeys,
  useEntity: useAttendanceRecord,
  useCreateEntity: useCreateAttendance,
  useUpdateEntity: useUpdateAttendance,
  useDeleteEntity: useDeleteAttendance
} = baseAttendanceHooks;
