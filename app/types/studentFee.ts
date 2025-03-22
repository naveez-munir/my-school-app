// src/types/studentFee.ts

// --------------------
// Common Types
// --------------------

export type MongoId = string;

export interface BaseEntity {
  _id: MongoId;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --------------------
// Enums
// --------------------

export enum FeeFrequency {
  ONE_TIME = 'ONE_TIME',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export enum DiscountType {
  MERIT = 'MERIT',
  SIBLING = 'SIBLING',
  STAFF_WARD = 'STAFF_WARD',
  FINANCIAL_AID = 'FINANCIAL_AID',
  SCHOLARSHIP = 'SCHOLARSHIP',
  OTHER = 'OTHER'
}

export enum ValueType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

export enum PaymentMode {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE',
  OTHER = 'OTHER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum FeeStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum BillType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ONE_TIME = 'ONE_TIME'
}

// --------------------
// Fee Category
// --------------------

export interface FeeCategory extends BaseEntity {
  name: string;
  frequency: FeeFrequency;
  isRefundable: boolean;
  description?: string;
}

export interface CreateFeeCategoryInput {
  name: string;
  frequency: FeeFrequency;
  isRefundable?: boolean;
  description?: string;
}

export interface UpdateFeeCategoryInput {
  name?: string;
  frequency?: FeeFrequency;
  isRefundable?: boolean;
  description?: string;
}

export interface ListFeeCategoriesParams {
  isActive?: boolean;
  frequency?: FeeFrequency;
}

// --------------------
// Fee Structure
// --------------------

export interface FeeComponent {
  feeCategory: MongoId;
  amount: number;
  dueDay?: number;
  lateChargeType?: ValueType;
  lateChargeValue?: number;
  gracePeriod?: number;
  isOptional?: boolean;
  discountAllowed?: boolean;
}

export interface PopulatedFeeComponent extends Omit<FeeComponent, 'feeCategory'> {
  feeCategory: FeeCategory;
}

export interface FeeStructure extends BaseEntity {
  academicYear: string;
  classId: MongoId;
  feeComponents: FeeComponent[];
}

export interface PopulatedFeeStructure extends Omit<FeeStructure, 'classId' | 'feeComponents'> {
  classId: MongoId;
  className?: string;
  feeComponents: PopulatedFeeComponent[];
}

export interface CreateFeeStructureInput {
  academicYear: string;
  classId: MongoId;
  feeComponents: FeeComponent[];
}

export interface UpdateFeeStructureInput {
  academicYear?: string;
  classId?: MongoId;
  feeComponents?: FeeComponent[];
}

export interface BulkGenerateFeeStructureInput {
  academicYear: string;
  classIds: MongoId[];
  feeComponents: FeeComponent[];
}

export interface FeeComponentOverride {
  feeCategoryId: MongoId;
  newAmount: number;
  newDueDay?: number;
  newLateChargeType?: ValueType;
  newLateChargeValue?: number;
}

export interface CloneFeeStructureInput {
  newAcademicYear: string;
  newClassId?: MongoId;
  incrementPercentage?: number;
  componentOverrides?: FeeComponentOverride[];
  keepDiscounts?: boolean;
}

export interface ListFeeStructuresParams {
  academicYear?: string;
  classId?: MongoId;
  isActive?: boolean;
  sortByDueDate?: 'asc' | 'desc';
  includeComponents?: boolean;
  includeClass?: boolean;
  limit?: number;
  skip?: number;
}

// --------------------
// Student Fee
// --------------------

export interface FeeDetail {
  _id?: MongoId;
  feeCategory: MongoId;
  originalAmount: number;
  discountType?: DiscountType;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  lateCharges: number;
  dueAmount: number;
  discountId?: MongoId;
}

export interface PopulatedFeeDetail extends Omit<FeeDetail, 'feeCategory'> {
  feeCategory: FeeCategory;
}

export interface StudentFee extends BaseEntity {
  studentId: MongoId;
  feeStructureId: MongoId;
  academicYear: string;
  billType: BillType;
  billMonth?: number;
  quarter?: number;
  dueDate: string;
  status: FeeStatus;
  feeDetails: FeeDetail[];
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
  paidAmount: number;
  lateCharges: number;
  dueAmount: number;
  lastPaymentDate?: string;
  remarks?: string;
}

export interface PopulatedStudentFee extends Omit<StudentFee, 'studentId' | 'feeStructureId' | 'feeDetails'> {
  studentId: {
    _id: MongoId;
    firstName: string;
    lastName: string;
    rollNumber?: string;
    class?: MongoId | { _id: MongoId; className: string };
  };
  feeStructureId: FeeStructure;
  feeDetails: PopulatedFeeDetail[];
}

export interface GenerateStudentFeeInput {
  studentId: MongoId;
  feeStructureId: MongoId;
  academicYear: string;
  billType: BillType;
  billMonth?: number;
  quarter?: number;
}

export interface BulkGenerateStudentFeeInput {
  studentIds: MongoId[];
  feeStructureId: MongoId;
  academicYear: string;
  billType: BillType;
  billMonth?: number;
  quarter?: number;
}

export interface ApplyDiscountInput {
  feeCategoryId: MongoId;
  discountType: DiscountType;
  discountAmount: number;
}

export interface GetStudentFeesParams {
  academicYear?: string;
  status?: FeeStatus;
  billType?: BillType;
}

export interface GetPendingFeesParams {
  academicYear?: string;
  classId?: MongoId;
  month?: number;
}

export interface PendingFeesResult {
  fees: StudentFee[];
  summary: {
    totalPending: number;
    totalOverdue: number;
    count: number;
  };
}

// --------------------
// Student Discount
// --------------------

export interface StudentDiscount extends BaseEntity {
  studentId: MongoId;
  discountType: DiscountType;
  discountValueType: ValueType;
  discountValue: number;
  applicableCategories?: MongoId[];
  startDate: string;
  endDate?: string;
  remarks?: string;
}

export interface PopulatedStudentDiscount extends Omit<StudentDiscount, 'studentId' | 'applicableCategories'> {
  studentId: {
    _id: MongoId;
    firstName: string;
    lastName: string;
    rollNumber?: string;
  };
  applicableCategories?: FeeCategory[];
}

export interface CreateStudentDiscountInput {
  studentId: MongoId;
  discountType: DiscountType;
  discountValueType: ValueType;
  discountValue: number;
  applicableCategories?: MongoId[];
  startDate: string | Date;
  endDate?: string | Date;
  remarks?: string;
}

export interface UpdateStudentDiscountInput {
  studentId?: MongoId;
  discountType?: DiscountType;
  discountValueType?: ValueType;
  discountValue?: number;
  applicableCategories?: MongoId[];
  startDate?: string | Date;
  endDate?: string | Date;
  remarks?: string;
}

// --------------------
// Fee Payment
// --------------------

export interface FeePayment extends BaseEntity {
  studentFeeId: MongoId;
  studentId: MongoId;
  paymentDate: string;
  paymentMode: PaymentMode;
  amount: number;
  lateChargesPaid: number;
  transactionId?: string;
  chequeNumber?: string;
  bankDetails?: string;
  status: PaymentStatus;
  collectedBy?: MongoId;
  remarks?: string;
}

export interface PopulatedFeePayment extends Omit<FeePayment, 'studentId' | 'studentFeeId' | 'collectedBy'> {
  studentId: MongoId;
  student?: {
    _id: MongoId;
    firstName: string;
    lastName: string;
    rollNumber?: string;
    class?: MongoId | { _id: MongoId; className: string };
  };
  studentFeeId: MongoId;
  studentFee?: StudentFee;
  collectedBy?: MongoId;
  collectedByName?: string;
}

export interface CreateFeePaymentInput {
  studentFeeId: MongoId;
  studentId: MongoId;
  paymentMode: PaymentMode;
  amount: number;
  paymentDate?: string | Date;
  lateChargesPaid?: number;
  transactionId?: string;
  chequeNumber?: string;
  bankDetails?: string;
  collectedBy?: MongoId;
  remarks?: string;
}

export interface BulkFeePaymentInput {
  payments: CreateFeePaymentInput[];
}

export interface BulkFeePaymentResult {
  payments: PopulatedFeePayment[];
  summary: {
    successful: number;
    failed: number;
    errors?: Record<string, string>;
  };
}

export interface UpdateFeePaymentStatusInput {
  status: PaymentStatus;
  remarks?: string;
}

export interface FeePaymentFilterParams {
  studentId?: MongoId;
  classId?: MongoId;
  paymentMode?: PaymentMode;
  startDate?: string | Date;
  endDate?: string | Date;
  academicYear?: string;
}

export interface DailyPaymentsResult {
  payments: PopulatedFeePayment[];
  summary: {
    totalCollected: number;
    count: number;
    byPaymentMode: Record<string, number>;
  };
}

export interface DateRangePaymentsResult {
  payments: PopulatedFeePayment[];
  summary: {
    totalAmount: number;
    count: number;
    byPaymentMode: Record<string, number>;
    byClass?: Record<string, number>;
  };
}

export interface PaymentStatsResult {
  totalCollected: number;
  pendingAmount: number;
  overdueAmount: number;
  collectionRate: number;
  byMonth: Record<string, number>;
}

export interface ReceiptResult {
  receiptNumber: string;
  payment: PopulatedFeePayment;
  studentFee: StudentFee;
  student: {
    _id: MongoId;
    firstName: string;
    lastName: string;
    rollNumber?: string;
    [key: string]: any;
  };
}

// --------------------
// Utility Functions
// --------------------

/**
 * Removes undefined, null, and empty string values from an object
 * Use this when sending data to the API to avoid sending optional fields that aren't set
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => 
      value !== undefined && 
      value !== null && 
      value !== ''
    )
  ) as Partial<T>;
}

/**
 * Picks only the specified keys from an object
 * Use this to create input objects with only the fields required by the API
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Omits the specified keys from an object
 * Use this to remove fields that shouldn't be sent to the API
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Formats a date to YYYY-MM-DD format for API requests
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

/**
 * Formats a date with time for API requests that need the full timestamp
 */
export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
}

/**
 * Creates a proper input object for API requests from a full entity object
 * Removes _id, createdAt, updatedAt, and other non-input fields
 */
export function createInputFromEntity<T extends Record<string, any>>(
  entity: T, 
  excludeFields: string[] = ['_id', 'createdAt', 'updatedAt', 'isActive']
): Partial<T> {
  const result = { ...entity };
  excludeFields.forEach(field => {
    delete result[field];
  });
  return cleanObject(result);
}

/**
 * Prepares query parameters for API requests by cleaning the object
 * and formatting dates properly
 */
export function prepareQueryParams<T extends Record<string, any>>(params: T): Record<string, string> {
  const cleaned = cleanObject(params);
  
  return Object.entries(cleaned).reduce((result, [key, value]) => {
    if (value instanceof Date) {
      result[key] = formatDate(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = JSON.stringify(value);
    } else {
      result[key] = String(value);
    }
    return result;
  }, {} as Record<string, string>);
}

/**
 * Formats a fee amount as currency
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Gets a display name for a fee status (for UI purposes)
 */
export function getFeeStatusDisplayName(status: FeeStatus): string {
  const displayNames = {
    [FeeStatus.PENDING]: 'Pending',
    [FeeStatus.PARTIAL]: 'Partially Paid',
    [FeeStatus.PAID]: 'Paid',
    [FeeStatus.OVERDUE]: 'Overdue',
    [FeeStatus.CANCELLED]: 'Cancelled'
  };
  
  return displayNames[status] || status;
}

/**
 * Gets a CSS class name for a fee status (for UI styling)
 */
export function getFeeStatusClassName(status: FeeStatus): string {
  const classNames = {
    [FeeStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [FeeStatus.PARTIAL]: 'bg-blue-100 text-blue-800',
    [FeeStatus.PAID]: 'bg-green-100 text-green-800',
    [FeeStatus.OVERDUE]: 'bg-red-100 text-red-800',
    [FeeStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
  };
  
  return classNames[status] || '';
}

/**
 * Gets a display name for a payment mode (for UI purposes)
 */
export function getPaymentModeDisplayName(mode: PaymentMode): string {
  const displayNames = {
    [PaymentMode.CASH]: 'Cash',
    [PaymentMode.CHEQUE]: 'Cheque',
    [PaymentMode.BANK_TRANSFER]: 'Bank Transfer',
    [PaymentMode.ONLINE]: 'Online Payment',
    [PaymentMode.OTHER]: 'Other'
  };
  
  return displayNames[mode] || mode;
}

/**
 * Gets a month name from a month number (1-12)
 */
export function getMonthName(monthNumber: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return months[monthNumber - 1] || '';
}

/**
 * Converts an array of items to a Record/dictionary using a key function
 */
export function arrayToRecord<T, K extends string | number | symbol>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T> {
  return items.reduce((acc, item) => {
    acc[keyFn(item)] = item;
    return acc;
  }, {} as Record<K, T>);
}
