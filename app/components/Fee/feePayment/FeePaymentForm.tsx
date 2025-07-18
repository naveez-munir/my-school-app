import { useEffect, useState } from "react";
import { 
  type CreateFeePaymentInput, 
  PaymentMode, 
  formatCurrency 
} from "~/types/studentFee";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { SelectInput } from "~/components/common/form/inputs/SelectInput";
import { FormActions } from "~/components/common/form/FormActions";

interface FeePaymentFormProps {
  studentFeeId: string;
  studentId: string;
  dueAmount: number;
  onSubmit: (data: CreateFeePaymentInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function FeePaymentForm({
  studentFeeId,
  studentId,
  dueAmount,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: FeePaymentFormProps) {
  const [formData, setFormData] = useState<{
    studentFeeId: string;
    studentId: string;
    paymentMode: PaymentMode;
    amount: number;
    paymentDate: string;
    lateChargesPaid: number;
    transactionId?: string;
    chequeNumber?: string;
    bankDetails?: string;
    remarks?: string;
  }>({
    studentFeeId: "",
    studentId: "",
    paymentMode: PaymentMode.CASH,
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    lateChargesPaid: 0,
    transactionId: "",
    chequeNumber: "",
    bankDetails: "",
    remarks: "",
  });

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  useEffect(() => {
    setFormData({
      studentFeeId,
      studentId,
      paymentMode: PaymentMode.CASH,
      amount: dueAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      lateChargesPaid: 0,
      transactionId: "",
      chequeNumber: "",
      bankDetails: "",
      remarks: "",
    });
  }, [studentFeeId, studentId, dueAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: CreateFeePaymentInput = {
      ...formData,
      paymentDate: new Date(formData.paymentDate),
    };

    onSubmit(payload);
  };

  const paymentModeOptions = {
    [PaymentMode.CASH]: "Cash",
    [PaymentMode.CHEQUE]: "Cheque",
    [PaymentMode.BANK_TRANSFER]: "Bank Transfer",
    [PaymentMode.ONLINE]: "Online Payment",
    [PaymentMode.OTHER]: "Other",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <p className="text-blue-700 text-sm font-medium">
          Due Amount: {formatCurrency(dueAmount)}
        </p>
      </div>

      <SelectInput
        label="Payment Mode"
        value={formData.paymentMode}
        options={paymentModeOptions}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, paymentMode: value as PaymentMode }))
        }
        required
        disabled={isSubmitting}
      />

      <TextInput
        label="Amount"
        value={formData.amount.toString()}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, amount: Number(value) }))
        }
        type="number"
        required
        disabled={isSubmitting}
      />

      <TextInput
        label="Payment Date"
        value={formData.paymentDate}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, paymentDate: value }))
        }
        type="date"
        required
        disabled={isSubmitting}
      />

      <TextInput
        label="Late Charges Paid"
        value={formData.lateChargesPaid.toString()}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, lateChargesPaid: Number(value) }))
        }
        type="number"
        disabled={isSubmitting}
      />

      {formData.paymentMode === PaymentMode.CHEQUE && (
        <TextInput
          label="Cheque Number"
          value={formData.chequeNumber || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, chequeNumber: value }))
          }
          required
          disabled={isSubmitting}
        />
      )}

      {(formData.paymentMode === PaymentMode.BANK_TRANSFER || 
        formData.paymentMode === PaymentMode.ONLINE) && (
        <TextInput
          label="Transaction ID"
          value={formData.transactionId || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, transactionId: value }))
          }
          required
          disabled={isSubmitting}
        />
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowAdditionalFields(!showAdditionalFields)}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          {showAdditionalFields ? "Hide Additional Fields" : "Show Additional Fields"}
        </button>
      </div>

      {showAdditionalFields && (
        <>
          {(formData.paymentMode === PaymentMode.BANK_TRANSFER ||
            formData.paymentMode === PaymentMode.ONLINE) && (
            <TextInput
              label="Bank Details"
              value={formData.bankDetails || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, bankDetails: value }))
              }
              disabled={isSubmitting}
            />
          )}

          <TextInput
            label="Remarks"
            value={formData.remarks || ""}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, remarks: value }))
            }
            type="text"
            disabled={isSubmitting}
          />
        </>
      )}

      <div className="mt-6">
        <FormActions
          mode="create"
          entityName="Fee Payment"
          onCancel={onCancel}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}
