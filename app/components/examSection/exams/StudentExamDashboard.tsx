import React from 'react';
import { useNavigate } from 'react-router';
import StudentExamsTable from './StudentExamsTable';
import { useMyExams } from '~/hooks/useExamQueries';

const StudentExamDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { 
    data: exams = [], 
    isLoading, 
    error 
  } = useMyExams();

  const handleViewDetails = (examId: string) => {
    navigate(`/student/exams/${examId}`);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Exams</h1>
        <p className="text-gray-600 mt-1">View your upcoming and ongoing exams</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <StudentExamsTable
          data={exams}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default StudentExamDashboard;
