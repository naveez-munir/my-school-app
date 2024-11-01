import { Modal } from "~/components/common/Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  warningMessage?: string;
  confirmButtonText?: string;
  confirmButtonVariant?: 'danger' | 'primary' | 'success';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warningMessage,
  confirmButtonText = "Confirm",
  confirmButtonVariant = 'primary',
  isLoading = false
}: ConfirmationModalProps) {
  const buttonClasses = {
    danger: 'bg-red-600 hover:bg-red-700',
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">
          {message}
        </p>

        {warningMessage && (
          <p className="text-xs sm:text-sm lg:text-base text-red-600 font-medium">
            {warningMessage}
          </p>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-5 lg:mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-white rounded-md disabled:opacity-50 transition-colors ${buttonClasses[confirmButtonVariant]}`}
          >
            {isLoading ? "Processing..." : confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
