import { getTenantName } from '~/utils/auth';
import type { DetailedExamResult } from '~/types/examResult';

interface ResultCardPrintProps {
  result: DetailedExamResult;
}

export function ResultCardPrint({ result }: ResultCardPrintProps) {
  const schoolName = getTenantName() || 'School Name';

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
    <div className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #result-card-print, #result-card-print * {
            visibility: visible !important;
          }
          #result-card-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
      <div id="result-card-print" className="p-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center border-b-4 border-blue-600 pb-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 pt-4 rounded-t">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{schoolName}</h1>
            <h2 className="text-base font-semibold text-blue-700 mb-1">Student Result Card</h2>
            <div className="text-xs text-gray-600">
              <p className="font-semibold text-sm text-gray-800">{result.exam.type} - {result.exam.academicYear}</p>
            </div>
          </div>

          {/* Student & Exam Info Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
            <div className="flex items-center">
              <span className="font-semibold text-blue-700 mr-1">Student Name:</span>
              <span className="text-gray-900">{result.student.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-blue-700 mr-1">Roll Number:</span>
              <span className="text-gray-900">{result.student.rollNumber}</span>
            </div>
            {(result.exam.className || result.class) && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 mr-1">Class:</span>
                <span className="text-gray-900">{result.exam.className || result.class?.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <span className="font-semibold text-blue-700 mr-1">Exam:</span>
              <span className="text-gray-900">{result.exam.type}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-blue-700 mr-1">Academic Year:</span>
              <span className="text-gray-900">{result.exam.academicYear}</span>
            </div>
            {result.examDate && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 mr-1">Exam Date:</span>
                <span className="text-gray-900">{new Date(result.examDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Subject-wise Results Table */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1 flex items-center">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2">Subjects</span>
              <span className="text-blue-700">Performance Details</span>
            </h3>
            <table className="w-full border-collapse border-2 border-gray-300 text-xs shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="border border-gray-300 px-2 py-1.5 text-left font-bold">
                    Subject
                  </th>
                  <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">
                    Marks Obtained
                  </th>
                  <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">
                    Max Marks
                  </th>
                  <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">
                    Percentage
                  </th>
                  <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.detailedSubjectResults?.map((subject, index) => (
                  <tr key={subject.subject.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-2 py-1.5 text-gray-900 font-medium">
                      {subject.subject.name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-900">
                      {subject.marksObtained}
                    </td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-900">
                      {subject.maxMarks}
                    </td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-900 font-medium">
                      {formatPercentage(subject.percentage)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1.5 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        subject.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 font-bold border-t-2 border-blue-600">
                  <td className="border border-gray-300 px-2 py-1.5 text-blue-900" colSpan={3}>
                    Total Marks
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center text-blue-900" colSpan={2}>
                    {result.totalMarks}
                  </td>
                </tr>
                <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 font-bold">
                  <td className="border border-gray-300 px-2 py-1.5 text-blue-900" colSpan={3}>
                    Percentage
                  </td>
                  <td className="border border-gray-300 px-2 py-1.5 text-center text-blue-900" colSpan={2}>
                    {formatPercentage(result.percentage)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Overall Result Summary */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1 flex items-center">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs mr-2">Result</span>
              <span className="text-blue-700">Overall Performance</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border-2 border-orange-300 text-center shadow-sm">
                <div className="text-xs text-orange-700 uppercase mb-1 font-semibold">Grade</div>
                <div className={`text-2xl font-bold ${getGradeClass(result.grade || '')}`}>
                  {result.grade || '-'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border-2 border-purple-300 text-center shadow-sm">
                <div className="text-xs text-purple-700 uppercase mb-1 font-semibold">Class Rank</div>
                <div className="text-2xl font-bold text-purple-800">
                  #{result.rank || '-'}
                </div>
              </div>

              <div className={`bg-gradient-to-br p-3 rounded-lg border-2 text-center shadow-sm ${
                result.status === 'PASS'
                  ? 'from-green-50 to-green-100 border-green-300'
                  : 'from-red-50 to-red-100 border-red-300'
              }`}>
                <div className={`text-xs uppercase mb-1 font-semibold ${
                  result.status === 'PASS' ? 'text-green-700' : 'text-red-700'
                }`}>Result Status</div>
                <div className={`text-xl font-bold ${result.status === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
                  {result.status}
                </div>
              </div>
            </div>
          </div>

          {/* Class Statistics */}
          {(result.highestMarks || result.averageMarks) && (
            <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border-2 border-blue-200 shadow-sm">
              <h3 className="text-xs font-semibold text-blue-800 mb-1.5 flex items-center">
                <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs mr-1.5">📊</span>
                Class Statistics
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {result.highestMarks && (
                  <div className="flex justify-between bg-white px-2 py-1 rounded">
                    <span className="text-gray-700">Highest:</span>
                    <span className="font-bold text-green-700">{result.highestMarks}</span>
                  </div>
                )}
                {result.lowestMarks && (
                  <div className="flex justify-between bg-white px-2 py-1 rounded">
                    <span className="text-gray-700">Lowest:</span>
                    <span className="font-bold text-red-700">{result.lowestMarks}</span>
                  </div>
                )}
                {result.averageMarks && (
                  <div className="flex justify-between bg-white px-2 py-1 rounded">
                    <span className="text-gray-700">Average:</span>
                    <span className="font-bold text-blue-700">{result.averageMarks.toFixed(2)}</span>
                  </div>
                )}
                {result.totalStudents && (
                  <div className="flex justify-between bg-white px-2 py-1 rounded">
                    <span className="text-gray-700">Total Students:</span>
                    <span className="font-bold text-purple-700">{result.totalStudents}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Remarks */}
          {result.remarks && (
            <div className="mb-3 bg-gradient-to-r from-yellow-50 to-amber-50 p-2 rounded-lg border-l-4 border-yellow-500 shadow-sm">
              <h3 className="text-xs font-semibold text-yellow-800 mb-1 flex items-center">
                <span className="bg-yellow-500 text-white px-1.5 py-0.5 rounded text-xs mr-1.5">💬</span>
                Remarks
              </h3>
              <p className="text-xs text-gray-700 italic">{result.remarks}</p>
            </div>
          )}

          {/* Notes/Instructions */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50 p-2 rounded-lg border border-gray-300">
              <p className="font-semibold text-blue-800 mb-1 flex items-center">
                <span className="mr-1">ℹ️</span> Notes:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                <li>This result card is subject to verification and correction</li>
                <li>In case of any discrepancy, please contact the examination department</li>
              </ul>
            </div>
          </div>

          {/* Signatures */}
          <div className="print:fixed print:bottom-6 print:left-0 print:right-0 print:px-8">
            <div className="grid grid-cols-2 gap-8 text-xs mb-2">
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-1 mt-8">
                  <p className="font-semibold text-gray-900">Class Teacher</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-1 mt-8">
                  <p className="font-semibold text-gray-900">Principal</p>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 border-t-2 border-blue-600 pt-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded">
              <p className="font-medium">This is a computer-generated result card. Printed on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

