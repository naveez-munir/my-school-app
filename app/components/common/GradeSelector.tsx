import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useGradeLevels } from '~/hooks/useTenantSettings';
import type { GradeLevel } from '~/services/tenantSettingsApi';

interface GradeSelectorProps {
  value?: string;
  onChange: (gradeCode: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function GradeSelector({
  value = '',
  onChange,
  label = 'Grade Level',
  required = false,
  placeholder = 'Select grade level',
  className = '',
  disabled = false,
}: GradeSelectorProps) {
  const { data: gradeLevels = [], isLoading: loading } = useGradeLevels();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);

  const activeGrades = gradeLevels
    .filter(grade => grade.isActive)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (value && gradeLevels.length > 0) {
      const matchingGrade = gradeLevels.find(g => g.code === value);
      setSelectedGrade(matchingGrade || null);
    } else {
      setSelectedGrade(null);
    }
  }, [value, gradeLevels]);

  const handleGradeChange = (selected: GradeLevel | null) => {
    setSelectedGrade(selected);
    onChange(selected ? selected.code : '');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      {loading ? (
        <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 h-10 animate-pulse"></div>
      ) : (
        <GenericCombobox<GradeLevel>
          items={activeGrades}
          value={selectedGrade}
          onChange={handleGradeChange}
          displayKey="label"
          valueKey="code"
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  );
}
