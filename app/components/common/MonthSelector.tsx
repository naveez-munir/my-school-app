import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';

interface MonthOption {
  value: number;
  label: string;
}

interface MonthSelectorProps {
  value?: number;
  onChange: (month: number) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const months: MonthOption[] = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export function MonthSelector({
  value,
  onChange,
  label = 'Month',
  required = false,
  placeholder = 'Select month',
  disabled = false,
  className = ''
}: MonthSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState<MonthOption | null>(null);

  useEffect(() => {
    if (value) {
      const matchingMonth = months.find(m => m.value === value);
      setSelectedMonth(matchingMonth || null);
    } else {
      setSelectedMonth(null);
    }
  }, [value]);

  const handleMonthChange = (selected: MonthOption | null) => {
    setSelectedMonth(selected);
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

      <GenericCombobox<MonthOption>
        items={months}
        value={selectedMonth}
        onChange={handleMonthChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
      />
    </div>
  );
}
