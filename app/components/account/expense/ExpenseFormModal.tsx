import { useState, useEffect } from 'react';
import { 
  type CreateExpenseDto, 
  type Expense, 
  ExpenseType, 
  ExpenseTypeLabels 
} from '~/types/expense.types';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { Modal } from '~/components/common/Modal';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseDto) => Promise<void>;
  initialData?: Partial<Expense>;
  isSubmitting: boolean;
}

export function ExpenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: ExpenseFormModalProps) {
  const [formData, setFormData] = useState<CreateExpenseDto>({
    expenseType: ExpenseType.OTHER,
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        expenseType: initialData.expenseType || ExpenseType.OTHER,
        amount: initialData.amount || 0,
        description: initialData.description || '',
        expenseDate: initialData.expenseDate 
          ? new Date(initialData.expenseDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        billNumber: initialData.billNumber || '',
        vendorDetails: initialData.vendorDetails || '',
        remarks: initialData.remarks || '',
      });
    } else {
      setFormData({
        expenseType: ExpenseType.OTHER,
        amount: 0,
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CreateExpenseDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Edit Expense' : 'Add New Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Type
            </label>
            <select
              value={formData.expenseType}
              onChange={(e) => handleChange('expenseType', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Object.entries(ExpenseTypeLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label="Amount"
            type="number"
            value={formData.amount.toString()}
            onChange={(value) => handleChange('amount', parseFloat(value) || 0)}
            error={errors.amount}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Expense Date"
            type="date"
            value={formData.expenseDate.toString()}
            onChange={(value) => handleChange('expenseDate', value)}
            error={errors.expenseDate}
            required
          />

          <TextInput
            label="Bill Number"
            value={formData.billNumber || ''}
            onChange={(value) => handleChange('billNumber', value)}
          />
        </div>

        <TextInput
          label="Description"
          value={formData.description}
          onChange={(value) => handleChange('description', value)}
          error={errors.description}
          required
        />

        <TextInput
          label="Vendor Details"
          value={formData.vendorDetails || ''}
          onChange={(value) => handleChange('vendorDetails', value)}
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update' : 'Save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
