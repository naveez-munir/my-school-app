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
  showOnlyAvailable?: boolean;
  excludeTeacherId?: string;
}

export function TeacherSelector({
  value = '',
  onChange,
  label = 'Teacher',
  required = false,
  placeholder = 'Select or enter teacher',
  className = '',
  showOnlyAvailable = false,
  excludeTeacherId
}: TeacherSelectorProps) {
  const { data: teachers = [], isLoading: loading } = useTeachers();
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherResponse | null>(null)

  const availableTeachers = showOnlyAvailable
    ? teachers.filter(teacher =>
        !teacher.assignedClassName ||
        teacher.id === value ||
        teacher.id === excludeTeacherId
      )
    : teachers;

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
        <label className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      {loading ? (
        <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 h-8 sm:h-10 lg:h-12 animate-pulse"></div>
      ) : (
        <GenericCombobox<TeacherResponse>
          items={availableTeachers}
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
