import { useMemo } from "react";
import type { ReceiptResult } from "~/types/studentFee";
import { formatCurrency } from "~/types/studentFee";
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { getTenantName } from '~/utils/auth';

interface PaymentReceiptPrintProps {
  receipt: ReceiptResult;
}

export function PaymentReceiptPrint({ receipt }: PaymentReceiptPrintProps) {
  const { payment, studentFee, student, receiptNumber } = receipt;
  const schoolName = getTenantName() || 'School Name';
  
  const totalPaid = useMemo(() => {
    return (payment.amount || 0) + (payment.lateChargesPaid || 0);
  }, [payment]);

  const getClassName = () => {
    if (typeof student.class === 'object' && student.class !== null) {
      return student.class.className;
    }
    return `Class ID: ${student.class}`;
  };

  const getFeePeriod = () => {
    if (studentFee.billType === 'MONTHLY' && studentFee.billMonth) {
      return `Month ${studentFee.billMonth}`;
    }
    if (studentFee.billType === 'QUARTERLY' && studentFee.quarter) {
      return `Quarter ${studentFee.quarter}`;
    }
    return studentFee.billType;
  };

  return (
    <div className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #payment-receipt-print, #payment-receipt-print * {
            visibility: visible;
          }
          #payment-receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div id="payment-receipt-print" className="p-6 bg-white">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 pb-3 border-b-2 border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{schoolName}</h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Receipt</h2>
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium">Receipt Number: </span>
              <span className="font-bold">{receiptNumber}</span>
            </div>
            <div>
              <span className="font-medium">Date: </span>
              <span>{formatUserFriendlyDate(payment.paymentDate)}</span>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Student Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600 block">Name:</span>
              <span className="font-medium">{student.firstName} {student.lastName}</span>
            </div>
            {student.rollNumber && (
              <div>
                <span className="text-sm text-gray-600 block">Roll Number:</span>
                <span className="font-medium">{student.rollNumber}</span>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-600 block">Class:</span>
              <span className="font-medium">{getClassName()}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Payment Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Payment Mode:</span>
              <span className="font-medium">{payment.paymentMode}</span>
            </div>
            {payment.chequeNumber && (
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Cheque Number:</span>
                <span className="font-medium">{payment.chequeNumber}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Amount Paid:</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            {payment.lateChargesPaid > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Late Charges:</span>
                <span className="font-medium">{formatCurrency(payment.lateChargesPaid)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t-2 border-gray-800 mt-2">
              <span className="text-gray-900 font-semibold">Total:</span>
              <span className="font-bold text-lg">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
        </div>

        {/* Fee Information */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-300">
            Fee Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Academic Year:</span>
              <span className="font-medium">{studentFee.academicYear}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Fee Period:</span>
              <span className="font-medium">{getFeePeriod()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Total Fee Amount:</span>
              <span className="font-medium">{formatCurrency(studentFee.totalAmount)}</span>
            </div>
            {studentFee.totalDiscount > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-700">Total Discount:</span>
                <span className="font-medium">{formatCurrency(studentFee.totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-t border-gray-300 mt-2 pt-2">
              <span className="text-gray-700">Previous Balance:</span>
              <span className="font-medium">{formatCurrency(studentFee.dueAmount + payment.amount)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-700">Amount Paid:</span>
              <span className="font-medium text-green-700">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-800 mt-2">
              <span className="text-gray-900 font-semibold">Remaining Balance:</span>
              <span className="font-bold text-lg">{formatCurrency(studentFee.dueAmount)}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {payment.remarks && (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-300 rounded">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Remarks:</h3>
            <p className="text-gray-700 text-sm">{payment.remarks}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-300 text-center">
          <p className="text-xs text-gray-600">
            This is a computer-generated receipt and does not require a signature.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

