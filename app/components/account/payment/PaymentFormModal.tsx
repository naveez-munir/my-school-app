import { useState, useEffect } from 'react';
import { 
  type Payment, 
  type CreatePaymentDto, 
  PaymentType, 
  PaymentTypeLabels, 
  PaymentMode,
  PaymentModeLabels,
  PaymentFor,
  PaymentForLabels,
  PaymentStatus,
  ReceivedByType,
  ReceivedByTypeLabels
} from '~/types/payment.types';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { Modal } from '~/components/common/Modal';

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentDto) => Promise<void>;
  initialData?: Partial<Payment>;
  isSubmitting: boolean;
}

export function PaymentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: PaymentFormModalProps) {
  const [formData, setFormData] = useState<CreatePaymentDto>({
    paymentType: PaymentType.EXPENSE,
    paymentMode: PaymentMode.CASH,
    referenceId: '',
    paymentFor: PaymentFor.EXPENSE,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    status: PaymentStatus.PENDING
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const paymentDate = initialData.paymentDate 
        ? new Date(initialData.paymentDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      setFormData({
        paymentType: initialData.paymentType || PaymentType.EXPENSE,
        paymentMode: initialData.paymentMode || PaymentMode.CASH,
        referenceId: initialData.referenceId || '',
        paymentFor: initialData.paymentFor || PaymentFor.EXPENSE,
        amount: initialData.amount || 0,
        paymentDate,
        remarks: initialData.remarks || '',
        chequeNumber: initialData.chequeNumber || '',
        bankDetails: initialData.bankDetails || '',
        transactionId: initialData.transactionId || '',
        receivedBy: initialData.receivedBy || '',
        receivedByType: initialData.receivedByType,
        status: initialData.status || PaymentStatus.PENDING
      });
    } else {
      setFormData({
        paymentType: PaymentType.EXPENSE,
        paymentMode: PaymentMode.CASH,
        referenceId: '',
        paymentFor: PaymentFor.EXPENSE,
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        status: PaymentStatus.PENDING
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.referenceId.trim()) {
      newErrors.referenceId = 'Reference ID is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }
    
    if (formData.paymentMode === PaymentMode.CHEQUE && !formData.chequeNumber?.trim()) {
      newErrors.chequeNumber = 'Cheque number is required for cheque payments';
    }
    
    if ((formData.paymentMode === PaymentMode.BANK_TRANSFER || formData.paymentMode === PaymentMode.ONLINE) 
        && !formData.transactionId?.trim()) {
      newErrors.transactionId = 'Transaction ID is required for this payment mode';
    }
    
    if (formData.receivedBy && !formData.receivedByType) {
      newErrors.receivedByType = 'Receiver type is required when receiver is specified';
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

  const handleChange = (field: keyof CreatePaymentDto, value: any) => {
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
      title={initialData?.id ? 'Edit Payment' : 'Add New Payment'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select
              value={formData.paymentType}
              onChange={(e) => handleChange('paymentType', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Object.entries(PaymentTypeLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment For
            </label>
            <select
              value={formData.paymentFor}
              onChange={(e) => handleChange('paymentFor', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Object.entries(PaymentForLabels).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TextInput
          label="Reference ID"
          value={formData.referenceId}
          onChange={(value) => handleChange('referenceId', value)}
          error={errors.referenceId}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Amount"
            type="number"
            value={formData.amount.toString()}
            onChange={(value) => handleChange('amount', parseFloat(value) || 0)}
            error={errors.amount}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode
            </label>
            <select
              value={formData.paymentMode}
              onChange={(e) => handleChange('paymentMode', e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
            >
              {Object.entries(PaymentModeLabels).map(([mode, label]) => (
                <option key={mode} value={mode}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.paymentMode === PaymentMode.CHEQUE && (
          <TextInput
            label="Cheque Number"
            value={formData.chequeNumber || ''}
            onChange={(value) => handleChange('chequeNumber', value)}
            error={errors.chequeNumber}
            required
          />
        )}

        {formData.paymentMode === PaymentMode.BANK_TRANSFER && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Transaction ID"
              value={formData.transactionId || ''}
              onChange={(value) => handleChange('transactionId', value)}
              error={errors.transactionId}
              required
            />
            <TextInput
              label="Bank Details"
              value={formData.bankDetails || ''}
              onChange={(value) => handleChange('bankDetails', value)}
            />
          </div>
        )}

        {formData.paymentMode === PaymentMode.ONLINE && (
          <TextInput
            label="Transaction ID"
            value={formData.transactionId || ''}
            onChange={(value) => handleChange('transactionId', value)}
            error={errors.transactionId}
            required
          />
        )}

        <TextInput
          label="Payment Date"
          type="date"
          value={formData.paymentDate.toString()}
          onChange={(value) => handleChange('paymentDate', value)}
          error={errors.paymentDate}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Received By (ID)"
            value={formData.receivedBy || ''}
            onChange={(value) => handleChange('receivedBy', value)}
          />

          {formData.receivedBy && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receiver Type
              </label>
              <select
                value={formData.receivedByType || ''}
                onChange={(e) => handleChange('receivedByType', e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
                required={!!formData.receivedBy}
              >
                <option value="">Select Type</option>
                {Object.entries(ReceivedByTypeLabels).map(([type, label]) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.receivedByType && (
                <p className="mt-1 text-sm text-red-600">{errors.receivedByType}</p>
              )}
            </div>
          )}
        </div>

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
