import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '~/services/timetableScheduleApi';
import type { 
  StudentSchedule,
  TeacherSchedule,
  ClassSchedule,
  ScheduleQueryParams
} from '~/types/timetable';

const scheduleKeys = {
  all: ['schedules'] as const,
  mySchedule: (params?: ScheduleQueryParams) => [...scheduleKeys.all, 'my', params] as const,
  student: (studentId: string, params?: ScheduleQueryParams) => 
    [...scheduleKeys.all, 'student', studentId, params] as const,
  teacher: (teacherId: string, params?: ScheduleQueryParams) => 
    [...scheduleKeys.all, 'teacher', teacherId, params] as const,
  class: (classId: string, params?: ScheduleQueryParams) => 
    [...scheduleKeys.all, 'class', classId, params] as const,
};

export const useMySchedule = (params?: ScheduleQueryParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: scheduleKeys.mySchedule(params),
    queryFn: () => scheduleApi.getMySchedule(params),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000
  });
};

export const useStudentSchedule = (studentId: string, params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: scheduleKeys.student(studentId, params),
    queryFn: () => scheduleApi.getStudentSchedule(studentId, params),
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000
  });
};

export const useTeacherSchedule = (teacherId: string, params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: scheduleKeys.teacher(teacherId, params),
    queryFn: () => scheduleApi.getTeacherSchedule(teacherId, params),
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000
  });
};

export const useClassSchedule = (classId: string, params?: ScheduleQueryParams) => {
  return useQuery({
    queryKey: scheduleKeys.class(classId, params),
    queryFn: () => scheduleApi.getClassSchedule(classId, params),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000
  });
};

