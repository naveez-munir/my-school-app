import React from 'react';

interface ExamFormHeaderProps {
  isEditMode: boolean;
}

const ExamFormHeader: React.FC<ExamFormHeaderProps> = ({ isEditMode }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        {isEditMode ? 'Edit Exam' : 'Create New Exam'}
      </h1>
    </div>
  );
};

export default ExamFormHeader;
