import { useState, useEffect, useMemo } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import { useSubjects } from '~/hooks/useSubjectQueries';
import { useClass } from '~/hooks/useClassQueries';
import type { Subject } from '~/types/subject';

interface SubjectSelectorProps {
  value?: string;
  onChange: (subjectId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  classId?: string;
}

export function SubjectSelector({
  value = '',
  onChange,
  label = 'Subject',
  required = false,
  placeholder = 'Select or enter subject',
  className = '',
  classId
}: SubjectSelectorProps) {
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const { data: classData, isLoading: loadingClass } = useClass(classId || '');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const filteredSubjects = useMemo(() => {
    let result = subjects;

    if (classId && classData?.classGradeLevel) {
      result = result.filter(s => !s.gradeLevel || s.gradeLevel === classData.classGradeLevel);
    }

    if (classId && classData?.classSubjects) {
      const classSubjectIds = classData.classSubjects.map(s => s._id);
      result = result.filter(s => classSubjectIds.includes(s._id));
    }

    return result;
  }, [classId, classData, subjects]);

  const loading = loadingSubjects || (classId ? loadingClass : false);

  useEffect(() => {
    if (value && filteredSubjects.length > 0) {
      const matchingSubject = filteredSubjects.find(s => s._id === value);
      setSelectedSubject(matchingSubject || null);
    } else {
      setSelectedSubject(null);
    }
  }, [value, filteredSubjects]);

  const handleSubjectChange = (selected: Subject | null) => {
    setSelectedSubject(selected);
    onChange(selected ? selected._id : '');
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
        <GenericCombobox<Subject>
          items={filteredSubjects}
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
