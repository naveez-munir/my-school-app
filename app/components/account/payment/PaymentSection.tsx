import { useState } from 'react';
import { PaymentsTable } from './PaymentsTable';
import { PaymentFormModal } from './PaymentFormModal';
import { PaymentDetailModal } from './PaymentDetailModal';
import { 
  type Payment, 
  PaymentStatus, 
  PaymentType, 
  PaymentMode, 
  PaymentFor,
  type SearchPaymentParams, 
  type CreatePaymentDto
} from '~/types/payment.types';
import { 
  usePayments, 
  useCreatePayment, 
  useUpdatePayment, 
  useDeletePayment,
  useUpdatePaymentStatus
} from '~/hooks/usePayment';

export const PaymentSection = () => {
  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // State for selected payment and filters
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState<SearchPaymentParams>({});
  
  // React Query hooks
  const { 
    data: payments = [], 
    isLoading, 
    error 
  } = usePayments(filters);
  
  const createPaymentMutation = useCreatePayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();
  const updateStatusMutation = useUpdatePaymentStatus();

  // Create or update payment handler
  const handleSavePayment = async (data: CreatePaymentDto) => {
    try {
      if (selectedPayment?.id) {
        await updatePaymentMutation.mutateAsync({ 
          id: selectedPayment.id, 
          data 
        });
      } else {
        await createPaymentMutation.mutateAsync(data);
      }
      setIsFormModalOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  };

  // Handle viewing a payment
  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  // Handle editing a payment
  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsFormModalOpen(true);
  };

  // Handle deleting a payment
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePaymentMutation.mutateAsync(id);
      } catch (err) {
        console.error("Error deleting payment:", err);
      }
    }
  };

  // Handle updating payment status
  const handleUpdateStatus = async (payment: Payment, status: PaymentStatus) => {
    try {
      let confirmMessage = 'Are you sure you want to';
      
      if (status === PaymentStatus.REFUNDED) {
        confirmMessage += ' mark this payment as refunded?';
      } else if (status === PaymentStatus.FAILED) {
        confirmMessage += ' mark this payment as failed?';
      } else {
        confirmMessage += ` change status to ${status}?`;
      }
      
      if (window.confirm(confirmMessage)) {
        await updateStatusMutation.mutateAsync({ id: payment.id as string, status });
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  // Handler for filter changes
  const handleFilterChange = (field: keyof SearchPaymentParams, value: any) => {
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
          Payment Management
        </h2>
        <button
          onClick={() => {
            setSelectedPayment(null);
            setIsFormModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Payment
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              value={filters.paymentType || ''}
              onChange={(e) => handleFilterChange('paymentType', e.target.value || undefined)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All Types</option>
              <option value={PaymentType.STUDENT_FEE}>Student Fee</option>
              <option value={PaymentType.SALARY}>Salary</option>
              <option value={PaymentType.EXPENSE}>Expense</option>
              <option value={PaymentType.OTHER_INCOME}>Other Income</option>
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
              <option value={PaymentStatus.PENDING}>Pending</option>
              <option value={PaymentStatus.COMPLETED}>Completed</option>
              <option value={PaymentStatus.FAILED}>Failed</option>
              <option value={PaymentStatus.REFUNDED}>Refunded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Payment Mode
            </label>
            <select
              value={filters.paymentMode || ''}
              onChange={(e) => handleFilterChange('paymentMode', e.target.value || undefined)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All Modes</option>
              <option value={PaymentMode.CASH}>Cash</option>
              <option value={PaymentMode.CHEQUE}>Cheque</option>
              <option value={PaymentMode.BANK_TRANSFER}>Bank Transfer</option>
              <option value={PaymentMode.ONLINE}>Online Payment</option>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Payment For
            </label>
            <select
              value={filters.paymentFor || ''}
              onChange={(e) => handleFilterChange('paymentFor', e.target.value || undefined)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              <option value="">All References</option>
              <option value={PaymentFor.EXPENSE}>Expense</option>
              <option value={PaymentFor.SALARY}>Salary</option>
              <option value={PaymentFor.STUDENT_FEE}>Student Fee</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference ID
            </label>
            <input
              type="text"
              value={filters.referenceId || ''}
              onChange={(e) => handleFilterChange('referenceId', e.target.value)}
              placeholder="Enter reference ID"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading payments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{(error as Error).message}</div>
      ) : (
        <PaymentsTable
          data={payments}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      <PaymentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleSavePayment}
        initialData={selectedPayment || undefined}
        isSubmitting={createPaymentMutation.isPending || updatePaymentMutation.isPending}
      />

      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
};
