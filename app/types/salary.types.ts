// Define enum types for better type safety
export enum EmployeeType {
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

export enum SalaryStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export enum AttendanceType {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY = 'HALF_DAY',
  OVERTIME = 'OVERTIME'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE'
}

// Base interfaces for allowances, deductions, and attendance
export interface SalaryAllowance {
  allowanceType: string;
  amount: number;
  calculatedAmount: number;
  remarks?: string;
}

export interface SalaryDeduction {
  deductionType: string;
  amount: number;
  calculatedAmount: number;
  remarks?: string;
}

export interface AttendanceBreakdown {
  date: Date | string;
  type: AttendanceType;
  hours?: number;
  amount: number;
  remarks?: string;
}

// Base interface for Salary
export interface Salary {
  id?: string;
  employeeId: string;
  employeeType: EmployeeType;
  salaryStructureId: string;
  month: number;
  year: number;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  overtimeHours: number;
  basicSalary: number;
  allowances: SalaryAllowance[];
  deductions: SalaryDeduction[];
  attendanceBreakdown: AttendanceBreakdown[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: SalaryStatus;
  approvedBy?: string;
  approvalDate?: Date | string;
  paymentDate?: Date | string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  remarks?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Extended interface with employee information for display
export interface SalaryResponse extends Salary {
  employeeName?: string;
  approverName?: string;
}

// DTOs for API requests
export interface CreateSalaryDto {
  employeeId: string;
  employeeType: EmployeeType;
  salaryStructureId: string;
  month: number;
  year: number;
  workingDays?: number;
  presentDays?: number;
  leaveDays?: number;
  overtimeHours?: number;
  allowances?: Omit<SalaryAllowance, 'calculatedAmount'>[];
  deductions?: Omit<SalaryDeduction, 'calculatedAmount'>[];
  attendanceBreakdown?: AttendanceBreakdown[];
  grossSalary?: number;
  totalDeductions?: number;
  netSalary?: number;
  status?: SalaryStatus;
  remarks?: string;
}

export interface UpdateSalaryDto extends Partial<CreateSalaryDto> {
  approvedBy?: string;
  approvalDate?: Date | string;
  paymentDate?: Date | string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
}

export interface SearchSalaryParams {
  employeeId?: string;
  employeeType?: EmployeeType;
  month?: number;
  year?: number;
  status?: SalaryStatus;
  fromDate?: string;
  toDate?: string;
  approvedBy?: string;
}

export interface ApproveSalaryDto {
  approvedBy: string;
  comments?: string;
}

export interface ProcessPaymentDto {
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentReference?: string;
  remarks?: string;
}

// Helper for handling API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Monthly salary summary for reports
export interface MonthlySalarySummary {
  month: number;
  year: number;
  totalSalaries: number;
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  status: {
    pending: number;
    processed: number;
    approved: number;
    paid: number;
    cancelled: number;
  };
}

// Helper constants for display
export const SalaryStatusLabels: Record<SalaryStatus, string> = {
  [SalaryStatus.PENDING]: 'Pending',
  [SalaryStatus.PROCESSED]: 'Processed',
  [SalaryStatus.APPROVED]: 'Approved',
  [SalaryStatus.PAID]: 'Paid',
  [SalaryStatus.CANCELLED]: 'Cancelled'
};

export const AttendanceTypeLabels: Record<AttendanceType, string> = {
  [AttendanceType.FULL_DAY]: 'Full Day',
  [AttendanceType.HALF_DAY]: 'Half Day',
  [AttendanceType.OVERTIME]: 'Overtime'
};

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CHEQUE]: 'Cheque',
  [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethod.ONLINE]: 'Online Payment'
};
