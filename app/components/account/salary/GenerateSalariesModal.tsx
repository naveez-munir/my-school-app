import { Modal } from "~/components/common/Modal";
import { EmployeeType } from "~/types/salary.types";
import { months } from "~/utils/studentFeeData";

interface GenerateSalariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  month: number;
  year: number;
  employeeType: EmployeeType | 'all';
  isGenerating?: boolean;
}

const MONTH_NAMES = months

export function GenerateSalariesModal({
  isOpen,
  onClose,
  onConfirm,
  month,
  year,
  employeeType,
  isGenerating = false
}: GenerateSalariesModalProps) {
  const monthName = MONTH_NAMES[month - 1];
  const employeeTypeText = employeeType === 'all' ? 'All Employees' : employeeType;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Salaries" size="md">
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-gray-600">
          Are you sure you want to generate salaries for the following period?
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Period:</span>
            <span className="text-xs sm:text-sm text-gray-900">{monthName} {year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Employee Type:</span>
            <span className="text-xs sm:text-sm text-gray-900">{employeeTypeText}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-amber-600">
          This will generate salary records for all eligible employees based on their salary structures.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isGenerating}
            className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Generate Salaries"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
