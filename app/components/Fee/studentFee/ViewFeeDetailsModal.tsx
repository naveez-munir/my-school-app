import { Modal } from '~/components/common/Modal';
import type { StudentFee, PopulatedStudentFee, FeeDetail, PopulatedFeeDetail } from '~/types/studentFee';
import { formatCurrency, getFeeStatusDisplayName, getMonthName } from '~/types/studentFee';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

type AnyStudentFee = StudentFee | PopulatedStudentFee;

interface ViewFeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: AnyStudentFee | null;
}

export function ViewFeeDetailsModal({ isOpen, onClose, fee }: ViewFeeDetailsModalProps) {
  if (!isOpen || !fee) return null;

  const getStudentName = () => {
    const student = fee.studentId;
    if (typeof student === 'object' && student !== null) {
      return `${student.firstName} ${student.lastName}`;
    }
    return `Student ID: ${student}`;
  };

  const getStudentRollNumber = () => {
    const student = fee.studentId;
    if (typeof student === 'object' && student !== null) {
      return student.rollNumber || 'N/A';
    }
    return 'N/A';
  };

  const getClassName = () => {
    const student = fee.studentId;
    if (typeof student === 'object' && student !== null && student.class) {
      if (typeof student.class === 'object' && student.class !== null) {
        return student.class.className;
      }
    }
    return 'N/A';
  };

  const getPeriodDisplay = () => {
    if (fee.billType === 'MONTHLY' && fee.billMonth) {
      return getMonthName(fee.billMonth);
    }
    if (fee.billType === 'QUARTERLY' && fee.quarter) {
      return `Q${fee.quarter}`;
    }
    return fee.billType;
  };

  const getFeeCategoryName = (detail: FeeDetail | PopulatedFeeDetail) => {
    if (typeof detail.feeCategory === 'object' && detail.feeCategory !== null) {
      return detail.feeCategory.name;
    }
    return `Category ID: ${detail.feeCategory}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fee Details" size="xl">
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium text-blue-700 mb-2">Student Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Name:</span> {getStudentName()}
            </div>
            <div>
              <span className="font-medium">Roll Number:</span> {getStudentRollNumber()}
            </div>
            <div>
              <span className="font-medium">Class:</span> {getClassName()}
            </div>
            <div>
              <span className="font-medium">Academic Year:</span> {fee.academicYear}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Fee Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Period:</span> {getPeriodDisplay()}
            </div>
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className={`px-2 py-1 text-xs rounded-full ${getFeeStatusDisplayName(fee.status)}`}>
                {getFeeStatusDisplayName(fee.status)}
              </span>
            </div>
            <div>
              <span className="font-medium">Due Date:</span> {formatUserFriendlyDate(fee.dueDate)}
            </div>
            {fee.lastPaymentDate && (
              <div>
                <span className="font-medium">Last Payment:</span>{' '}
                {formatUserFriendlyDate(fee.lastPaymentDate)}
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Fee Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Original</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Late Charges</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Due</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fee.feeDetails.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{getFeeCategoryName(detail)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {formatCurrency(detail.originalAmount)}
                    </td>
                    <td className="px-4 py-2 text-sm text-red-600 text-right">
                      {formatCurrency(detail.discountAmount)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {formatCurrency(detail.netAmount)}
                    </td>
                    <td className="px-4 py-2 text-sm text-green-600 text-right">
                      {formatCurrency(detail.paidAmount)}
                    </td>
                    <td className="px-4 py-2 text-sm text-orange-600 text-right">
                      {formatCurrency(detail.lateCharges)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">
                      {formatCurrency(detail.dueAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="font-medium">
                  <td className="px-4 py-2 text-sm text-gray-900">Total</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(fee.totalAmount)}
                  </td>
                  <td className="px-4 py-2 text-sm text-red-600 text-right">
                    {formatCurrency(fee.totalDiscount)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(fee.netAmount)}
                  </td>
                  <td className="px-4 py-2 text-sm text-green-600 text-right">
                    {formatCurrency(fee.paidAmount)}
                  </td>
                  <td className="px-4 py-2 text-sm text-orange-600 text-right">
                    {formatCurrency(fee.lateCharges)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {formatCurrency(fee.dueAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {fee.remarks && (
          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="font-medium text-yellow-700 mb-1">Remarks</h4>
            <p className="text-sm text-gray-700">{fee.remarks}</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
