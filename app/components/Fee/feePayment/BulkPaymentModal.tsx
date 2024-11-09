import type { BulkFeePaymentInput } from "~/types/studentFee";
import { BulkPaymentForm } from "./BulkPaymentForm";
import { useCreateBulkPayments } from "~/hooks/useFeePaymentQueries";
import toast from "react-hot-toast";

interface StudentFeePayment {
  studentFeeId: string;
  studentId: string;
  studentName: string;
  dueAmount: number;
  amount: number;
}

interface BulkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentFeePayments: StudentFeePayment[];
}

export function BulkPaymentModal({
  isOpen,
  onClose,
  studentFeePayments,
}: BulkPaymentModalProps) {
  const createBulkPaymentsMutation = useCreateBulkPayments();

  const handleSubmit = async (data: BulkFeePaymentInput) => {
    try {
      const result = await createBulkPaymentsMutation.mutateAsync(data);
      toast.success(`Successfully processed ${result.summary.successful} payments!`);
      if (result.summary.failed > 0) {
        toast.error(`${result.summary.failed} payments failed`);
      }
      onClose();
    } catch (err: any) {
      console.error("Error creating bulk payments:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to process bulk payments";
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-4xl border-1 border-gray-200 z-10 relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Bulk Payment Processing</h3>
        
        <BulkPaymentForm
          studentFeePayments={studentFeePayments}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={createBulkPaymentsMutation.isPending}
        />
      </div>
    </div>
  );
}
