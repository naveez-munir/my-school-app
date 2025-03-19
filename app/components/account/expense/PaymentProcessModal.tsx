import { useState } from 'react';
import { Modal } from '~/components/common/Modal';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { 
  type Expense, 
  ExpenseTypeLabels, 
  PaymentMethod, 
  PaymentMethodLabels,
  type ProcessExpensePaymentDto
} from '~/types/expense.types';

interface PaymentProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: ProcessExpensePaymentDto) => Promise<void>;
  expense: Expense | null;
  isSubmitting: boolean;
}

export function PaymentProcessModal({
  isOpen,
  onClose,
  onSubmit,
  expense,
  isSubmitting
}: PaymentProcessModalProps) {
  const [formData, setFormData] = useState<ProcessExpensePaymentDto>({
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentReference: '',
    remarks: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ProcessExpensePaymentDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }
    
    if (
      (formData.paymentMethod === PaymentMethod.CHEQUE || 
       formData.paymentMethod === PaymentMethod.BANK_TRANSFER || 
       formData.paymentMethod === PaymentMethod.ONLINE) && 
      !formData.paymentReference
    ) {
      newErrors.paymentReference = 'Reference number is required for this payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !expense?.id) {
      return;
    }
    
    await onSubmit(expense.id, formData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!expense) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Payment"
    >
      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">Expense Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Type:</span>{' '}
            <span className="font-medium">{ExpenseTypeLabels[expense.expenseType]}</span>
          </div>
          <div>
            <span className="text-gray-500">Amount:</span>{' '}
            <span className="font-medium text-green-600">{formatCurrency(expense.amount)}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>{' '}
            <span className="font-medium">{new Date(expense.expenseDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Bill Number:</span>{' '}
            <span className="font-medium">{expense.billNumber || '-'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Description:</span>{' '}
            <span className="font-medium">{expense.description}</span>
          </div>
          {expense.vendorDetails && (
            <div className="col-span-2">
              <span className="text-gray-500">Vendor:</span>{' '}
              <span className="font-medium">{expense.vendorDetails}</span>
            </div>
          )}
          {expense.approverName && (
            <div className="col-span-2">
              <span className="text-gray-500">Approved By:</span>{' '}
              <span className="font-medium">{expense.approverName}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Object.entries(PaymentMethodLabels).map(([method, label]) => (
                <option key={method} value={method}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label="Payment Date"
            type="date"
            value={formData.paymentDate}
            onChange={(value) => handleChange('paymentDate', value)}
            error={errors.paymentDate}
            required
          />
        </div>

        <TextInput
          label="Payment Reference"
          value={formData.paymentReference || ''}
          onChange={(value) => handleChange('paymentReference', value)}
          error={errors.paymentReference}
          placeholder={
            formData.paymentMethod === PaymentMethod.CHEQUE 
              ? "Cheque Number" 
              : formData.paymentMethod === PaymentMethod.BANK_TRANSFER 
                ? "Transaction ID" 
                : formData.paymentMethod === PaymentMethod.ONLINE 
                  ? "Transaction Reference" 
                  : "Reference (optional)"
          }
          required={formData.paymentMethod !== PaymentMethod.CASH}
        />

        <TextInput
          label="Remarks"
          value={formData.remarks || ''}
          onChange={(value) => handleChange('remarks', value)}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
