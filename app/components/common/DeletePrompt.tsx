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
      
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto z-10 relative">
        <h3 className="text-lg font-medium mb-4">
          Delete {itemName ? itemName : "Item"}?
        </h3>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this {itemName ? itemName : "item"}? This action cannot be undone.
        </p>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;



