import type { FormActionsProps } from "~/types/commonTypes";

export const FormActions = ({
  onCancel = () => window.history.back(),
  onSubmit,
  isLoading = false,
  mode = 'create',
  submitText,
  cancelText = 'Cancel',
  loadingText = 'Saving...',
  entityName = 'Item'
}: FormActionsProps) => {
  const defaultSubmitText = mode === 'edit' ? `Update ${entityName}` : `Create ${entityName}`;
  const finalSubmitText = submitText || defaultSubmitText;

  return (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isLoading}
        {...(onSubmit && { onClick: onSubmit })}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? loadingText : finalSubmitText}
      </button>
    </div>
  );
};
