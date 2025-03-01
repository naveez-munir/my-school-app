import { useState, useEffect } from 'react';
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
}

export function ClassSelector({
  value = '',
  onChange,
  label = 'Class',
  required = false,
  placeholder = 'Select or enter class',
  className = ''
}: ClassSelectorProps) {
  const { data: classes = [], isLoading: loading } = useClasses();
  const [selectedClass, setSelectedClass] = useState<ClassResponse | null>(null)
  useEffect(() => {
    if (value && classes.length > 0) {
      const matchingClass = classes.find(c => c.id === value);
      setSelectedClass(matchingClass || null);
    } else {
      setSelectedClass(null);
    }
  }, [value, classes]);

  const handleClassChange = (selected: ClassResponse | null) => {
    setSelectedClass(selected);
    onChange(selected ? selected.id : '');
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
        <GenericCombobox<ClassResponse>
          items={classes}
          value={selectedClass}
          onChange={handleClassChange}
          displayKey="className" 
          valueKey="id"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
