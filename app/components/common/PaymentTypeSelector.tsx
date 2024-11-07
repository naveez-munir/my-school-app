import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { PaymentType } from '~/types/payment.types';

type TypeValue = PaymentType | 'all';

interface TypeOption {
  value: TypeValue;
  label: string;
}

interface PaymentTypeSelectorProps {
  value?: TypeValue;
  onChange: (type: TypeValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function PaymentTypeSelector({
  value,
  onChange,
  label = 'Payment Type',
  required = false,
  placeholder = 'Select type',
  disabled = false,
  className = '',
  includeAll = false
}: PaymentTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<TypeOption | null>(null);

  const typeOptions: Record<TypeValue, string> = {
    'all': 'All Types',
    [PaymentType.STUDENT_FEE]: 'Student Fee',
    [PaymentType.SALARY]: 'Salary',
    [PaymentType.EXPENSE]: 'Expense',
    [PaymentType.OTHER_INCOME]: 'Other Income'
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

