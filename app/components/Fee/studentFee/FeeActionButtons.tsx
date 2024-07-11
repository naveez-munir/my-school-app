interface FeeActionButtonsProps {
  onCalculateLateFees: () => void;
  onUpdateFeeStatuses: () => void;
  onGenerateRecurring: () => void;
  isCalculating: boolean;
  isUpdating: boolean;
  isGeneratingRecurring: boolean;
}

export function FeeActionButtons({
  onCalculateLateFees,
  onUpdateFeeStatuses,
  onGenerateRecurring,
  isCalculating,
  isUpdating,
  isGeneratingRecurring
}: FeeActionButtonsProps) {
  return (
    <div className="flex flex-col h-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Operations
      </label>
      <div className="flex flex-wrap gap-2 items-center mt-1">
        <button
          onClick={onCalculateLateFees}
          disabled={isCalculating}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            isCalculating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Late Fees'}
        </button>

        <button
          onClick={onUpdateFeeStatuses}
          disabled={isUpdating}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            isUpdating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
        >
          {isUpdating ? 'Updating...' : 'Update Fee Statuses'}
        </button>

        <button
          onClick={onGenerateRecurring}
          disabled={isGeneratingRecurring}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            isGeneratingRecurring
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {isGeneratingRecurring ? 'Generating...' : 'Generate Recurring Fees'}
        </button>
      </div>
    </div>
  );
}
