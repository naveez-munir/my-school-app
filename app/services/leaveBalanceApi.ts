import api from './apiClient';

export interface LeaveBalance {
  id: string;
  employeeId: string;
  employeeType: 'Teacher' | 'Staff';
  employeeName?: string;
  year: number;

  sickLeaveAllocation: number;
  sickLeaveUsed: number;
  sickLeaveRemaining: number;

  casualLeaveAllocation: number;
  casualLeaveUsed: number;
  casualLeaveRemaining: number;

  earnedLeaveAllocation: number;
  earnedLeaveUsed: number;
  earnedLeaveRemaining: number;

  unpaidLeaveUsed: number;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeaveBalanceDto {
  employeeId: string;
  employeeType: 'Teacher' | 'Staff';
  year: number;
  sickLeaveAllocation: number;
  casualLeaveAllocation: number;
  earnedLeaveAllocation: number;
}

export interface UpdateLeaveBalanceDto {
  sickLeaveAllocation?: number;
  casualLeaveAllocation?: number;
  earnedLeaveAllocation?: number;
  sickLeaveUsed?: number;
  casualLeaveUsed?: number;
  earnedLeaveUsed?: number;
  unpaidLeaveUsed?: number;
}

export const leaveBalanceApi = {
  getLeaveBalance: async (
    employeeId: string,
    employeeType: 'Teacher' | 'Staff',
    year?: number
  ): Promise<LeaveBalance> => {
    const currentYear = year || new Date().getFullYear();
    const response = await api.get(
      `/leaves/balance/employee/${employeeId}?employeeType=${employeeType}&year=${currentYear}`
    );
    return response.data;
  },

  getMyLeaveBalance: async (year?: number): Promise<LeaveBalance> => {
    const currentYear = year || new Date().getFullYear();
    const response = await api.get(`/leaves/balance/my-balance?year=${currentYear}`);
    return response.data;
  },

  getLeaveBalanceById: async (id: string): Promise<LeaveBalance> => {
    const response = await api.get(`/leaves/balance/${id}`);
    return response.data;
  },

  createLeaveBalance: async (data: CreateLeaveBalanceDto): Promise<LeaveBalance> => {
    const response = await api.post('/leaves/balance', data);
    return response.data;
  },

  updateLeaveBalance: async (
    id: string,
    data: UpdateLeaveBalanceDto
  ): Promise<LeaveBalance> => {
    const response = await api.put(`/leaves/balance/${id}`, data);
    return response.data;
  },
};
