import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useStudentsByGuardianId } from '~/hooks/useStudentQueries';
import type { StudentResponse } from '~/types/student';
import { getUserId } from '~/utils/auth';

interface MyStudentsSelectorProps {
  value?: string;
  onChange: (studentId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MyStudentsSelector({
  value = '',
  onChange,
  label = 'My Children',
  required = false,
  placeholder = 'Select student',
  disabled = false,
  className = ''
}: MyStudentsSelectorProps) {
  const currentUserId = getUserId();
  const { data: myStudents = [], isLoading: loading } = useStudentsByGuardianId(currentUserId || '');
  
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  useEffect(() => {
    if (value && myStudents.length > 0) {
      const matchingStudent = myStudents.find((s: StudentResponse) => s.id === value);
      setSelectedStudent(matchingStudent || null);
    } else {
      setSelectedStudent(null);
    }
  }, [value, myStudents]);

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
          items={myStudents}
          value={selectedStudent}
          onChange={handleStudentChange}
          displayKey="name" 
          valueKey="id"
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
      
      {!loading && myStudents.length === 0 && (
        <p className="mt-1 text-sm text-gray-500">No students found for your account</p>
      )}
    </div>
  );
}
