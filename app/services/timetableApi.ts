import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  Period,
  CreatePeriodDto,
  UpdatePeriodDto,
  ClassSubjectAllocation,
  CreateAllocationDto,
  UpdateAllocationDto,
  Timetable,
  CreateTimetableDto,
  UpdateTimetableDto,
  TimetableSlot,
  UpdateTimetableStatusDto,
  ApproveTimetableDto,
  ConflictsResponse,
  TimetableQueryParams,
  AutoGenerateTimetableDto
} from '~/types/timetable';

// ============================================
// PERIOD SERVICE
// ============================================

export const basePeriodService = createEntityService<Period, CreatePeriodDto, UpdatePeriodDto>(
  api,
  '/timetable/periods'
);

export const periodApi = {
  ...basePeriodService,
  
  getAll: async (activeOnly?: boolean) => {
    const response = await api.get<Period[]>('/timetable/periods', {
      params: { activeOnly }
    });
    return response.data;
  },

  activate: async (id: string) => {
    const response = await api.put<Period>(`/timetable/periods/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await api.put<Period>(`/timetable/periods/${id}/deactivate`);
    return response.data;
  }
};

// ============================================
// CLASS SUBJECT ALLOCATION SERVICE
// ============================================

export const baseAllocationService = createEntityService<
  ClassSubjectAllocation, 
  CreateAllocationDto, 
  UpdateAllocationDto
>(api, '/timetable/allocations');

export const allocationApi = {
  ...baseAllocationService,

  getByClass: async (classId: string, academicYear?: string) => {
    const response = await api.get<ClassSubjectAllocation[]>(
      `/timetable/allocations/class/${classId}`,
      { params: { academicYear } }
    );
    return response.data;
  },

  getByTeacher: async (teacherId: string, academicYear?: string) => {
    const response = await api.get<ClassSubjectAllocation[]>(
      `/timetable/allocations/teacher/${teacherId}`,
      { params: { academicYear } }
    );
    return response.data;
  },

  getByAcademicYear: async (academicYear: string) => {
    const response = await api.get<ClassSubjectAllocation[]>(
      `/timetable/allocations/academic-year/${academicYear}`
    );
    return response.data;
  },

  activate: async (id: string) => {
    const response = await api.put<ClassSubjectAllocation>(
      `/timetable/allocations/${id}/activate`
    );
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await api.put<ClassSubjectAllocation>(
      `/timetable/allocations/${id}/deactivate`
    );
    return response.data;
  }
};

// ============================================
// TIMETABLE SERVICE
// ============================================

export const baseTimetableService = createEntityService<
  Timetable, 
  CreateTimetableDto, 
  UpdateTimetableDto
>(api, '/timetables');

export const timetableApi = {
  ...baseTimetableService,

  getAll: async (params?: TimetableQueryParams) => {
    const response = await api.get<{ data: Timetable[]; total: number; page: number; limit: number }>('/timetables', { params });
    return response.data.data;
  },

  getByClass: async (classId: string, academicYear?: string) => {
    const response = await api.get<Timetable>(
      `/timetables/class/${classId}`,
      { params: { academicYear } }
    );
    return response.data;
  },

  addSlot: async (id: string, slot: TimetableSlot) => {
    const response = await api.post<Timetable>(
      `/timetables/${id}/slots`,
      { slot }
    );
    return response.data;
  },

  updateSlot: async (id: string, slotIndex: number, slot: TimetableSlot) => {
    const response = await api.put<Timetable>(
      `/timetables/${id}/slots`,
      { slotIndex, slot }
    );
    return response.data;
  },

  removeSlot: async (id: string, slotIndex: number) => {
    const response = await api.delete<Timetable>(
      `/timetables/${id}/slots`,
      { data: { slotIndex } }
    );
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put<Timetable>(
      `/timetables/${id}/status`,
      { status }
    );
    return response.data;
  },

  approve: async (id: string, notes?: string) => {
    const response = await api.put<Timetable>(
      `/timetables/${id}/approve`,
      { notes }
    );
    return response.data;
  },

  getConflicts: async (id: string) => {
    const response = await api.get<ConflictsResponse>(
      `/timetables/${id}/conflicts`
    );
    return response.data;
  },

  autoGenerate: async (data: AutoGenerateTimetableDto) => {
    const response = await api.post<Timetable>(
      '/timetables/auto-generate',
      data
    );
    return response.data;
  }
};

