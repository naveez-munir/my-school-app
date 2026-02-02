import { useState } from 'react';
import type { CreateFeeRefundInput } from '~/types/studentFee';
import { PaymentMode } from '~/types/studentFee';
import { useFeeCategories } from '~/hooks/useFeeCategoryQueries';
import { FormActions } from '~/components/common/form/FormActions';

interface CreateRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFeeRefundInput) => void;
  isSubmitting: boolean;
  studentFeeId: string;
  studentId: string;
  maxRefundAmount?: number;
}

export function CreateRefundModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  studentFeeId,
  studentId,
  maxRefundAmount
}: CreateRefundModalProps) {
  const [formData, setFormData] = useState<Partial<CreateFeeRefundInput>>({
    studentFeeId,
    studentId,
    feeCategoryId: '',
    refundAmount: 0,
    refundDate: new Date().toISOString().split('T')[0],
    refundMode: PaymentMode.CASH,
    refundReason: '',
    remarks: ''
  });

  const { data: feeCategories = [] } = useFeeCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.refundAmount && formData.refundDate && formData.refundMode && formData.refundReason) {
      onSubmit(formData as CreateFeeRefundInput);
    }
  };

  const handleChange = (field: keyof CreateFeeRefundInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-3xl border-1 border-gray-200 z-10 relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Create Fee Refund</h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.refundAmount}
              onChange={(e) => handleChange('refundAmount', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              min="0"
              max={maxRefundAmount}
              step="0.01"
              required
            />
            {maxRefundAmount && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum refundable amount: ₹{maxRefundAmount.toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.refundDate}
              onChange={(e) => handleChange('refundDate', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Mode <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.refundMode}
              onChange={(e) => handleChange('refundMode', e.target.value as PaymentMode)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
              required
            >
              <option value={PaymentMode.CASH}>Cash</option>
              <option value={PaymentMode.CHEQUE}>Cheque</option>
              <option value={PaymentMode.BANK_TRANSFER}>Bank Transfer</option>
              <option value={PaymentMode.ONLINE}>Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Category (Optional)
            </label>
            <select
              value={formData.feeCategoryId}
              onChange={(e) => handleChange('feeCategoryId', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
            >
              <option value="">None</option>
              {feeCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refund Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.refundReason}
              onChange={(e) => handleChange('refundReason', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
              placeholder="Reason for refund..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Remarks
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>
          </div>

          <div className="mt-6">
            <FormActions
              onCancel={onClose}
              isLoading={isSubmitting}
              submitText="Create Refund"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

