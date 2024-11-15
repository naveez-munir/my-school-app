import { useState } from "react";
import { TextInput } from "~/components/common/form/inputs/TextInput";
import { FormActions } from "~/components/common/form/FormActions";

interface CancelFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting?: boolean;
}

export function CancelFeeModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: CancelFeeModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      <div className="bg-white rounded-lg p-6 w-full max-w-md border-1 border-gray-200 z-10 relative">
        <h3 className="text-lg font-medium mb-4 text-red-600">Cancel Fee</h3>

        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to cancel this fee? This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Cancellation Reason"
            value={reason}
            onChange={setReason}
            required
            disabled={isSubmitting}
            placeholder="Provide a reason for cancellation"
          />

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Cancelling..." : "Cancel Fee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
