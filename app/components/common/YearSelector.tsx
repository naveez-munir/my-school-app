import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';

interface YearOption {
  value: number;
  label: string;
}

interface YearSelectorProps {
  value?: number;
  onChange: (year: number) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  range?: { start: number; end: number };
}

export function YearSelector({
  value,
  onChange,
  label = 'Year',
  required = false,
  placeholder = 'Select year',
  disabled = false,
  className = '',
  range = {
    start: new Date().getFullYear() - 5,
    end: new Date().getFullYear() + 5
  }
}: YearSelectorProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption | null>(null);

  const years = useMemo(() => {
    return Array.from(
      { length: range.end - range.start + 1 },
      (_, i) => {
        const yearValue = range.start + i;
        return { value: yearValue, label: yearValue.toString() };
      }
    );
  }, [range.start, range.end]);

  useEffect(() => {
    if (value) {
      const matchingYear = years.find(y => y.value === value);
      setSelectedYear(matchingYear || null);
    } else {
      setSelectedYear(null);
    }
  }, [value, years]);

  const handleYearChange = (selected: YearOption | null) => {
    setSelectedYear(selected);
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

      <GenericCombobox<YearOption>
        items={years}
        value={selectedYear}
        onChange={handleYearChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        // disabled={disabled}
      />
    </div>
  );
}
