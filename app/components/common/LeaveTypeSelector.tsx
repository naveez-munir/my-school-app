import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { LeaveType } from '~/types/staffLeave';

type TypeValue = LeaveType | 'all';

interface TypeOption {
  value: TypeValue;
  label: string;
}

interface LeaveTypeSelectorProps {
  value?: TypeValue;
  onChange: (type: TypeValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function LeaveTypeSelector({
  value,
  onChange,
  label = 'Leave Type',
  required = false,
  placeholder = 'Select leave type',
  disabled = false,
  className = '',
  includeAll = false
}: LeaveTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<TypeOption | null>(null);

  const typeOptions: Record<TypeValue, string> = {
    'all': 'All Types',
    [LeaveType.SICK]: 'Sick Leave',
    [LeaveType.CASUAL]: 'Casual Leave',
    [LeaveType.EARNED]: 'Earned Leave',
    [LeaveType.MATERNITY]: 'Maternity Leave',
    [LeaveType.PATERNITY]: 'Paternity Leave',
    [LeaveType.UNPAID]: 'Unpaid Leave',
    [LeaveType.OTHER]: 'Other'
  };

  const options = useMemo(() => {
    return Object.entries(typeOptions)
      .filter(([key]) => includeAll || key !== 'all')
      .map(([value, label]) => ({
        value: value as TypeValue,
        label
      }));
  }, [includeAll]);

  useEffect(() => {
    if (value) {
      const matchingType = options.find(t => t.value === value);
      setSelectedType(matchingType || null);
    } else {
      setSelectedType(null);
    }
  }, [value, options]);

  const handleTypeChange = (selected: TypeOption | null) => {
    setSelectedType(selected);
    if (selected) {
      onChange(selected.value);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      <GenericCombobox<TypeOption>
        items={options}
        value={selectedType}
        onChange={handleTypeChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

