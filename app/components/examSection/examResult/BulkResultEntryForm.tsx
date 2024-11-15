import { useState, useMemo } from 'react';
import type { ExamResponse } from '~/types/exam';
import type { BulkResultInput, BulkStudentResultInput } from '~/types/examResult';
import { useStudents } from '~/hooks/useStudentQueries';
import { BulkResultTable } from './BulkResultTable';

interface BulkResultEntryFormProps {
  exams: ExamResponse[];
  onSubmit: (data: BulkResultInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BulkResultEntryForm({
  exams,
  onSubmit,
  onCancel,
  isSubmitting = false
}: BulkResultEntryFormProps) {
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [resultOverrides, setResultOverrides] = useState<Record<string, Record<string, number>>>({});
  const [remarksOverrides, setRemarksOverrides] = useState<Record<string, string>>({});

  const { data: allStudents = [] } = useStudents();

  const selectedExam = useMemo(() => {
    return exams.find(exam => exam.id === selectedExamId);
  }, [exams, selectedExamId]);

  const filteredStudents = useMemo(() => {
    if (!selectedExam) return [];
    return allStudents.filter(student => student.classId === selectedExam.class.id);
  }, [allStudents, selectedExam]);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamId(e.target.value);
    setResultOverrides({});
    setRemarksOverrides({});
  };

  const handleMarksChange = (studentId: string, subjectId: string, marks: number) => {
    setResultOverrides(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: marks
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRemarksOverrides(prev => ({
      ...prev,
      [studentId]: remarks
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedExam) {
      alert('Please select an exam');
      return;
    }

    if (filteredStudents.length === 0) {
      alert('No students found for this exam');
      return;
    }

    const results: BulkStudentResultInput[] = filteredStudents.map(student => {
      const studentMarks = resultOverrides[student.id] || {};
      const subjectResults = selectedExam.subjects.map(examSubject => ({
        subject: examSubject.subject.id,
        marksObtained: studentMarks[examSubject.subject.id] || 0,
        maxMarks: examSubject.maxMarks,
        remarks: ''
      }));

      return {
        studentId: student.id,
        subjectResults,
        remarks: remarksOverrides[student.id] || ''
      };
    });

    const data: BulkResultInput = {
      examId: selectedExamId,
      results
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Exam <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedExamId}
              onChange={handleExamChange}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Choose an exam...</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.class.className} - {exam.examType.name} ({exam.academicYear})
                </option>
              ))}
            </select>
          </div>

          {selectedExam && (
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <p><strong>Class:</strong> {selectedExam.class.className} {selectedExam.class.classSection}</p>
                <p><strong>Students:</strong> {filteredStudents.length}</p>
                <p><strong>Subjects:</strong> {selectedExam.subjects.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedExam && filteredStudents.length > 0 && (
        <BulkResultTable
          students={filteredStudents}
          exam={selectedExam}
          resultOverrides={resultOverrides}
          remarksOverrides={remarksOverrides}
          onMarksChange={handleMarksChange}
          onRemarksChange={handleRemarksChange}
        />
      )}

      {selectedExam && filteredStudents.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          No students found for this exam's class
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !selectedExam || filteredStudents.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : `Submit Results (${filteredStudents.length} students)`}
        </button>
      </div>
    </form>
  );
}
