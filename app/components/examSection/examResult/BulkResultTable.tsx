import type { StudentResponse } from '~/types/student';
import type { ExamResponse } from '~/types/exam';

interface BulkResultTableProps {
  students: StudentResponse[];
  exam: ExamResponse;
  resultOverrides: Record<string, Record<string, number>>;
  remarksOverrides: Record<string, string>;
  onMarksChange: (studentId: string, subjectId: string, marks: number) => void;
  onRemarksChange: (studentId: string, remarks: string) => void;
}

export function BulkResultTable({
  students,
  exam,
  resultOverrides,
  remarksOverrides,
  onMarksChange,
  onRemarksChange
}: BulkResultTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10">
                Roll No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-32 bg-gray-50 z-10 min-w-[200px]">
                Student Name
              </th>
              {exam.subjects.map((examSubject) => (
                <th
                  key={examSubject.subject.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div>
                    {examSubject.subject.name}
                    <div className="text-xs font-normal text-gray-400">
                      (Max: {examSubject.maxMarks})
                    </div>
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student, index) => {
              const studentMarks = resultOverrides[student.id] || {};
              const hasError = exam.subjects.some(examSubject => {
                const marks = studentMarks[examSubject.subject.id] || 0;
                return marks > examSubject.maxMarks;
              });

              return (
                <tr key={student.id} className={hasError ? 'bg-red-50' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 sticky left-0 bg-white">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 sticky left-12 bg-white">
                    {student.rollNumber || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-32 bg-white">
                    {student.name}
                  </td>
                  {exam.subjects.map((examSubject) => {
                    const marks = studentMarks[examSubject.subject.id] || 0;
                    const isInvalid = marks > examSubject.maxMarks;

                    return (
                      <td key={examSubject.subject.id} className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max={examSubject.maxMarks}
                          value={marks}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            onMarksChange(student.id, examSubject.subject.id, value);
                          }}
                          className={`w-20 px-2 py-1 border rounded text-sm ${
                            isInvalid
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          }`}
                        />
                        {isInvalid && (
                          <p className="text-xs text-red-500 mt-1">
                            Max: {examSubject.maxMarks}
                          </p>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="text"
                      value={remarksOverrides[student.id] || ''}
                      onChange={(e) => onRemarksChange(student.id, e.target.value)}
                      placeholder="Optional remarks"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Tip:</strong> Use Tab key to navigate between fields quickly
        </p>
      </div>
    </div>
  );
}
