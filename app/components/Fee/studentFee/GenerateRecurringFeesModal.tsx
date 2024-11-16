import { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { getMonthName } from "~/types/studentFee";

interface GenerateRecurringFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RecurringFeeData) => void;
  currentFilters: {
    academicYear: string;
    month?: number;
  };
  isLoading: boolean;
  classesRequiringSelection?: ClassSelection[];
}

export interface RecurringFeeData {
  academicYear: string;
  month?: number;
  quarter?: number;
  billType: 'MONTHLY' | 'QUARTERLY';
  feeStructureSelections?: Record<string, string>;
}

export interface ClassSelection {
  classId: string;
  className: string;
  availableStructures: Array<{ id: string; description: string }>;
}

export function GenerateRecurringFeesModal({
  isOpen,
  onClose,
  onConfirm,
  currentFilters,
  isLoading,
  classesRequiringSelection
}: GenerateRecurringFeesModalProps) {
  const [billType, setBillType] = useState<'MONTHLY' | 'QUARTERLY'>('MONTHLY');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [feeStructureSelections, setFeeStructureSelections] = useState<Record<string, string>>({});

  // Calculate next month based on current filter
  useEffect(() => {
    if (currentFilters.month) {
      const nextMonth = currentFilters.month === 12 ? 1 : currentFilters.month + 1;
      setSelectedMonth(nextMonth);
    } else {
      // If no month filter, use next month from today
      const today = new Date();
      const nextMonth = today.getMonth() + 2; // getMonth() is 0-indexed, so +2 gives next month
      setSelectedMonth(nextMonth > 12 ? 1 : nextMonth);
    }
  }, [currentFilters.month, isOpen]);

  const handleSubmit = () => {
    if (!currentFilters.academicYear) {
      return;
    }

    const data: RecurringFeeData = {
      academicYear: currentFilters.academicYear,
      billType
    };

    if (billType === 'MONTHLY') {
      data.month = selectedMonth;
    } else {
      data.quarter = selectedQuarter;
    }

    if (classesRequiringSelection && classesRequiringSelection.length > 0) {
      data.feeStructureSelections = feeStructureSelections;
    }

    onConfirm(data);
  };

  const canGenerate = currentFilters.academicYear &&
    (billType === 'MONTHLY' ? selectedMonth > 0 : selectedQuarter > 0) &&
    (!classesRequiringSelection || classesRequiringSelection.length === 0 ||
     classesRequiringSelection.every(cls => feeStructureSelections[cls.classId]));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Recurring Fees"
      size="md"
    >
      <div className="space-y-4">
        {/* Warning if no academic year selected */}
        {!currentFilters.academicYear && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Please select an Academic Year from the filters above before generating recurring fees.
            </p>
          </div>
        )}

        {/* Academic Year Display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
            {currentFilters.academicYear || 'Not selected'}
          </div>
        </div>

        {/* Bill Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bill Type
          </label>
          <select
            value={billType}
            onChange={(e) => setBillType(e.target.value as 'MONTHLY' | 'QUARTERLY')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
          </select>
        </div>

        {/* Month/Quarter Selector based on Bill Type */}
        {billType === 'MONTHLY' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            {currentFilters.month && selectedMonth === (currentFilters.month === 12 ? 1 : currentFilters.month + 1) && (
              <p className="mt-1 text-xs text-blue-600">
                💡 Auto-selected next month from current filter
              </p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quarter
            </label>
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Q1 (Apr-Jun)</option>
              <option value={2}>Q2 (Jul-Sep)</option>
              <option value={3}>Q3 (Oct-Dec)</option>
              <option value={4}>Q4 (Jan-Mar)</option>
            </select>
          </div>
        )}

        {/* Fee Structure Selection (Advanced Mode) */}
        {classesRequiringSelection && classesRequiringSelection.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Fee Structures
            </label>
            <p className="text-xs text-yellow-700 mb-3">
              ⚠️ Multiple fee structures found for the following classes. Please select one for each:
            </p>
            <div className="space-y-3">
              {classesRequiringSelection.map((cls) => (
                <div key={cls.classId}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {cls.className}
                  </label>
                  <select
                    value={feeStructureSelections[cls.classId] || ''}
                    onChange={(e) =>
                      setFeeStructureSelections({
                        ...feeStructureSelections,
                        [cls.classId]: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select fee structure</option>
                    {cls.availableStructures.map((structure) => (
                      <option key={structure.id} value={structure.id}>
                        {structure.description}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ What will happen:</strong>
          </p>
          <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
            <li>Fees will be generated for all students with active fee structures</li>
            <li>Existing fees for the selected period will be skipped</li>
            <li>Automatic discounts will be applied if applicable</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canGenerate || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Fees'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
