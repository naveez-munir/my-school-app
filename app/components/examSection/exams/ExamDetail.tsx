import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useExam, useUpdateExamStatus } from '~/hooks/useExamQueries';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    data: currentExam, 
    isLoading, 
    error 
  } = useExam(id || '');
  
  const updateStatusMutation = useUpdateExamStatus();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {(error as Error).message}
      </div>
    );
  }

  if (!currentExam) {
    return <div className="text-center py-8">Exam not found</div>;
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'ResultDeclared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Define which status transitions are allowed
  const allowedTransitions = {
    'Scheduled': ['Ongoing'],
    'Ongoing': ['Completed'],
    'Completed': ['ResultDeclared']
  };

  const handleStatusChange = (status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => {
    if (id) {
      updateStatusMutation.mutate({ id, status });
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard/exams');
  };

  const handleEditClick = () => {
    navigate(`/dashboard/exams/${id}/edit`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentExam.examType.name} - {currentExam.class.className} {currentExam.class.classSection}
          </h1>
        </div>
        <div className="flex space-x-3">
          {currentExam.status === 'Scheduled' && (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Edit Exam
            </button>
          )}
          
          {allowedTransitions[currentExam.status as keyof typeof allowedTransitions]?.length > 0 && (
            <div className="relative">
              <select
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md appearance-none"
                onChange={(e) => handleStatusChange(e.target.value as any)}
                value=""
              >
                <option value="" disabled>Change Status</option>
                {allowedTransitions[currentExam.status as keyof typeof allowedTransitions]?.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Academic Year</p>
              <p className="font-medium">{currentExam.academicYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(currentExam.status)}`}>
                {currentExam.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{formatUserFriendlyDate(currentExam.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{formatUserFriendlyDate(currentExam.endDate)}</p>
            </div>
          </div>

          {currentExam.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Description</p>
              <p>{currentExam.description}</p>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium mb-4">Subjects</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passing Marks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentExam.subjects.map((subject, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subject.subject.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.subject.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatUserFriendlyDate(subject.examDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subject.startTime} - {subject.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subject.maxMarks}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {subject.passingMarks}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;
