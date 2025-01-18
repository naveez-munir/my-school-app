import api from './apiClient';
import type {
  StudentSchedule,
  TeacherSchedule,
  ClassSchedule,
  GuardianSchedule,
  ScheduleQueryParams
} from '~/types/timetable';

// ============================================
// SCHEDULE QUERY SERVICE
// ============================================

export const scheduleApi = {
  getMySchedule: async (params?: ScheduleQueryParams) => {
    const response = await api.get<StudentSchedule | TeacherSchedule | GuardianSchedule>(
      '/timetable/schedules/my-schedule',
      { params }
    );
    return response.data;
  },

  getStudentSchedule: async (studentId: string, params?: ScheduleQueryParams) => {
    const response = await api.get<StudentSchedule>(
      `/timetable/schedules/student/${studentId}`,
      { params }
    );
    return response.data;
  },

  getTeacherSchedule: async (teacherId: string, params?: ScheduleQueryParams) => {
    const response = await api.get<TeacherSchedule>(
      `/timetable/schedules/teacher/${teacherId}`,
      { params }
    );
    return response.data;
  },

  getClassSchedule: async (classId: string, params?: ScheduleQueryParams) => {
    const response = await api.get<ClassSchedule>(
      `/timetable/schedules/class/${classId}`,
      { params }
    );
    return response.data;
  }
};

