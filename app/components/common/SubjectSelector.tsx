import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useSubjects } from '~/hooks/useSubjectQueries';
import type { Subject } from '~/types/subject';

interface SubjectSelectorProps {
  value?: string;
  onChange: (subjectId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function SubjectSelector({
  value = '',
  onChange,
  label = 'Course',
  required = false,
  placeholder = 'Select or enter course',
  className = ''
}: SubjectSelectorProps) {
  const { data: subjects = [], isLoading: loading } = useSubjects();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  useEffect(() => {
    if (value && subjects.length > 0) {
      const matchingSubject = subjects.find(s => s._id === value);
      setSelectedSubject(matchingSubject || null);
    } else {
      setSelectedSubject(null);
    }
  }, [value, subjects]);

  const handleSubjectChange = (selected: Subject | null) => {
    setSelectedSubject(selected);
    onChange(selected ? selected._id : '');
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
        <GenericCombobox<Subject>
          items={subjects}
          value={selectedSubject}
          onChange={handleSubjectChange}
          displayKey="subjectName" 
          valueKey="_id"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
