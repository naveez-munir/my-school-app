import { useMemo } from "react";
import type { ReceiptResult } from "~/types/studentFee";
import { formatCurrency } from "~/types/studentFee";
import { Printer, X } from "lucide-react";
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface ReceiptViewProps {
  receipt: ReceiptResult;
  onClose: () => void;
}

export function ReceiptView({ receipt, onClose }: ReceiptViewProps) {
  const { payment, studentFee, student, receiptNumber } = receipt;

  const totalPaid = useMemo(() => {
    return (payment.amount || 0) + (payment.lateChargesPaid || 0);
  }, [payment]);

  const handlePrint = () => {
    window.print();
  };



  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Payment Receipt
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            <Printer className="h-4 w-4 mr-1" /> Print
          </button>
          <button
            onClick={onClose}
            className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
          >
            <X className="h-4 w-4 mr-1" /> Close
          </button>
        </div>
      </div>
      
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Receipt Number:</span>
          <span className="font-medium">{receiptNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Date:</span>
          <span>{formatUserFriendlyDate(payment.paymentDate)}</span>
        </div>
      </div>
      
      <div className="border-b pb-4 mb-4">
        <h3 className="font-medium mb-2">Student Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="block font-medium">{student.firstName} {student.lastName}</span>
          </div>
          {student.rollNumber && (
            <div>
              <span className="text-gray-600">Roll Number:</span>
              <span className="block font-medium">{student.rollNumber}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Class:</span>
            <span className="block font-medium">
              {typeof student.class === 'object' 
                ? student.class.className 
                : `Class ID: ${student.class}`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-b pb-4 mb-4">
        <h3 className="font-medium mb-2">Payment Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Mode:</span>
            <span>{payment.paymentMode}</span>
          </div>
          {payment.transactionId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span>{payment.transactionId}</span>
            </div>
          )}
          {payment.chequeNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cheque Number:</span>
              <span>{payment.chequeNumber}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-medium">{formatCurrency(payment.amount)}</span>
          </div>
          {payment.lateChargesPaid > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Late Charges:</span>
              <span>{formatCurrency(payment.lateChargesPaid)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="font-bold">{formatCurrency(totalPaid)}</span>
          </div>
        </div>
      </div>
      
      <div className="pb-4 mb-4">
        <h3 className="font-medium mb-2">Fee Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Academic Year:</span>
            <span>{studentFee.academicYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fee Period:</span>
            <span>
              {studentFee.billType === 'MONTHLY' && studentFee.billMonth 
                ? `Month ${studentFee.billMonth}` 
                : studentFee.billType === 'QUARTERLY' && studentFee.quarter 
                ? `Quarter ${studentFee.quarter}` 
                : studentFee.billType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Fee Amount:</span>
            <span>{formatCurrency(studentFee.totalAmount)}</span>
          </div>
          {studentFee.totalDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Total Discount:</span>
              <span>{formatCurrency(studentFee.totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600">Previous Balance:</span>
            <span>{formatCurrency(studentFee.dueAmount + payment.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="text-green-600">{formatCurrency(payment.amount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-gray-600 font-medium">Remaining Balance:</span>
            <span className="font-bold">{formatCurrency(studentFee.dueAmount)}</span>
          </div>
        </div>
      </div>
      
      {payment.remarks && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-1">Remarks:</h3>
          <p className="text-gray-700">{payment.remarks}</p>
        </div>
      )}
      
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>This is a computer-generated receipt and does not require a signature.</p>
      </div>
    </div>
  );
}
