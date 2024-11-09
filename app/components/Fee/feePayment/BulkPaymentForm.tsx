import { useState, useEffect } from "react";
import { 
  type BulkFeePaymentInput, 
  type CreateFeePaymentInput,
  PaymentMode, 
  formatCurrency 
} from "~/types/studentFee";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormActions } from "~/components/common/form/FormActions";
import { Trash2 } from "lucide-react";

interface StudentFeePayment {
  studentFeeId: string;
  studentId: string;
  studentName: string;
  dueAmount: number;
  amount: number;
}

interface BulkPaymentFormProps {
  studentFeePayments: StudentFeePayment[];
  onSubmit: (data: BulkFeePaymentInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BulkPaymentForm({
  studentFeePayments,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BulkPaymentFormProps) {
  const [commonData, setCommonData] = useState({
    paymentMode: PaymentMode.CASH,
    paymentDate: new Date().toISOString().split('T')[0],
    transactionId: "",
    chequeNumber: "",
    bankDetails: "",
    remarks: "",
  });

  const [paymentEntries, setPaymentEntries] = useState<Array<StudentFeePayment & { include: boolean }>>([]);

  useEffect(() => {
    // Initialize payment entries when studentFeePayments change
    setPaymentEntries(
      studentFeePayments.map(payment => ({
        ...payment,
        include: true,
      }))
    );
  }, [studentFeePayments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPayments = paymentEntries.filter(entry => entry.include);
    
    // Create payment entries
    const payments: CreateFeePaymentInput[] = selectedPayments.map(entry => ({
      studentFeeId: entry.studentFeeId,
      studentId: entry.studentId,
      paymentMode: commonData.paymentMode,
      amount: entry.amount,
      paymentDate: new Date(commonData.paymentDate),
      transactionId: commonData.transactionId || undefined,
      chequeNumber: commonData.chequeNumber || undefined,
      bankDetails: commonData.bankDetails || undefined,
      remarks: commonData.remarks || undefined,
    }));
    
    onSubmit({ payments });
  };

  const paymentModeOptions = {
    [PaymentMode.CASH]: "Cash",
    [PaymentMode.CHEQUE]: "Cheque",
    [PaymentMode.BANK_TRANSFER]: "Bank Transfer",
    [PaymentMode.ONLINE]: "Online Payment",
    [PaymentMode.OTHER]: "Other",
  };

  const totalSelected = paymentEntries.filter(entry => entry.include).length;
  const totalAmount = paymentEntries
    .filter(entry => entry.include)
    .reduce((sum, entry) => sum + entry.amount, 0);

  const toggleInclude = (index: number) => {
    setPaymentEntries(prev => 
      prev.map((entry, i) => 
        i === index ? { ...entry, include: !entry.include } : entry
      )
    );
  };

  const updateAmount = (index: number, amount: number) => {
    setPaymentEntries(prev => 
      prev.map((entry, i) => 
        i === index ? { ...entry, amount } : entry
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-700 text-sm font-medium">
              Selected: {totalSelected} of {studentFeePayments.length} students
            </p>
            <p className="text-blue-700 font-medium">
              Total Amount: {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-4">Common Payment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="Payment Mode"
            value={commonData.paymentMode}
            options={paymentModeOptions}
            onChange={(value) =>
              setCommonData((prev) => ({ ...prev, paymentMode: value as PaymentMode }))
            }
            required
            disabled={isSubmitting}
          />

          <TextInput
            label="Payment Date"
            value={commonData.paymentDate}
            onChange={(value) =>
              setCommonData((prev) => ({ ...prev, paymentDate: value }))
            }
            type="date"
            required
            disabled={isSubmitting}
          />

          {commonData.paymentMode === PaymentMode.CHEQUE && (
            <TextInput
              label="Cheque Number"
              value={commonData.chequeNumber}
              onChange={(value) =>
                setCommonData((prev) => ({ ...prev, chequeNumber: value }))
              }
              required
              disabled={isSubmitting}
            />
          )}

          {(commonData.paymentMode === PaymentMode.BANK_TRANSFER || 
            commonData.paymentMode === PaymentMode.ONLINE) && (
            <>
              <TextInput
                label="Transaction ID"
                value={commonData.transactionId}
                onChange={(value) =>
                  setCommonData((prev) => ({ ...prev, transactionId: value }))
                }
                required
                disabled={isSubmitting}
              />
              
              <TextInput
                label="Bank Details"
                value={commonData.bankDetails}
                onChange={(value) =>
                  setCommonData((prev) => ({ ...prev, bankDetails: value }))
                }
                disabled={isSubmitting}
              />
            </>
          )}

          <div className="md:col-span-2">
            <TextInput
              label="Remarks"
              value={commonData.remarks}
              onChange={(value) =>
                setCommonData((prev) => ({ ...prev, remarks: value }))
              }
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h3 className="font-medium p-4 border-b">Student Fee Payments</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Include
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentEntries.map((entry, index) => (
                <tr key={entry.studentFeeId} className={entry.include ? "" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={entry.include}
                      onChange={() => toggleInclude(index)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{entry.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(entry.dueAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.amount}
                      onChange={(e) => updateAmount(index, Number(e.target.value))}
                      disabled={!entry.include || isSubmitting}
                      className="w-24 rounded-md border border-gray-300 px-3 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <FormActions
          mode="create"
          entityName="Bulk Payment"
          onCancel={onCancel}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}
