import { useState, useEffect } from 'react';
import { Modal } from '~/components/common/Modal';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { StudentSelector } from '~/components/common/StudentSelector';
import type { ExamResponse } from '~/types/exam';
import type {
  CreateExamResultRequest
} from '~/types/examResult';

interface ExamResultFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExamResultRequest) => Promise<void>;
  exams: ExamResponse[];
  isSubmitting: boolean;
}

export function ExamResultForm({
  isOpen,
  onClose,
  onSubmit,
  exams,
  isSubmitting
}: ExamResultFormProps) {
  const [formData, setFormData] = useState<CreateExamResultRequest>({
    examId: '',
    studentId: '',
    subjectResults: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        examId: '',
        studentId: '',
        subjectResults: []
      });
      setErrors({});
      setSelectedExam(null);
    }
  }, [isOpen]);

  // Update subject fields when exam changes
  useEffect(() => {
    if (formData.examId && selectedExam?.id !== formData.examId) {
      const exam = exams.find(e => e.id === formData.examId) || null;
      setSelectedExam(exam);
      
      if (exam) {
        setFormData(prev => ({
          ...prev,
          subjectResults: exam.subjects.map(subject => ({
            subject: subject.subject.id,
            marksObtained: 0,
            maxMarks: subject.maxMarks
          }))
        }));
      }
    }
  }, [formData.examId, exams, selectedExam]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.examId) {
      newErrors.examId = 'Exam is required';
    }
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }
    
    formData.subjectResults.forEach((result, index) => {
      if (result.marksObtained < 0) {
        newErrors[`subjectResults.${index}.marksObtained`] = 'Marks cannot be negative';
      }
      
      if (result.marksObtained > result.maxMarks) {
        newErrors[`subjectResults.${index}.marksObtained`] = `Marks cannot exceed ${result.maxMarks}`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CreateExamResultRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubjectMarksChange = (subjectId: string, marks: number) => {
    setFormData(prev => ({
      ...prev,
      subjectResults: prev.subjectResults.map(result => {
        if (result.subject === subjectId) {
          return {
            ...result,
            marksObtained: marks
          };
        }
        return result;
      })
    }));
    
    // Clear errors for this subject if any
    const errorKeys = Object.keys(errors).filter(
      key => key.startsWith(`subjectResults.`) && key.includes(subjectId)
    );
    
    if (errorKeys.length) {
      setErrors(prev => {
        const newErrors = { ...prev };
        errorKeys.forEach(key => delete newErrors[key]);
        return newErrors;
      });
    }
  };

  const handleSubjectRemarksChange = (subjectId: string, remarks: string) => {
    setFormData(prev => ({
      ...prev,
      subjectResults: prev.subjectResults.map(result => {
        if (result.subject === subjectId) {
          return {
            ...result,
            remarks
          };
        }
        return result;
      })
    }));
  };

  const getSubjectNameById = (subjectId: string) => {
    if (!selectedExam) return '';
    const subject = selectedExam.subjects.find(s => s.subject.id === subjectId);
    return subject?.subject.name || '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Exam Result"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.examId}
              onChange={(e) => handleChange('examId', e.target.value)}
              className={`block w-full rounded-md border ${errors.examId ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-gray-700`}
              required
            >
              <option value="">Select Exam</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.examType.name} - {exam.academicYear}
                </option>
              ))}
            </select>
            {errors.examId && (
              <p className="mt-1 text-sm text-red-600">{errors.examId}</p>
            )}
          </div>

          <div>
            <StudentSelector
              label="Student"
              value={formData.studentId}
              onChange={(value) => handleChange('studentId', value)}
              classId={selectedExam?.class.id}
              required
              placeholder={!selectedExam ? 'Select exam first' : 'Select student'}
            />
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
            )}
          </div>
        </div>

        {selectedExam && formData.subjectResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Subject Marks</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-12 gap-4 font-medium text-gray-700 mb-2 text-sm">
                <div className="col-span-4">Subject</div>
                <div className="col-span-2">Max. Marks</div>
                <div className="col-span-2">Marks Obtained</div>
                <div className="col-span-4">Remarks (Optional)</div>
              </div>
              
              {formData.subjectResults.map((result, index) => {
                const subjectName = getSubjectNameById(result.subject);
                const error = errors[`subjectResults.${index}.marksObtained`];
                
                return (
                  <div key={result.subject} className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-4 text-sm font-medium">{subjectName}</div>
                    <div className="col-span-2 text-sm text-gray-500">{result.maxMarks}</div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        max={result.maxMarks}
                        value={result.marksObtained}
                        onChange={(e) => handleSubjectMarksChange(
                          result.subject, 
                          parseInt(e.target.value) || 0
                        )}
                        className={`block w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} px-3 py-2 text-gray-700`}
                      />
                      {error && (
                        <p className="mt-1 text-xs text-red-600">{error}</p>
                      )}
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={result.remarks || ''}
                        onChange={(e) => handleSubjectRemarksChange(
                          result.subject,
                          e.target.value
                        )}
                        placeholder="Any remarks"
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <TextInput
          label="Overall Remarks"
          value={formData.remarks || ''}
          onChange={(value) => handleChange('remarks', value)}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Result'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
