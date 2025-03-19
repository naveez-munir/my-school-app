import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  SearchExpenseParams,
  ApproveExpenseDto,
  ProcessExpensePaymentDto,
  ExpenseSummary
} from '../types/expense.types';

// Prepare query params for API requests
export const prepareQueryParams = (params: SearchExpenseParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.expenseType) queryParams.expenseType = params.expenseType;
  if (params.status) queryParams.status = params.status;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  if (params.approvedBy) queryParams.approvedBy = params.approvedBy;
  if (params.createdBy) queryParams.createdBy = params.createdBy;
  if (params.minAmount !== undefined) queryParams.minAmount = params.minAmount.toString();
  if (params.maxAmount !== undefined) queryParams.maxAmount = params.maxAmount.toString();
  if (params.vendorDetails) queryParams.vendorDetails = params.vendorDetails;
  if (params.billNumber) queryParams.billNumber = params.billNumber;
  
  return queryParams;
};

// Create the base service with standard CRUD operations
const baseExpenseService = createEntityService<
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto
>(api, '/expenses');

export const expenseApi = {
  // Include all base CRUD operations
  ...baseExpenseService,
  
  // Override getAll to handle params properly
  getAll: async (params?: SearchExpenseParams): Promise<Expense[]> => {
    const response = await api.get<Expense[]>(
      '/expenses',
      { params: params ? prepareQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // Get expense summary by year or month
  getSummary: async (year: number, month?: number): Promise<ExpenseSummary> => {
    const params: Record<string, string> = { year: year.toString() };
    if (month !== undefined) {
      params.month = month.toString();
    }
    
    const response = await api.get<ExpenseSummary>('/expenses/summary', { params });
    return response.data;
  },
  
  // Approve or reject an expense
  approveExpense: async (id: string, data: ApproveExpenseDto): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}/approve`, data);
    return response.data;
  },
  
  // Process payment for an expense
  processPayment: async (id: string, data: ProcessExpensePaymentDto): Promise<Expense> => {
    const response = await api.put<Expense>(`/expenses/${id}/payment`, data);
    return response.data;
  }
};

export default expenseApi;
