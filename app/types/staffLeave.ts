// Define enum types for leave management system
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum LeaveType {
  SICK = 'SICK',
  CASUAL = 'CASUAL',
  EARNED = 'EARNED',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  UNPAID = 'UNPAID',
  OTHER = 'OTHER'
}

export enum EmployeeType {
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

// Response DTOs
export interface LeaveResponse {
  id: string;
  employeeId: string;
  employeeType: EmployeeType;
  employeeName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason?: string;
  status: LeaveStatus;
  isPaid: boolean;
  isPaidOverridden?: boolean;
  overrideReason?: string;
  approvedBy?: string;
  approverName?: string;
  approvalDate?: string;
  comments?: string;
  isDeductionApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalanceResponse {
  id: string;
  employeeId: string;
  employeeType: EmployeeType;
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
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface CreateLeaveRequest {
  employeeId: string;
  employeeType: EmployeeType;
  leaveType: LeaveType;
  startDate: string; // ISO format date string
  endDate: string; // ISO format date string
  reason?: string;
}

export interface UpdateLeaveRequest {
  employeeId?: string;
  employeeType?: EmployeeType;
  leaveType?: LeaveType;
  startDate?: string;
  endDate?: string;
  reason?: string;
  status?: LeaveStatus;
  approvedBy?: string;
  approverType?: EmployeeType;
  approvalDate?: string;
  comments?: string;
  isPaid?: boolean;
  isDeductionApplied?: boolean;
}

export interface ApproveLeaveRequest {
  approvedBy: string;
  approverType: EmployeeType;
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;
  comments?: string;
  overridePaidStatus?: boolean;
  isPaid?: boolean;
  overrideReason?: string;
}

export interface CreateLeaveBalanceRequest {
  employeeId: string;
  employeeType: EmployeeType;
  year: number;
  sickLeaveAllocation: number;
  casualLeaveAllocation: number;
  earnedLeaveAllocation: number;
}

export interface UpdateLeaveBalanceRequest {
  employeeId?: string;
  employeeType?: EmployeeType;
  year?: number;
  sickLeaveAllocation?: number;
  casualLeaveAllocation?: number;
  earnedLeaveAllocation?: number;
  sickLeaveUsed?: number;
  casualLeaveUsed?: number;
  earnedLeaveUsed?: number;
  unpaidLeaveUsed?: number;
}

export interface SearchLeaveRequest {
  employeeId?: string;
  employeeType?: EmployeeType;
  leaveType?: LeaveType;
  status?: LeaveStatus;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  approvedBy?: string;
  isPaid?: string; // 'true' | 'false'
}
