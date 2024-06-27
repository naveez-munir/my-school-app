import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { EmployeeType } from '~/types/salary.types';

type EmployeeTypeValue = EmployeeType | 'all';

interface EmployeeTypeOption {
  value: EmployeeTypeValue;
  label: string;
}

interface EmployeeTypeSelectorProps {
  value?: EmployeeTypeValue;
  onChange: (employeeType: EmployeeTypeValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function EmployeeTypeSelector({
  value,
  onChange,
  label = 'Employee Type',
  required = false,
  placeholder = 'Select employee type',
  disabled = false,
  className = '',
  includeAll = false
}: EmployeeTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<EmployeeTypeOption | null>(null);

  // Define options directly
  const employeeTypeOptions: Record<EmployeeTypeValue, string> = {
    'all': 'All Types',
    [EmployeeType.TEACHER]: 'Teacher',
    [EmployeeType.STAFF]: 'Staff'
  };

  const options = useMemo(() => {
    return Object.entries(employeeTypeOptions)
      .filter(([key]) => includeAll || key !== 'all')
      .map(([value, label]) => ({
        value: value as EmployeeTypeValue,
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

  const handleTypeChange = (selected: EmployeeTypeOption | null) => {
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

      <GenericCombobox<EmployeeTypeOption>
        items={options}
        value={selectedType}
        onChange={handleTypeChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        // disabled={disabled}
      />
    </div>
  );
}
