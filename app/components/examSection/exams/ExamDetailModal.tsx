import React from 'react';
import { Modal } from '~/components/common/Modal';
import { useExam } from '~/hooks/useExamQueries';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface ExamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  examId: string;
}

export function ExamDetailModal({ isOpen, onClose, examId }: ExamDetailModalProps) {
  const { 
    data: exam, 
    isLoading, 
    error 
  } = useExam(examId);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'ResultDeclared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exam Details" size="xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error || !exam ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">
          Error: {error ? (error as Error).message : 'Exam not found'}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{exam.description}</h2>
              <p className="text-gray-600 mt-1">
                {exam.examType?.name} • {exam.academicYear}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(exam.status)}`}>
              {exam.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Exam Period</h3>
              <p className="text-gray-700">
                <span className="font-medium">Start Date:</span> {formatUserFriendlyDate(exam.startDate)}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">End Date:</span> {formatUserFriendlyDate(exam.endDate)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Class Information</h3>
              <p className="text-gray-700">
                <span className="font-medium">Class:</span> {exam.class.className || 'Not specified'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Exam Subjects</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 gap-4">
                {exam.subjects.map((subject) => (
                  <div key={subject.subject.id} className="bg-white rounded-md p-4 shadow-sm border">
                    <h4 className="font-medium text-lg mb-2">{subject.subject?.name}</h4>
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Exam Description</h3>
              <p className="text-gray-700">{exam.description}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

