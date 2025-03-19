import { useState } from 'react';
import { ExpenseTable } from './ExpenseTable';
import { ExpenseFormModal } from './ExpenseFormModal';
import { ApproveExpenseModal } from './ApproveExpenseModal';
import { PaymentProcessModal } from './PaymentProcessModal';
import { ExpenseStatus, ExpenseType, PaymentMethod, type Expense, type CreateExpenseDto, type SearchExpenseParams } from '~/types/expense.types';
import { 
  useExpenses, 
  useCreateExpense, 
  useUpdateExpense, 
  useDeleteExpense,
  useApproveExpense,
  useProcessPayment
} from '~/hooks/useExpenseQueries';

export const ExpenseSection = () => {
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // State for selected expense and filters
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<SearchExpenseParams>({});
  
  // React Query hooks
  const { 
    data: expenses = [], 
    isLoading, 
    error 
  } = useExpenses(filters);
  
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();
  const approveExpenseMutation = useApproveExpense();
  const processPaymentMutation = useProcessPayment();

  // Create or update expense handler
  const handleSaveExpense = async (data: CreateExpenseDto) => {
    try {
      if (selectedExpense?.id) {
        await updateExpenseMutation.mutateAsync({ 
          id: selectedExpense.id, 
          data 
        });
      } else {
        await createExpenseMutation.mutateAsync(data);
      }
      setIsFormModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  // Handle editing an expense
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsFormModalOpen(true);
  };

  // Handle deleting an expense
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpenseMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting expense:", err);
      }
    }
  };

  // Handle opening approve modal
  const handleApproveOpen = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsApproveModalOpen(true);
  };

  // Handle approval or rejection submission
  const handleApproveSubmit = async (id: string, data: any) => {
    try {
      await approveExpenseMutation.mutateAsync({ id, data });
      setIsApproveModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error("Error approving expense:", err);
    }
  };

  // Handle opening payment modal
  const handlePaymentOpen = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsPaymentModalOpen(true);
  };

  // Handle payment processing submission
  const handlePaymentSubmit = async (id: string, data: any) => {
    try {
      await processPaymentMutation.mutateAsync({ id, data });
      setIsPaymentModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error("Error processing payment:", err);
    }
  };

  // Handler for filter changes
  const handleFilterChange = (field: keyof SearchExpenseParams, value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      const newFilters = { ...filters };
      delete newFilters[field];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Expense Management
        </h2>
        <button
          onClick={() => {
            setSelectedExpense(null);
            setIsFormModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Expense
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              value={filters.expenseType || ''}
              onChange={(e) => handleFilterChange('expenseType', e.target.value || undefined)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All Types</option>
              <option value={ExpenseType.INFRASTRUCTURE}>Infrastructure</option>
              <option value={ExpenseType.UTILITIES}>Utilities</option>
              <option value={ExpenseType.SUPPLIES}>Supplies</option>
              <option value={ExpenseType.MAINTENANCE}>Maintenance</option>
              <option value={ExpenseType.EVENT}>Event</option>
              <option value={ExpenseType.OTHER}>Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value={ExpenseStatus.PENDING}>Pending</option>
              <option value={ExpenseStatus.APPROVED}>Approved</option>
              <option value={ExpenseStatus.PAID}>Paid</option>
              <option value={ExpenseStatus.REJECTED}>Rejected</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading expenses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <ExpenseTable
          data={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApproveOpen}
          onProcessPayment={handlePaymentOpen}
        />
      )}

      <ExpenseFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={handleSaveExpense}
        initialData={selectedExpense || undefined}
        isSubmitting={createExpenseMutation.isPending || updateExpenseMutation.isPending}
      />

      <ApproveExpenseModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={handleApproveSubmit}
        expense={selectedExpense}
        isSubmitting={approveExpenseMutation.isPending}
      />

      <PaymentProcessModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedExpense(null);
        }}
        onSubmit={handlePaymentSubmit}
        expense={selectedExpense}
        isSubmitting={processPaymentMutation.isPending}
      />
    </div>
  );
};
