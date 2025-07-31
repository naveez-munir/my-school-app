export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum LeaveType {
  MEDICAL = 'MEDICAL',
  FAMILY_EMERGENCY = 'FAMILY_EMERGENCY',
  PLANNED_ABSENCE = 'PLANNED_ABSENCE',
  OTHER = 'OTHER'
}

export enum ApproverType {
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

export interface StudentLeaveResponse {
  id: string;
  _id?: string;
  studentId: string;
  studentName?: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason?: string;
  supportingDocumentUrl?: string;
  status: LeaveStatus;
  requestedByParent: string;
  approvedBy?: string;
  approverName?: string;
  approverType?: ApproverType;
  approvalDate?: string;
  comments?: string;
  affectedClasses?: string[];
  isSyncedWithAttendance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentLeaveRequest {
  studentId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  supportingDocumentUrl?: string;
  affectedClasses?: string[];
}

export interface ApproveLeaveRequest {
  status: LeaveStatus.APPROVED | LeaveStatus.REJECTED;
  comments?: string;
}

export interface SearchStudentLeaveRequest {
  studentId?: string;
  status?: LeaveStatus;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}
