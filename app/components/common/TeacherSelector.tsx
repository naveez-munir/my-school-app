import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useTeachers } from '~/hooks/useTeacherQueries';
import type { TeacherResponse } from '~/types/teacher';

interface TeacherSelectorProps {
  value?: string;
  onChange: (teacherId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TeacherSelector({
  value = '',
  onChange,
  label = 'Teacher',
  required = false,
  placeholder = 'Select or enter teacher',
  className = ''
}: TeacherSelectorProps) {
  const { data: teachers = [], isLoading: loading } = useTeachers();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherResponse | null>(null)

  useEffect(() => {
    if (value && teachers.length > 0) {
      const matchingTeacher = teachers.find(t => t.id === value);
      setSelectedTeacher(matchingTeacher || null);
    } else {
      setSelectedTeacher(null);
    }
  }, [value, teachers]);

  const handleTeacherChange = (selected: TeacherResponse | null) => {
    setSelectedTeacher(selected);
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
        <GenericCombobox<TeacherResponse>
          items={teachers}
          value={selectedTeacher}
          onChange={handleTeacherChange}
          displayKey="name" 
          valueKey="id"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
