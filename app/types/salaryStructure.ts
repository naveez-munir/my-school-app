export enum EmployeeType {
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

export enum EmployeeCategory {
  TEACHING = 'TEACHING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SUPPORT = 'SUPPORT',
  MAINTENANCE = 'MAINTENANCE'
}

export enum AllowanceType {
  HRA = 'HRA',
  TRANSPORT = 'TRANSPORT',
  MEDICAL = 'MEDICAL',
  TEACHING_ALLOWANCE = 'TEACHING_ALLOWANCE',
  OVERTIME = 'OVERTIME',
  PERFORMANCE_BONUS = 'PERFORMANCE_BONUS',
  SPECIAL_DUTY = 'SPECIAL_DUTY',
  OTHER = 'OTHER'
}

export enum DeductionType {
  TAX = 'TAX',
  INSURANCE = 'INSURANCE',
  LOAN = 'LOAN',
  ADVANCE_SALARY = 'ADVANCE_SALARY',
  PROVIDENT_FUND = 'PROVIDENT_FUND',
  LEAVE_DEDUCTION = 'LEAVE_DEDUCTION',
  OTHER = 'OTHER'
}

export enum DayType {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY = 'HALF_DAY',
  OVERTIME = 'OVERTIME'
}

export interface BaseSalaryStructure {
  id?: string;
  employeeId: string;
  employeeType: EmployeeType;
  employeeCategory: EmployeeCategory;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  payRates: PayRate[];
  maxOvertimeHours: number;
  effectiveFrom: Date | string;
  effectiveTo?: Date | string;
  sickLeaveAllowance: number;
  casualLeaveAllowance: number;
  earnedLeaveAllowance: number;
  isActive: boolean;
}

export interface SalaryStructureResponse extends BaseSalaryStructure {
  employeeName?: string;
  employee?: {
    id: string;
    name: string;
    employeeId?: string;
    email?: string;
    phoneNumber?: string;
    position?: string;
    department?: string;
    joiningDate?: Date | string;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Allowance {
  id?: string;
  allowanceType: AllowanceType;
  amount: number;
  isFixed: boolean;
  percentage?: number;
  description?: string;
}

export interface Deduction {
  id?: string;
  deductionType: DeductionType;
  amount: number;
  isFixed: boolean;
  percentage?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
}

export interface PayRate {
  id?: string;
  dayType: DayType;
  rate: number;
}

export interface CreateSalaryStructureDto {
  employeeId: string;
  employeeType: EmployeeType;
  employeeCategory: EmployeeCategory;
  basicSalary: number;
  allowances?: Allowance[];
  deductions?: Deduction[];
  payRates?: PayRate[];
  maxOvertimeHours?: number;
  effectiveFrom: Date | string;
  effectiveTo?: Date | string;
  sickLeaveAllowance?: number;
  casualLeaveAllowance?: number;
  earnedLeaveAllowance?: number;
}

export interface UpdateSalaryStructureDto {
  employeeId?: string;
  employeeType?: EmployeeType;
  employeeCategory?: EmployeeCategory;
  basicSalary?: number;
  allowances?: Allowance[];
  deductions?: Deduction[];
  payRates?: PayRate[];
  maxOvertimeHours?: number;
  effectiveFrom?: Date | string;
  effectiveTo?: Date | string;
  sickLeaveAllowance?: number;
  casualLeaveAllowance?: number;
  earnedLeaveAllowance?: number;
}

export interface SearchSalaryStructureDto {
  employeeId?: string;
  employeeType?: EmployeeType;
  employeeCategory?: EmployeeCategory;
  isActive?: 'true' | 'false';
}

export const AllowanceTypeLabels: Record<string, string> = {
  [AllowanceType.HRA]: 'House Rent Allowance',
  [AllowanceType.TRANSPORT]: 'Transport Allowance',
  [AllowanceType.MEDICAL]: 'Medical Allowance',
  [AllowanceType.TEACHING_ALLOWANCE]: 'Teaching Allowance',
  [AllowanceType.OVERTIME]: 'Overtime',
  [AllowanceType.PERFORMANCE_BONUS]: 'Performance Bonus',
  [AllowanceType.SPECIAL_DUTY]: 'Special Duty',
  [AllowanceType.OTHER]: 'Other'
};

export const DeductionTypeLabels: Record<string, string> = {
  [DeductionType.TAX]: 'Tax',
  [DeductionType.INSURANCE]: 'Insurance',
  [DeductionType.LOAN]: 'Loan',
  [DeductionType.ADVANCE_SALARY]: 'Advance Salary',
  [DeductionType.PROVIDENT_FUND]: 'Provident Fund',
  [DeductionType.LEAVE_DEDUCTION]: 'Leave Deduction',
  [DeductionType.OTHER]: 'Other'
};

export const EmployeeCategoryLabels: Record<string, string> = {
  [EmployeeCategory.TEACHING]: 'Teaching',
  [EmployeeCategory.ADMINISTRATIVE]: 'Administrative',
  [EmployeeCategory.SUPPORT]: 'Support',
  [EmployeeCategory.MAINTENANCE]: 'Maintenance'
};

export const DayTypeLabels: Record<string, string> = {
  [DayType.FULL_DAY]: 'Full Day',
  [DayType.HALF_DAY]: 'Half Day',
  [DayType.OVERTIME]: 'Overtime'
};
