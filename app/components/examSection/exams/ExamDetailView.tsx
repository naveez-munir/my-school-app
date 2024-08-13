import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useExam } from '~/hooks/useExamQueries';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

const ExamDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: exam,
    isLoading,
    error
  } = useExam(id as string);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {error ? (error as Error).message : 'Exam not found'}
      </div>
    );
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'ResultDeclared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Exams
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{exam.description}</h1>
            <p className="text-gray-600 mt-1">
              {exam.examType?.name} • {exam.academicYear}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(exam.status)}`}>
            {exam.status}
          </span>
        </div>

        {/* Exam Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Exam Period</h2>
            <p className="text-gray-700">
              <span className="font-medium">Start Date:</span> {formatUserFriendlyDate(exam.startDate)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">End Date:</span> {formatUserFriendlyDate(exam.endDate)}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Class Information</h2>
            <p className="text-gray-700">
              <span className="font-medium">Class:</span> {exam.class.className || 'Not specified'}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Exam Subjects</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4">
              {exam.subjects.map((subject) => (
                <div key={subject.subject.id} className="bg-white rounded-md p-4 shadow-sm border">
                  <h3 className="font-medium text-lg mb-2">{subject.subject?.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Exam Date</p>
                      <p className="font-medium">{formatUserFriendlyDate(subject.examDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium">{subject.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Time</p>
                      <p className="font-medium">{subject.endTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {exam.description && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Exam Description</h2>
            <p className="text-gray-700">{exam.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetailView;
