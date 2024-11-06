import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { PaymentMode } from '~/types/payment.types';

type ModeValue = PaymentMode | 'all';

interface ModeOption {
  value: ModeValue;
  label: string;
}

interface PaymentModeSelectorProps {
  value?: ModeValue;
  onChange: (mode: ModeValue) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAll?: boolean;
}

export function PaymentModeSelector({
  value,
  onChange,
  label = 'Payment Mode',
  required = false,
  placeholder = 'Select mode',
  disabled = false,
  className = '',
  includeAll = false
}: PaymentModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<ModeOption | null>(null);

  const modeOptions: Record<ModeValue, string> = {
    'all': 'All Modes',
    [PaymentMode.CASH]: 'Cash',
    [PaymentMode.CHEQUE]: 'Cheque',
    [PaymentMode.BANK_TRANSFER]: 'Bank Transfer',
    [PaymentMode.ONLINE]: 'Online Payment'
  };

  const options = useMemo(() => {
    return Object.entries(modeOptions)
      .filter(([key]) => includeAll || key !== 'all')
      .map(([value, label]) => ({
        value: value as ModeValue,
        label
      }));
  }, [includeAll]);

  useEffect(() => {
    if (value) {
      const matchingMode = options.find(m => m.value === value);
      setSelectedMode(matchingMode || null);
    } else {
      setSelectedMode(null);
    }
  }, [value, options]);

  const handleModeChange = (selected: ModeOption | null) => {
    setSelectedMode(selected);
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

      <GenericCombobox<ModeOption>
        items={options}
        value={selectedMode}
        onChange={handleModeChange}
        displayKey="label"
        valueKey="value"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

