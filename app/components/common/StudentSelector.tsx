import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useStudents } from '~/hooks/useStudentQueries';
import type { StudentResponse } from '~/types/student';

interface StudentSelectorProps {
  value?: string;
  onChange: (studentId: string) => void;
  classId?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function StudentSelector({
  value = '',
  onChange,
  classId,
  label = 'Student',
  required = false,
  placeholder = 'Select or enter student',
  className = ''
}: StudentSelectorProps) {
  const { data: allStudents = [], isLoading: loading } = useStudents();

  const filteredStudents = classId 
    ? allStudents.filter(student => student.classId === classId)
    : allStudents;
  
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  useEffect(() => {
    if (value && filteredStudents.length > 0) {
      const matchingStudent = filteredStudents.find(s => s.id === value);
      setSelectedStudent(matchingStudent || null);
    } else {
      setSelectedStudent(null);
    }
  }, [value, filteredStudents]);

  useEffect(() => {
    setSelectedStudent(null);
  }, [classId]);

  const handleStudentChange = (selected: StudentResponse | null) => {
    setSelectedStudent(selected);
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
        <GenericCombobox<StudentResponse>
          items={filteredStudents}
          value={selectedStudent}
          onChange={handleStudentChange}
          displayKey="name" 
          valueKey="id"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
