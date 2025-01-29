export interface FormStepActionsProps {
  onBack?: () => void;
  onNext?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  className?: string;
}

/**
 * Reusable form step navigation buttons for multi-step forms
 * Handles Back/Next/Submit button rendering with consistent styling
 */
export function FormStepActions({
  onBack,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  isSubmitting = false,
  isDisabled = false,
  backLabel = 'Back',
  nextLabel = 'Next',
  submitLabel = 'Submit',
  showBack = true,
  showNext = true,
  className = ''
}: FormStepActionsProps) {
  const handleBack = () => {
    if (onBack && !isSubmitting) {
      onBack();
    }
  };

  const handleNext = () => {
    if (onNext && !isSubmitting && !isDisabled) {
      onNext();
    }
  };

  // Determine button label based on step position
  const getActionLabel = () => {
    if (isLastStep) return submitLabel;
    return nextLabel;
  };

  return (
    <div className={`flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-5 lg:pt-6 border-t ${className}`}>
      {/* Back Button - Hidden on first step or if showBack is false */}
      {!isFirstStep && showBack && (
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-xs sm:text-sm text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {backLabel}
        </button>
      )}

      {/* Next/Submit Button - Hidden if showNext is false */}
      {showNext && (
        <button
          type="submit"
          disabled={isSubmitting || isDisabled}
          onClick={onNext}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm cursor-pointer ${
            isSubmitting || isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Processing...' : getActionLabel()}
        </button>
      )}
    </div>
  );
}

