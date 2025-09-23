// Define enum types for payment system
export enum PaymentType {
  STUDENT_FEE = 'STUDENT_FEE',
  SALARY = 'SALARY',
  EXPENSE = 'EXPENSE',
  OTHER_INCOME = 'OTHER_INCOME'
}

export enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentFor {
  STUDENT_FEE = 'StudentFee',
  SALARY = 'Salary',
  EXPENSE = 'Expense'
}

export enum ReceivedByType {
  TEACHER = 'Teacher',
  STAFF = 'Staff'
}

// Base interface for Payment
export interface Payment {
  id?: string;
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  referenceId: string;
  paymentFor: PaymentFor;
  referenceDetails?: any;
  amount: number;
  chequeNumber?: string;
  bankDetails?: string;
  transactionId?: string;
  paymentDate: Date | string;
  remarks?: string;
  receivedBy?: string;
  receivedByType?: ReceivedByType;
  receivedByName?: string;
  status: PaymentStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  isActive?: boolean;
}

// DTOs for API requests
export interface CreatePaymentDto {
  paymentType: PaymentType;
  paymentMode: PaymentMode;
  referenceId: string;
  paymentFor: PaymentFor;
  amount: number;
  chequeNumber?: string;
  bankDetails?: string;
  transactionId?: string;
  paymentDate: Date | string;
  remarks?: string;
  receivedBy?: string;
  receivedByType?: ReceivedByType;
  status?: PaymentStatus;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {
  status?: PaymentStatus;
}

export interface CreateReferencePaymentDto {
  paymentMode: PaymentMode;
  remarks?: string;
  receivedBy?: string;
  receivedByType?: ReceivedByType;
}

export interface SearchPaymentParams {
  paymentType?: PaymentType;
  paymentMode?: PaymentMode;
  referenceId?: string;
  paymentFor?: PaymentFor;
  status?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
  minAmount?: string;
  maxAmount?: string;
  transactionId?: string;
  receivedBy?: string;
}

export interface PaymentSummary {
  income: {
    total: number;
    byType: Record<string, number>;
    byMonth?: Record<string, number>;
  };
  expense: {
    total: number;
    byType: Record<string, number>;
    byMonth?: Record<string, number>;
  };
  net: number;
}

// Helper constants for display
export const PaymentTypeLabels: Record<PaymentType, string> = {
  [PaymentType.STUDENT_FEE]: 'Student Fee',
  [PaymentType.SALARY]: 'Salary',
  [PaymentType.EXPENSE]: 'Expense',
  [PaymentType.OTHER_INCOME]: 'Other Income'
};

export const PaymentModeLabels: Record<PaymentMode, string> = {
  [PaymentMode.CASH]: 'Cash',
  [PaymentMode.CHEQUE]: 'Cheque',
  [PaymentMode.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMode.ONLINE]: 'Online Payment'
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.COMPLETED]: 'Completed',
  [PaymentStatus.FAILED]: 'Failed',
  [PaymentStatus.REFUNDED]: 'Refunded'
};

export const PaymentForLabels: Record<PaymentFor, string> = {
  [PaymentFor.STUDENT_FEE]: 'Student Fee',
  [PaymentFor.SALARY]: 'Salary',
  [PaymentFor.EXPENSE]: 'Expense'
};

export const ReceivedByTypeLabels: Record<ReceivedByType, string> = {
  [ReceivedByType.TEACHER]: 'Teacher',
  [ReceivedByType.STAFF]: 'Staff'
};
