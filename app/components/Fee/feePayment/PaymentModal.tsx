import type { CreateFeePaymentInput } from "~/types/studentFee";
import { FeePaymentForm } from "./FeePaymentForm";
import { useCreateFeePayment } from "~/hooks/useFeePaymentQueries";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentFeeId: string;
  studentId: string;
  dueAmount: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  studentFeeId,
  studentId,
  dueAmount,
}: PaymentModalProps) {
  const createPaymentMutation = useCreateFeePayment();

  const handleSubmit = async (data: CreateFeePaymentInput) => {
    try {
      await createPaymentMutation.mutateAsync(data);
      onClose();
    } catch (err) {
      console.error("Error creating payment:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-md border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4">Record Fee Payment</h3>
        
        <FeePaymentForm
          studentFeeId={studentFeeId}
          studentId={studentId}
          dueAmount={dueAmount}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={createPaymentMutation.isPending}
        />
      </div>
    </div>
  );
}
