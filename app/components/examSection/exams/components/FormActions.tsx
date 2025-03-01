import React from 'react';

interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isEditMode,
  isSubmitting,
  isValid,
  onCancel
}) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 
          'Saving...' : 
          (isEditMode ? 'Update Exam' : 'Create Exam')
        }
      </button>
    </div>
  );
};

export default FormActions;
