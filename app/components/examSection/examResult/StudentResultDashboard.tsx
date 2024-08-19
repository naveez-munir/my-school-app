import React, { useState } from 'react';
import StudentResultsTable from './StudentResultsTable';
import { ExamResultDetail } from './ExamResultDetail';
import { useStudentResults, useExamResult } from '~/hooks/useExamResultQueries';
import type { DetailedExamResult } from '~/types/examResult';
import { useStudent } from '~/hooks/useStudentQueries';

interface StudentResultDashboardProps {
  studentId?: string;
}

const StudentResultDashboard: React.FC<StudentResultDashboardProps> = ({ studentId: propStudentId }) => {
  const {
    data: student,
    isLoading: isStudentLoading
  } = useStudent(propStudentId || '');

  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const studentId = propStudentId || student?._id || '';

  const {
    data: results = [],
    isLoading: isResultsLoading,
    error
  } = useStudentResults(studentId);

  const { 
    data: detailedResult 
  } = useExamResult(selectedResultId as string);

  const handleViewDetails = (resultId: string) => {
    setSelectedResultId(resultId);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {(error as Error).message}
      </div>
    );
  }

  const isLoading = isStudentLoading || isResultsLoading;

  return (
    <div className="container lg:mx-auto lg:py-6 lg:px-4">
      <div className="mb-6">
        <h1 className="text-responsive-xl font-bold text-gray-800">My Exam Results</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">View your academic performance</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <StudentResultsTable
          data={results}
          onViewDetails={handleViewDetails}
        />
      )}

      <ExamResultDetail
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        result={detailedResult as DetailedExamResult | null}
      />
    </div>
  );
};

export default StudentResultDashboard;
