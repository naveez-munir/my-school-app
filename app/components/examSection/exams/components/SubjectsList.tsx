// src/components/exams/ExamForm/SubjectsList.tsx
import React from 'react';
import type { SubjectSchedule } from '~/types/exam';
import SubjectScheduleItem from './SubjectScheduleItem';

interface SubjectsListProps {
  subjects: SubjectSchedule[];
  formErrors: Record<string, string>;
  examPeriod: {
    startDate: Date;
    endDate: Date;
  };
  onChange: (subjects: SubjectSchedule[]) => void;
}

const SubjectsList: React.FC<SubjectsListProps> = ({
  subjects,
  formErrors,
  examPeriod,
  onChange
}) => {
  // Handle subject form changes
  const handleSubjectChange = (index: number, field: keyof SubjectSchedule, value: any) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    onChange(updatedSubjects);
  };

  // Add a new subject
  const handleAddSubject = () => {
    onChange([
      ...subjects,
      {
        subject: '',
        examDate: new Date(),
        startTime: '09:00',
        endTime: '11:00',
        maxMarks: 100,
        passingMarks: 35
      }
    ]);
  };

  // Remove a subject
  const handleRemoveSubject = (index: number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    onChange(updatedSubjects);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Subjects *</h2>
        <button
          type="button"
          onClick={handleAddSubject}
          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm"
        >
          + Add Subject
        </button>
      </div>
      
      {formErrors.subjects && (
        <p className="mb-4 text-sm text-red-500">{formErrors.subjects}</p>
      )}
      
      {subjects.map((subject, index) => (
        <SubjectScheduleItem
          key={index}
          subject={subject}
          index={index}
          formErrors={formErrors}
          onSubjectChange={handleSubjectChange}
          onRemove={handleRemoveSubject}
          canRemove={subjects.length > 1}
        />
      ))}
    </div>
  );
};

export default SubjectsList;
