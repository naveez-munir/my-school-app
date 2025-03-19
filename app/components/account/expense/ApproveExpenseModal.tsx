import { useState } from 'react';
import { Modal } from '~/components/common/Modal';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { 
  type ApproveExpenseDto, 
  EmployeeType, 
  EmployeeTypeLabels, 
  type Expense, 
  ExpenseStatus, 
  ExpenseTypeLabels 
} from '~/types/expense.types';

interface ApproveExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: ApproveExpenseDto) => Promise<void>;
  expense: Expense | null;
  isSubmitting: boolean;
}

export function ApproveExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  expense,
  isSubmitting
}: ApproveExpenseModalProps) {
  const [formData, setFormData] = useState<ApproveExpenseDto>({
    approvedBy: '',
    approverType: EmployeeType.STAFF,
    status: ExpenseStatus.APPROVED,
    comments: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ApproveExpenseDto, value: any) => {
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
    
    if (!formData.approvedBy.trim()) {
      newErrors.approvedBy = 'Approver ID is required';
    }
    
    if (formData.status === ExpenseStatus.REJECTED && !formData.comments?.trim()) {
      newErrors.comments = 'Please provide a reason for rejection';
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
      title="Approve or Reject Expense"
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
            <span className="font-medium">{formatCurrency(expense.amount)}</span>
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
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Approver ID"
            value={formData.approvedBy}
            onChange={(value) => handleChange('approvedBy', value)}
            error={errors.approvedBy}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approver Type
            </label>
            <select
              value={formData.approverType}
              onChange={(e) => handleChange('approverType', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Object.entries(EmployeeTypeLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decision
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="status"
                value={ExpenseStatus.APPROVED}
                checked={formData.status === ExpenseStatus.APPROVED}
                onChange={() => handleChange('status', ExpenseStatus.APPROVED)}
              />
              <span className="ml-2">Approve</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-red-600"
                name="status"
                value={ExpenseStatus.REJECTED}
                checked={formData.status === ExpenseStatus.REJECTED}
                onChange={() => handleChange('status', ExpenseStatus.REJECTED)}
              />
              <span className="ml-2">Reject</span>
            </label>
          </div>
        </div>

        <TextInput
          label="Comments"
          value={formData.comments || ''}
          onChange={(value) => handleChange('comments', value)}
          error={errors.comments}
          required={formData.status === ExpenseStatus.REJECTED}
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
            className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50
              ${formData.status === ExpenseStatus.APPROVED ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isSubmitting ? 'Processing...' : (formData.status === ExpenseStatus.APPROVED ? 'Approve' : 'Reject')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
