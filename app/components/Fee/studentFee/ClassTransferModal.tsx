import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { StudentClassTransferInput, TransferSummary } from '~/types/studentFee';
import { TransferFeeAction } from '~/types/studentFee';
import { useClasses } from '~/hooks/useClassQueries';
import { useFeeStructures } from '~/hooks/useFeeStructureQueries';
import { AcademicYearSelector } from '~/components/common/AcademicYearSelector';
import { FormActions } from '~/components/common/form/FormActions';

interface ClassTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentClassTransferInput) => Promise<TransferSummary>;
  isSubmitting: boolean;
  studentName: string;
  currentClassId?: string;
}

export function ClassTransferModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  studentName,
  currentClassId
}: ClassTransferModalProps) {
  const [formData, setFormData] = useState<Partial<StudentClassTransferInput>>({
    newClassId: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    pendingFeeAction: TransferFeeAction.CARRY_FORWARD,
    newAcademicYear: '',
    newFeeStructureId: '',
    generateNewFees: false,
    remarks: ''
  });
  const [summary, setSummary] = useState<TransferSummary | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const { data: classes = [] } = useClasses();
  const { data: feeStructures = [] } = useFeeStructures({
    classId: formData.newClassId,
    academicYear: formData.newAcademicYear
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newClassId && formData.effectiveDate && formData.pendingFeeAction) {
      try {
        const result = await onSubmit(formData as StudentClassTransferInput);
        setSummary(result);
        setShowSummary(true);
      } catch (error) {
        console.error('Transfer error:', error);
      }
    }
  };

  const handleClose = () => {
    setShowSummary(false);
    setSummary(null);
    setFormData({
      newClassId: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      pendingFeeAction: TransferFeeAction.CARRY_FORWARD,
      newAcademicYear: '',
      newFeeStructureId: '',
      generateNewFees: false,
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
          Class Transfer - {studentName}
        </h3>

        {!showSummary ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Class Transfer</p>
                <p>This will handle pending fees when transferring the student to a new class.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Class <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.newClassId}
                onChange={(e) => setFormData(prev => ({ ...prev, newClassId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select New Class</option>
                {classes.filter(c => c._id !== currentClassId).map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pending Fee Action <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.pendingFeeAction}
                onChange={(e) => setFormData(prev => ({ ...prev, pendingFeeAction: e.target.value as TransferFeeAction }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={TransferFeeAction.CARRY_FORWARD}>Carry Forward</option>
                <option value={TransferFeeAction.ADJUST}>Adjust to New Fee Structure</option>
                <option value={TransferFeeAction.CANCEL}>Cancel Pending Fees</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.pendingFeeAction === TransferFeeAction.CARRY_FORWARD && 'Keep existing fees as-is'}
                {formData.pendingFeeAction === TransferFeeAction.ADJUST && 'Adjust fees based on new class fee structure'}
                {formData.pendingFeeAction === TransferFeeAction.CANCEL && 'Cancel all pending fees'}
              </p>
            </div>

            {formData.pendingFeeAction === TransferFeeAction.ADJUST && (
              <>
                <AcademicYearSelector
                  value={formData.newAcademicYear || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, newAcademicYear: value }))}
                  label="New Academic Year"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Fee Structure
                  </label>
                  <select
                    value={formData.newFeeStructureId}
                    onChange={(e) => setFormData(prev => ({ ...prev, newFeeStructureId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Fee Structure</option>
                    {feeStructures.map((fs) => (
                      <option key={fs._id} value={fs._id}>
                        {fs.description}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="generateNewFees"
                checked={formData.generateNewFees}
                onChange={(e) => setFormData(prev => ({ ...prev, generateNewFees: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="generateNewFees" className="ml-2 text-sm text-gray-700">
                Generate new fees for the new class
              </label>
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
                placeholder="Reason for transfer..."
              />
            </div>

            <div className="mt-6">
              <FormActions
                onCancel={handleClose}
                isLoading={isSubmitting}
                submitText="Transfer Student"
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="font-medium text-green-800 mb-2">Transfer Summary</h3>
              
              <div className="space-y-2 text-sm">
                {summary && summary.cancelledFees > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Cancelled Fees:</span>
                      <span className="font-medium">{summary.cancelledFees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled Amount:</span>
                      <span className="font-medium">₹{summary.totalCancelledAmount.toLocaleString()}</span>
                    </div>
                  </>
                )}
                
                {summary && summary.carriedForwardFees > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Carried Forward Fees:</span>
                      <span className="font-medium">{summary.carriedForwardFees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carried Forward Amount:</span>
                      <span className="font-medium">₹{summary.totalCarriedForwardAmount.toLocaleString()}</span>
                    </div>
                  </>
                )}
                
                {summary && summary.adjustedFees > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Adjusted Fees:</span>
                      <span className="font-medium">{summary.adjustedFees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjustment Amount:</span>
                      <span className="font-medium">₹{summary.totalAdjustmentAmount.toLocaleString()}</span>
                    </div>
                  </>
                )}
                
                {summary && summary.newFeesGenerated > 0 && (
                  <>
                    <div className="flex justify-between text-blue-700">
                      <span>New Fees Generated:</span>
                      <span className="font-medium">{summary.newFeesGenerated}</span>
                    </div>
                    <div className="flex justify-between text-blue-700">
                      <span>New Fees Amount:</span>
                      <span className="font-medium">₹{summary.totalNewFeesAmount.toLocaleString()}</span>
                    </div>
                  </>
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

