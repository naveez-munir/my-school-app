import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { PaymentFor } from '~/types/payment.types';

type ForValue = PaymentFor | 'all';

interface ForOption {
  value: ForValue;
  label: string;
}

interface PaymentForSelectorProps {
  value?: ForValue;
  onChange: (paymentFor: ForValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function PaymentForSelector({
  value,
  onChange,
  label = 'Payment For',
  required = false,
  placeholder = 'Select reference',
  disabled = false,
  className = '',
  includeAll = false
}: PaymentForSelectorProps) {
  const [selectedFor, setSelectedFor] = useState<ForOption | null>(null);

  const forOptions: Record<ForValue, string> = {
    'all': 'All References',
    [PaymentFor.STUDENT_FEE]: 'Student Fee',
    [PaymentFor.SALARY]: 'Salary',
    [PaymentFor.EXPENSE]: 'Expense'
  };

  const options = useMemo(() => {
    return Object.entries(forOptions)
      .filter(([key]) => includeAll || key !== 'all')
      .map(([value, label]) => ({
        value: value as ForValue,
        label
      }));
  }, [includeAll]);

  useEffect(() => {
    if (value) {
      const matchingFor = options.find(f => f.value === value);
      setSelectedFor(matchingFor || null);
    } else {
      setSelectedFor(null);
    }
  }, [value, options]);

  const handleForChange = (selected: ForOption | null) => {
    setSelectedFor(selected);
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

      <GenericCombobox<ForOption>
        items={options}
        value={selectedFor}
        onChange={handleForChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

