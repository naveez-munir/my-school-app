import { Modal } from '~/components/common/Modal';
import type { DetailedExamResult } from '~/types/examResult';

interface ExamResultDetailProps {
  isOpen: boolean;
  onClose: () => void;
  result: DetailedExamResult | null;
}

export function ExamResultDetail({
  isOpen,
  onClose,
  result
}: ExamResultDetailProps) {
  if (!result) return null;

  const formatPercentage = (percentage: number | string) => {
    if (typeof percentage === 'string') {
      return percentage;
    }
    return `${percentage.toFixed(2)}%`;
  };

  const getGradeClass = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600';
      case 'B+':
      case 'B':
        return 'text-blue-600';
      case 'C+':
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exam Result Details"
      size="xl"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name:</span>
                  <span className="text-sm font-medium text-gray-900">{result.student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Roll Number:</span>
                  <span className="text-sm font-medium text-gray-900">{result.student.rollNumber}</span>
                </div>
                {result.class && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Class:</span>
                    <span className="text-sm font-medium text-gray-900">{result.class.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div><h3 className="text-lg font-medium text-gray-900">Exam Information</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Exam:</span>
                  <span className="text-sm font-medium text-gray-900">{result.exam.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Academic Year:</span>
                  <span className="text-sm font-medium text-gray-900">{result.exam.academicYear}</span>
                </div>
                {result.examDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm font-medium text-gray-900">{new Date(result.examDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Subject-wise Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Marks
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.detailedSubjectResults.map((subject) => (
                  <tr key={subject.subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subject.subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {subject.marksObtained}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {subject.maxMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      {formatPercentage(subject.percentage)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subject.isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subject.isPassing ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Result</h3>
              <div className="space-y-1">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-500">Total Marks:</span>
                  <span className="text-sm font-medium text-gray-900">{result.totalMarks}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-500">Percentage:</span>
                  <span className="text-sm font-medium text-gray-900">{formatPercentage(result.percentage)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-500">Grade:</span>
                  <span className={`text-sm font-bold ${getGradeClass(result.grade || '')}`}>{result.grade || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-500">Rank:</span>
                  <span className="text-sm font-medium text-gray-900">{result.rank || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-sm font-bold ${result.isPassing ? 'text-green-600' : 'text-red-600'}`}>
                    {result.isPassing ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              </div>
            </div>
            
            {(result.highestMarks || result.averageMarks) && (
              <div className="border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Class Statistics</h3>
                <div className="space-y-1">
                  {result.highestMarks && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Highest Marks:</span>
                      <span className="text-sm font-medium text-gray-900">{result.highestMarks}</span>
                    </div>
                  )}
                  {result.lowestMarks && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Lowest Marks:</span>
                      <span className="text-sm font-medium text-gray-900">{result.lowestMarks}</span>
                    </div>
                  )}
                  {result.averageMarks && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Average Marks:</span>
                      <span className="text-sm font-medium text-gray-900">{result.averageMarks.toFixed(2)}</span>
                    </div>
                  )}
                  {result.totalStudents && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-sm text-gray-500">Total Students:</span>
                      <span className="text-sm font-medium text-gray-900">{result.totalStudents}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {result.remarks && (
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Remarks</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">{result.remarks}</p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
