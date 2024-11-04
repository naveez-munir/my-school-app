import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';

type StatusValue = 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared' | 'all';

interface StatusOption {
  value: StatusValue;
  label: string;
}

interface ExamStatusSelectorProps {
  value?: StatusValue;
  onChange: (status: StatusValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function ExamStatusSelector({
  value,
  onChange,
  label = 'Exam Status',
  required = false,
  placeholder = 'Select status',
  disabled = false,
  className = '',
  includeAll = false
}: ExamStatusSelectorProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusOption | null>(null);

  const statusOptions: Record<StatusValue, string> = {
    'all': 'All Statuses',
    'Scheduled': 'Scheduled',
    'Ongoing': 'Ongoing',
    'Completed': 'Completed',
    'ResultDeclared': 'Result Declared'
  };

  const options = useMemo(() => {
    return Object.entries(statusOptions)
      .filter(([key]) => includeAll || key !== 'all')
      .map(([value, label]) => ({
        value: value as StatusValue,
        label
      }));
  }, [includeAll]);

  useEffect(() => {
    if (value) {
      const matchingStatus = options.find(s => s.value === value);
      setSelectedStatus(matchingStatus || null);
    } else {
      setSelectedStatus(null);
    }
  }, [value, options]);

  const handleStatusChange = (selected: StatusOption | null) => {
    setSelectedStatus(selected);
    if (selected) {
      onChange(selected.value);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      <GenericCombobox<StatusOption>
        items={options}
        value={selectedStatus}
        onChange={handleStatusChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
