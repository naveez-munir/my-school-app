import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useClasses } from '~/hooks/useClassQueries';
import type { ClassResponse } from '~/types/class';

interface ClassSelectorProps {
  value?: string;
  onChange: (classId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showOnlyAvailable?: boolean;
  excludeClassId?: string;
  error?: string;
}

type ClassWithDisplay = ClassResponse & { displayName: string };

export function ClassSelector({
  value = '',
  onChange,
  label = 'Class',
  required = false,
  placeholder = 'Select or enter class',
  className = '',
  disabled = false,
  showOnlyAvailable = false,
  excludeClassId,
  error
}: ClassSelectorProps) {
  const { data: classes = [], isLoading: loading } = useClasses();
  const [selectedClass, setSelectedClass] = useState<ClassWithDisplay | null>(null)

  const extractGradeNumber = (gradeLevel: string): number => {
    const match = gradeLevel?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 999;
  };

  const processedClasses = useMemo(() => {
    const filteredClasses = showOnlyAvailable
      ? classes.filter(cls =>
          !cls.classTeacher ||
          cls.id === value ||
          cls.id === excludeClassId
        )
      : classes;

    return filteredClasses
      .map(cls => ({
        ...cls,
        displayName: `${cls.className} - ${cls.classSection}`
      }))
      .sort((a, b) => {
        const gradeA = extractGradeNumber(a.classGradeLevel);
        const gradeB = extractGradeNumber(b.classGradeLevel);
        if (gradeA !== gradeB) {
          return gradeA - gradeB;
        }
        return a.classSection.localeCompare(b.classSection);
      });
  }, [classes, showOnlyAvailable, value, excludeClassId]);
  useEffect(() => {
    if (value && processedClasses.length > 0) {
      const matchingClass = processedClasses.find(c => c.id === value);
      setSelectedClass(matchingClass || null);
    } else {
      setSelectedClass(null);
    }
  }, [value, processedClasses]);

  const handleClassChange = (selected: ClassWithDisplay | null) => {
    setSelectedClass(selected);
    onChange(selected ? selected.id : '');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      {loading ? (
        <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 h-[34px] sm:h-[38px] animate-pulse"></div>
      ) : (
        <GenericCombobox<ClassWithDisplay>
          items={processedClasses}
          value={selectedClass}
          onChange={handleClassChange}
          displayKey="displayName"
          valueKey="id"
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
