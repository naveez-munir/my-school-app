import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '../services/expenseApi';
import toast from 'react-hot-toast';
import type {
  Expense,
  CreateExpenseDto,
  UpdateExpenseDto,
  SearchExpenseParams,
  ApproveExpenseDto,
  ProcessExpensePaymentDto,
  ExpenseSummary
} from '../types/expense.types';

// Query keys for React Query
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: SearchExpenseParams) => [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  summary: () => [...expenseKeys.all, 'summary'] as const,
  yearlySummary: (year: number) => [...expenseKeys.summary(), year] as const,
  monthlySummary: (year: number, month: number) => [...expenseKeys.yearlySummary(year), month] as const,
};

// Hook for fetching expenses with filters
export const useExpenses = (params?: SearchExpenseParams) => {
  return useQuery({
    queryKey: expenseKeys.list(params || {}),
    queryFn: () => expenseApi.getAll(params)
  });
};

// Hook for fetching a single expense by ID
export const useExpense = (id: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseApi.getById(id),
    enabled: !!id
  });
};

// Hook for fetching expense summary by year or month
export const useExpenseSummary = (year: number, month?: number) => {
  return useQuery({
    queryKey: month !== undefined 
      ? expenseKeys.monthlySummary(year, month) 
      : expenseKeys.yearlySummary(year),
    queryFn: () => expenseApi.getSummary(year, month),
    enabled: !!year
  });
};

// Hook for creating a new expense
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      toast.success('Expense created successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create expense';
      toast.error(errorMessage);
    }
  });
};

// Hook for updating an expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) => expenseApi.update(id, data),
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      if (updatedExpense.id) {
        queryClient.setQueryData(expenseKeys.detail(updatedExpense.id), updatedExpense);
      }
      toast.success('Expense updated successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update expense';
      toast.error(errorMessage);
    }
  });
};

// Hook for approving or rejecting an expense
export const useApproveExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveExpenseDto }) =>
      expenseApi.approveExpense(id, data),
    onSuccess: (updatedExpense, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      if (updatedExpense.id) {
        queryClient.setQueryData(expenseKeys.detail(updatedExpense.id), updatedExpense);
      }
      const isApproved = variables.data.status === 'APPROVED';
      toast.success(isApproved ? 'Expense approved successfully!' : 'Expense rejected successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to process expense approval';
      toast.error(errorMessage);
    }
  });
};

// Hook for processing payment for an expense
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessExpensePaymentDto }) =>
      expenseApi.processPayment(id, data),
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      if (updatedExpense.id) {
        queryClient.setQueryData(expenseKeys.detail(updatedExpense.id), updatedExpense);
      }

      // Also invalidate summary data since payments affect summary
      queryClient.invalidateQueries({ queryKey: expenseKeys.summary() });
      toast.success('Payment processed successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to process payment';
      toast.error(errorMessage);
    }
  });
};

// Hook for deleting an expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.removeQueries({ queryKey: expenseKeys.detail(id) });

      // Also invalidate summary data
      queryClient.invalidateQueries({ queryKey: expenseKeys.summary() });
      toast.success('Expense deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete expense';
      toast.error(errorMessage);
    }
  });
};
