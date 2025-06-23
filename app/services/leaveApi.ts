import api from './apiClient';
import { createEntityService } from './apiServiceBuilder';
import type {
  LeaveResponse,
  LeaveBalanceResponse,
  CreateLeaveRequest,
  UpdateLeaveRequest,
  ApproveLeaveRequest,
  CreateLeaveBalanceRequest,
  UpdateLeaveBalanceRequest,
  SearchLeaveRequest
} from '../types/staffLeave';

// Prepare query params for API requests
export const prepareLeaveQueryParams = (params: SearchLeaveRequest): Record<string, string> => {
  const queryParams: Record<string, string> = {};
  
  if (params.employeeId) queryParams.employeeId = params.employeeId;
  if (params.employeeType) queryParams.employeeType = params.employeeType;
  if (params.leaveType) queryParams.leaveType = params.leaveType;
  if (params.status) queryParams.status = params.status;
  if (params.startDateFrom) queryParams.startDateFrom = params.startDateFrom;
  if (params.startDateTo) queryParams.startDateTo = params.startDateTo;
  if (params.endDateFrom) queryParams.endDateFrom = params.endDateFrom;
  if (params.endDateTo) queryParams.endDateTo = params.endDateTo;
  if (params.approvedBy) queryParams.approvedBy = params.approvedBy;
  if (params.isPaid) queryParams.isPaid = params.isPaid;
  
  return queryParams;
};

// Create the base service with standard CRUD operations
const baseLeaveService = createEntityService<
  LeaveResponse,
  CreateLeaveRequest,
  UpdateLeaveRequest
>(api, '/leaves');

export const leaveApi = {
  // Include all base CRUD operations
  ...baseLeaveService,
  
  // Override getAll to handle params properly
  getAll: async (params?: SearchLeaveRequest): Promise<LeaveResponse[]> => {
    const response = await api.get<LeaveResponse[]>(
      '/leaves',
      { params: params ? prepareLeaveQueryParams(params) : undefined }
    );
    return response.data;
  },
  
  // Get leaves by employee
  getByEmployee: async (employeeId: string, employeeType: string): Promise<LeaveResponse[]> => {
    const response = await api.get<LeaveResponse[]>(`/leaves/employee/${employeeId}`, {
      params: { employeeType }
    });
    return response.data;
  },
  
  // Approve or reject leave
  approveLeave: async (id: string, data: ApproveLeaveRequest): Promise<LeaveResponse> => {
    const response = await api.put<LeaveResponse>(`/leaves/${id}/approve`, data);
    return response.data;
  },
  
  // Cancel leave
  cancelLeave: async (id: string): Promise<void> => {
    await api.delete(`/leaves/${id}`);
  },
  
  // Create leave balance
  createLeaveBalance: async (data: CreateLeaveBalanceRequest): Promise<LeaveBalanceResponse> => {
    const response = await api.post<LeaveBalanceResponse>('/leaves/balance', data);
    return response.data;
  },
  
  // Get leave balance by employee and year
  getLeaveBalance: async (
    employeeId: string, 
    employeeType: string, 
    year?: number
  ): Promise<LeaveBalanceResponse> => {
    const params: Record<string, string> = { employeeType };
    if (year) {
      params.year = year.toString();
    }
    
    const response = await api.get<LeaveBalanceResponse>(
      `/leaves/balance/employee/${employeeId}`,
      { params }
    );
    return response.data;
  },
  
  // Get leave balance by ID
  getLeaveBalanceById: async (id: string): Promise<LeaveBalanceResponse> => {
    const response = await api.get<LeaveBalanceResponse>(`/leaves/balance/${id}`);
    return response.data;
  },
  
  // Update leave balance
  updateLeaveBalance: async (
    id: string, 
    data: UpdateLeaveBalanceRequest
  ): Promise<LeaveBalanceResponse> => {
    const response = await api.put<LeaveBalanceResponse>(`/leaves/balance/${id}`, data);
    return response.data;
  }
};

export default leaveApi;
