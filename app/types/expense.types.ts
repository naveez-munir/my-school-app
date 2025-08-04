// Define enum types for better type safety
export enum ExpenseType {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  UTILITIES = 'UTILITIES',
  SUPPLIES = 'SUPPLIES',
  MAINTENANCE = 'MAINTENANCE',
  EVENT = 'EVENT',
  OTHER = 'OTHER'
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export enum EmployeeType {
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

export enum PaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE'
}

// Base interface for Expense
export interface Expense {
  id?: string;
  expenseType: ExpenseType;
  amount: number;
  expenseDate: Date | string;
  description: string;
  billNumber?: string;
  vendorDetails?: string;
  status: ExpenseStatus;
  approvedBy?: string;
  approverType?: EmployeeType;
  approverName?: string;
  approvalDate?: Date | string;
  paymentDate?: Date | string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  remarks?: string;
  createdBy?: string;
  createdByName?: string;
  updatedBy?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isActive?: boolean;
}

// DTOs for API requests
export interface CreateExpenseDto {
  expenseType: ExpenseType;
  amount: number;
  expenseDate: Date | string;
  description: string;
  billNumber?: string;
  vendorDetails?: string;
  remarks?: string;
  status?: ExpenseStatus;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> {
  approvedBy?: string;
}

export interface ApproveExpenseDto {
  status: ExpenseStatus.APPROVED | ExpenseStatus.REJECTED;
  comments?: string;
}

export interface ProcessExpensePaymentDto {
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentReference?: string;
  remarks?: string;
}

export interface SearchExpenseParams {
  expenseType?: ExpenseType;
  status?: ExpenseStatus;
  fromDate?: string;
  toDate?: string;
  approvedBy?: string;
  createdBy?: string;
  minAmount?: number;
  maxAmount?: number;
  vendorDetails?: string;
  billNumber?: string;
}

export interface ExpenseSummary {
  total: number;
  byType: Record<ExpenseType, number>;
  byMonth?: Record<string, number>;
}

// Helper constants for display
export const ExpenseTypeLabels: Record<ExpenseType, string> = {
  [ExpenseType.INFRASTRUCTURE]: 'Infrastructure',
  [ExpenseType.UTILITIES]: 'Utilities',
  [ExpenseType.SUPPLIES]: 'Supplies',
  [ExpenseType.MAINTENANCE]: 'Maintenance',
  [ExpenseType.EVENT]: 'Event',
  [ExpenseType.OTHER]: 'Other'
};

export const ExpenseStatusLabels: Record<ExpenseStatus, string> = {
  [ExpenseStatus.PENDING]: 'Pending',
  [ExpenseStatus.APPROVED]: 'Approved',
  [ExpenseStatus.PAID]: 'Paid',
  [ExpenseStatus.REJECTED]: 'Rejected'
};

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.CHEQUE]: 'Cheque',
  [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMethod.ONLINE]: 'Online Payment'
};

export const EmployeeTypeLabels: Record<EmployeeType, string> = {
  [EmployeeType.TEACHER]: 'Teacher',
  [EmployeeType.STAFF]: 'Staff'
};
