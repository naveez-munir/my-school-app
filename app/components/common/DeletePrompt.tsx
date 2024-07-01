import type { FC } from "react";

interface DeletePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeletePrompt: FC<DeletePromptProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 w-full max-w-[90%] sm:max-w-sm lg:max-w-md mx-3 sm:mx-auto z-10 relative">
        <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-3 sm:mb-4 lg:mb-5">
          Delete {itemName ? itemName : "Item"}?
        </h3>

        <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-5">
          Are you sure you want to delete this {itemName ? itemName : "item"}? This action cannot be undone.
        </p>

        <div className="mt-4 sm:mt-5 lg:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 lg:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-xs sm:text-sm lg:text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;



