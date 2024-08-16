import { X } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <>
      {/* Custom Modal with screen-only class */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>

        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 z-10 relative max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-900">Exam Result Details</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-6 py-4">
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
                {(result.exam.className || result.class) && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Class:</span>
                    <span className="text-sm font-medium text-gray-900">{result.exam.className || result.class?.name}</span>
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
                {result?.detailedSubjectResults?.map((subject) => (
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
                        subject.status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900" colSpan={3}>
                    Total Marks
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900" colSpan={2}>
                    {result.totalMarks}
                  </td>
                </tr>
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900" colSpan={3}>
                    Percentage
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900" colSpan={2}>
                    {formatPercentage(result.percentage)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">Overall Result</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-6 rounded border-2 border-gray-300 text-center">
              <div className="text-sm text-gray-500 uppercase mb-2">Grade</div>
              <div className={`text-4xl font-bold ${getGradeClass(result.grade || '')}`}>
                {result.grade || '-'}
              </div>
            </div>

            <div className="bg-white p-6 rounded border-2 border-gray-300 text-center">
              <div className="text-sm text-gray-500 uppercase mb-2">Class Rank</div>
              <div className="text-4xl font-bold text-gray-800">
                #{result.rank || '-'}
              </div>
            </div>

            <div className="bg-white p-6 rounded border-2 border-gray-300 text-center">
              <div className="text-sm text-gray-500 uppercase mb-2">Result Status</div>
              <div className={`text-3xl font-bold ${result.status === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                {result.status}
              </div>
            </div>
          </div>

          {(result.highestMarks || result.averageMarks) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Class Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {result.highestMarks && (
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <span className="text-xs text-gray-500 block mb-1">Highest Marks</span>
                    <span className="text-lg font-semibold text-gray-900">{result.highestMarks}</span>
                  </div>
                )}
                {result.lowestMarks && (
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <span className="text-xs text-gray-500 block mb-1">Lowest Marks</span>
                    <span className="text-lg font-semibold text-gray-900">{result.lowestMarks}</span>
                  </div>
                )}
                {result.averageMarks && (
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <span className="text-xs text-gray-500 block mb-1">Average Marks</span>
                    <span className="text-lg font-semibold text-gray-900">{result.averageMarks.toFixed(2)}</span>
                  </div>
                )}
                {result.totalStudents && (
                  <div className="bg-white p-3 rounded border border-gray-300">
                    <span className="text-xs text-gray-500 block mb-1">Total Students</span>
                    <span className="text-lg font-semibold text-gray-900">{result.totalStudents}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {result.remarks && (
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Remarks:</h3>
            <p className="text-sm text-gray-700">{result.remarks}</p>
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
          </div>
        </div>
      </div>
    </>
  );
}
