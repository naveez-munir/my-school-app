import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import type { ExamType } from '~/types/exam';

interface ExamTypeOption {
  id: string;
  name: string;
}

interface ExamTypeSelectorProps {
  examTypes: ExamType[];
  value?: string;
  onChange: (examTypeId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ExamTypeSelector({
  examTypes,
  value = '',
  onChange,
  label = 'Exam Type',
  required = false,
  placeholder = 'All Types',
  disabled = false,
  className = '',
}: ExamTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ExamTypeOption | null>(null);

  const typeOptions: ExamTypeOption[] = examTypes.map(type => ({
    id: type.id,
    name: type.name
  }));

  useEffect(() => {
    if (value) {
      const matchingType = typeOptions.find(t => t.id === value);
      setSelectedType(matchingType || null);
    } else {
      setSelectedType(null);
    }
  }, [value, examTypes]);

  const handleTypeChange = (selected: ExamTypeOption | null) => {
    setSelectedType(selected);
    onChange(selected ? selected.id : '');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      <GenericCombobox<ExamTypeOption>
        items={typeOptions}
        value={selectedType}
        onChange={handleTypeChange}
        displayKey="name"
        valueKey="id"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

