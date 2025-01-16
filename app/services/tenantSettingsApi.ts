import api from './apiClient';

export interface LeaveSettings {
  sickLeaveAllowance: number;
  casualLeaveAllowance: number;
  earnedLeaveAllowance: number;
  maxConsecutiveLeaves: number;
  requireApproval: boolean;
  approvalWorkflow: string;
  allowLeaveEncashment: boolean;
  notificationRecipients: string[];
}

export interface Holiday {
  name: string;
  date: string;
}

export interface LeavePolicy {
  teacherLeaveSettings: LeaveSettings;
  staffLeaveSettings: LeaveSettings;
  leaveYearStart?: { month: number; day: number };
  leaveYearEnd?: { month: number; day: number };
  holidayList?: Holiday[];
  weeklyOffDays?: number[];
  allowCarryForward?: boolean;
  maxCarryForwardDays?: number;
}

export interface GradeLevel {
  code: string;
  label: string;
  order: number;
  isActive?: boolean;
}

export interface CreateGradeLevelDto {
  code: string;
  label: string;
  order: number;
}

export interface UpdateGradeLevelDto {
  label?: string;
  order?: number;
  isActive?: boolean;
}

export const tenantSettingsApi = {
  getLeavePolicy: async (): Promise<LeavePolicy> => {
    const response = await api.get('/tenant-config/leave-policy');
    return response.data;
  },

  updateLeavePolicy: async (policy: LeavePolicy): Promise<{ message: string; leavePolicy: LeavePolicy }> => {
    const response = await api.put('/tenant-config/leave-policy', policy);
    return response.data;
  },

  getGradeLevels: async (): Promise<GradeLevel[]> => {
    const response = await api.get('/tenant-config/grade-levels');
    return response.data;
  },

  addGradeLevel: async (dto: CreateGradeLevelDto): Promise<GradeLevel> => {
    const response = await api.post('/tenant-config/grade-levels', dto);
    return response.data;
  },

  updateGradeLevel: async (code: string, dto: UpdateGradeLevelDto): Promise<GradeLevel> => {
    const response = await api.put(`/tenant-config/grade-levels/${code}`, dto);
    return response.data;
  },

  deleteGradeLevel: async (code: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tenant-config/grade-levels/${code}`);
    return response.data;
  },

  reorderGradeLevels: async (gradeLevels: GradeLevel[]): Promise<GradeLevel[]> => {
    const response = await api.put('/tenant-config/grade-levels-reorder', { gradeLevels });
    return response.data;
  },
};
