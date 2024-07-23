import { useState } from 'react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import {
  PaymentMethod,
  PaymentMethodLabels,
  type CreateSalaryDto,
  type UpdateSalaryDto
} from '~/types/salary.types';

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSalaryDto & Partial<UpdateSalaryDto>) => void;
  isSubmitting?: boolean;
  mode: 'approve' | 'payment';
}

export function SalaryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  mode
}: SalaryModalProps) {
  const [formData, setFormData] = useState<Partial<UpdateSalaryDto>>({
    paymentMethod: PaymentMethod.CASH,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentReference: '',
    remarks: ''
  });
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as any);
  };

  const paymentMethodOptions: Record<string, string> = {};
  Object.entries(PaymentMethodLabels).forEach(([key, value]) => {
    paymentMethodOptions[key] = value;
  });

  const modalTitle = mode === 'approve' ? 'Approve Salary' : 'Process Payment';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="bg-white rounded-lg p-4 sm:p-5 w-full max-w-[90%] sm:max-w-xl border-1 border-gray-200 z-10 relative">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{modalTitle}</h3>

        <form onSubmit={handleSubmit}>

          {/* Payment section (only for payment mode) */}
          {mode === 'payment' && (
            <div className="bg-blue-50 p-3 sm:p-4 rounded-md mb-4 sm:mb-5 border border-blue-200">
              <h4 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Payment Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <SelectInput
                  label="Payment Method"
                  value={formData.paymentMethod || PaymentMethod.CASH}
                  options={paymentMethodOptions}
                  onChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                  required
                  disabled={isSubmitting}
                />
                
                <DateInput
                  label="Payment Date"
                  value={formData.paymentDate as string || new Date().toISOString().split('T')[0]}
                  onChange={(value) => setFormData(prev => ({ ...prev, paymentDate: value }))}
                  required
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Payment Reference"
                  value={formData.paymentReference || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, paymentReference: value }))}
                  disabled={isSubmitting}
                />
                
                <TextInput
                  label="Remarks"
                  value={formData.remarks || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, remarks: value }))}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Approval section */}
          {mode === 'approve' && (
            <div className="bg-green-50 p-3 sm:p-4 rounded-md mb-4 sm:mb-5 border border-green-200">
              <h4 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">Approval Details</h4>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <TextInput
                  label="Comments"
                  value={formData.remarks || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, remarks: value }))}
                  disabled={isSubmitting}
                  placeholder="Optional approval comments"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-xs sm:text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : mode === 'approve' ? 'Approve' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
