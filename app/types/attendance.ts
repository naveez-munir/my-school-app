
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late'
}

export enum AttendanceType {
  STUDENT = 'Student',
  TEACHER = 'Teacher'
}

export interface User {
  id: string;
  name: string;
  rollNumber?: string;
  employeeId?: string;
  type: AttendanceType;
}

export interface Class {
  id: string;
  className: string;
  section: string;
}


export interface AttendanceRecord {
  id: string;
  user: User;
  class?: Class;
  date: string;
  status: AttendanceStatus;
  reason?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceListItem {
  id: string;
  user: User;
  class?: Class;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
}

export type AttendanceDetail = AttendanceRecord;

export interface CreateAttendanceInput {
  userType: AttendanceType;
  userId: string;
  date: string;
  status: AttendanceStatus;
  reason?: string;
  classId?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface UpdateAttendanceInput {
  userType?: AttendanceType;
  userId?: string;
  date?: string;
  status?: AttendanceStatus;
  reason?: string;
  classId?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface BatchAttendanceRecord {
  userId: string;
  status: AttendanceStatus;
  reason?: string;
}

export interface BatchAttendanceInput {
  userType: AttendanceType;
  classId: string;
  date: string;
  records: BatchAttendanceRecord[];
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  id: string;
}

export interface BatchResponse {
  success: boolean;
  message: string;
  count: number;
  ids: string[];
}


export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  presentPercentage?: number;
  attendancePercentage?: number;
  averageAttendance?: number;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface ClassAttendanceReport {
  summary: AttendanceSummary;
  class: Class;
  dateRange: DateRange;
  records: AttendanceRecord[];
}

export interface UserAttendanceReport {
  user: User;
  summary: AttendanceSummary;
  dateRange: DateRange;
  records: AttendanceRecord[];
}

export interface DailyReportItem {
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface MonthlyAttendanceReport {
  month: number;
  year: number;
  summary: AttendanceSummary;
  dailyReport: {
    [key: number]: DailyReportItem;
  };
  filter: {
    userType?: AttendanceType;
    class?: Class;
  };
}

export interface BaseAttendanceFilter {
  startDate?: string;
  endDate?: string;
}

export interface ClassAttendanceFilter extends BaseAttendanceFilter {
  status?: AttendanceStatus;
}

export interface UserAttendanceFilter extends BaseAttendanceFilter {
  userType?: AttendanceType;
}

export interface MonthlyReportFilter {
  month: number;
  year: number;
  userType?: AttendanceType;
  classId?: string;
}
