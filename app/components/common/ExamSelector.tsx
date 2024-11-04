import { useState, useEffect } from 'react';
import GenericCombobox from '~/components/common/form/inputs/Select';
import type { ExamResponse } from '~/types/exam';

interface ExamOption {
  id: string;
  displayName: string;
}

interface ExamSelectorProps {
  exams: ExamResponse[];
  value?: string;
  onChange: (examId: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ExamSelector({
  exams,
  value = '',
  onChange,
  label = 'Filter by Exam',
  required = false,
  placeholder = 'All Exams',
  disabled = false,
  className = '',
}: ExamSelectorProps) {
  const [selectedExam, setSelectedExam] = useState<ExamOption | null>(null);

  const examOptions: ExamOption[] = exams.map(exam => ({
    id: exam.id,
    displayName: `${exam.class.className} (${exam.examType.name} - ${exam.academicYear})`
  }));

  useEffect(() => {
    if (value) {
      const matchingExam = examOptions.find(e => e.id === value);
      setSelectedExam(matchingExam || null);
    } else {
      setSelectedExam(null);
    }
  }, [value, exams]);

  const handleExamChange = (selected: ExamOption | null) => {
    setSelectedExam(selected);
    onChange(selected ? selected.id : '');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}

      <GenericCombobox<ExamOption>
        items={examOptions}
        value={selectedExam}
        onChange={handleExamChange}
        displayKey="displayName"
        valueKey="id"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

