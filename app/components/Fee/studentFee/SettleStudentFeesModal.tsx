import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { StudentFeeSettlementInput, SettlementSummary } from '~/types/studentFee';
import { SettlementType } from '~/types/studentFee';
import { FormActions } from '~/components/common/form/FormActions';

interface SettleStudentFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFeeSettlementInput) => Promise<SettlementSummary>;
  isSubmitting: boolean;
  studentName: string;
}

export function SettleStudentFeesModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  studentName
}: SettleStudentFeesModalProps) {
  const [formData, setFormData] = useState<StudentFeeSettlementInput>({
    settlementType: SettlementType.CANCEL_PENDING,
    effectiveDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await onSubmit(formData);
      setSummary(result);
      setShowSummary(true);
    } catch (error) {
      console.error('Settlement error:', error);
    }
  };

  const handleClose = () => {
    setShowSummary(false);
    setSummary(null);
    setFormData({
      settlementType: SettlementType.CANCEL_PENDING,
      effectiveDate: new Date().toISOString().split('T')[0],
      remarks: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-3xl border-1 border-gray-200 z-10 relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">
          Settle Fees - {studentName}
        </h3>

        {!showSummary ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Important:</p>
                <p>This action will settle all pending fees for this student. This is typically used when a student is exiting the school.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Settlement Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.settlementType}
                onChange={(e) => setFormData(prev => ({ ...prev, settlementType: e.target.value as SettlementType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={SettlementType.CANCEL_PENDING}>Cancel Pending Fees Only</option>
                <option value={SettlementType.SETTLE_ALL}>Settle All (Including Partial Payments)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.settlementType === SettlementType.CANCEL_PENDING
                  ? 'Only unpaid fees will be cancelled. Partially paid fees will remain.'
                  : 'All pending fees will be cancelled, including those with partial payments.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Reason for settlement..."
              />
            </div>

            <div className="mt-6">
              <FormActions
                onCancel={handleClose}
                isLoading={isSubmitting}
                submitText="Settle Fees"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="font-medium text-green-800 mb-2">Settlement Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cancelled Fees:</span>
                  <span className="font-medium">{summary?.cancelledFees || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cancelled Amount:</span>
                  <span className="font-medium">₹{summary?.totalCancelledAmount.toLocaleString() || 0}</span>
                </div>
                
                {summary && summary.totalRefundableAmount > 0 && (
                  <>
                    <hr className="my-2" />
                    <div className="flex justify-between text-blue-700">
                      <span>Refundable Amount:</span>
                      <span className="font-medium">₹{summary.totalRefundableAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {summary.refundableFees.length} fee(s) have refundable amounts. Please process refunds separately.
                    </div>
                  </>
                )}
                
                {summary && summary.totalNonRefundableAmount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Non-refundable Amount:</span>
                    <span className="font-medium">₹{summary.totalNonRefundableAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

