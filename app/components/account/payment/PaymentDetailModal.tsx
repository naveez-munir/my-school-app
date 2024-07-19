import { type Payment, PaymentStatusLabels, PaymentTypeLabels, PaymentModeLabels, PaymentForLabels } from '~/types/payment.types';
import { Modal } from '~/components/common/Modal';
import { formatCurrency } from '~/utils/currencyUtils';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export function PaymentDetailModal({
  isOpen,
  onClose,
  payment
}: PaymentDetailModalProps) {
  if (!payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Details"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {PaymentTypeLabels[payment.paymentType]}
              </h3>
              <span className={`px-3 py-1 text-sm font-medium rounded-full
                ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                  payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                  payment.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                  'bg-purple-100 text-purple-800'}`}
              >
                {PaymentStatusLabels[payment.status]}
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(payment.amount)}
            </div>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-gray-500">Payment For</p>
            <p className="text-base font-semibold text-gray-900">
              {payment.displayName || PaymentForLabels[payment.paymentFor]}
            </p>
            {payment.displaySubtext && (
              <p className="text-sm text-gray-600 mt-0.5">{payment.displaySubtext}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment Date</p>
            <p className="text-sm font-medium text-gray-900">{formatUserFriendlyDate(payment.paymentDate)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment Mode</p>
            <p className="text-sm font-medium text-gray-900">{PaymentModeLabels[payment.paymentMode]}</p>
          </div>

          {payment.paymentMode === 'CHEQUE' && payment.chequeNumber && (
            <div>
              <p className="text-sm text-gray-500">Cheque Number</p>
              <p className="text-sm font-medium text-gray-900">{payment.chequeNumber}</p>
            </div>
          )}

          {(payment.paymentMode === 'BANK_TRANSFER' || payment.paymentMode === 'ONLINE') && payment.transactionId && (
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="text-sm font-medium text-gray-900">{payment.transactionId}</p>
            </div>
          )}

          {payment.paymentMode === 'BANK_TRANSFER' && payment.bankDetails && (
            <div>
              <p className="text-sm text-gray-500">Bank Details</p>
              <p className="text-sm font-medium text-gray-900">{payment.bankDetails}</p>
            </div>
          )}

          {payment.receivedByName && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Received By</p>
              <p className="text-sm font-medium text-gray-900">{payment.receivedByName}</p>
            </div>
          )}

          {payment.remarks && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Remarks</p>
              <p className="text-sm font-medium text-gray-900">{payment.remarks}</p>
            </div>
          )}

          {payment.referenceDetails && (
            <div className="col-span-2 mt-2">
              <h4 className="text-md font-medium text-gray-900 mb-2">Reference Details</h4>
              <div className="bg-gray-50 p-3 rounded">
                {payment.paymentFor === 'Expense' && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.description || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Expense Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.expenseType || '-'}
                        </p>
                      </div>
                    </div>
                    {payment.referenceDetails.billNumber && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Bill Number</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.billNumber}
                        </p>
                      </div>
                    )}
                    {payment.referenceDetails.vendorDetails && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Vendor</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.vendorDetails}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {payment.paymentFor === 'Salary' && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Employee</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.employeeId?.firstName && payment.referenceDetails.employeeId?.lastName
                            ? `${payment.referenceDetails.employeeId.firstName} ${payment.referenceDetails.employeeId.lastName}`
                            : payment.referenceDetails.employeeName || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Period</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.month && payment.referenceDetails.year
                            ? `${payment.referenceDetails.month}/${payment.referenceDetails.year}`
                            : '-'}
                        </p>
                      </div>
                    </div>
                    {payment.referenceDetails.netSalary && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Net Salary</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.referenceDetails.netSalary)}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {payment.paymentFor === 'StudentFee' && (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Student</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.studentId?.firstName && payment.referenceDetails.studentId?.lastName
                            ? `${payment.referenceDetails.studentId.firstName} ${payment.referenceDetails.studentId.lastName}`
                            : '-'}
                        </p>
                        {payment.referenceDetails.studentId?.rollNumber && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Roll #: {payment.referenceDetails.studentId.rollNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Class</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.referenceDetails.studentId?.class?.className ||
                           payment.referenceDetails.studentId?.class || '-'}
                        </p>
                      </div>
                    </div>
                    {payment.referenceDetails.amount && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Payment Amount</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.referenceDetails.amount)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="col-span-2 border-t pt-3 mt-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Created At:</span>
              <span>{formatUserFriendlyDate(payment.createdAt)}</span>
            </div>
            {payment.updatedAt && payment.updatedAt !== payment.createdAt && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Last Updated:</span>
                <span>{formatUserFriendlyDate(payment.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
