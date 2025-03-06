import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import type { ExamResponse } from '~/types/exam';
import ExamsTable from './ExamsTable';
import { useExams, useDeleteExam, useUpdateExamStatus } from '~/hooks/useExamQueries';

const ExamDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState<string | null>(null);
  
  // React Query hooks
  const { 
    data: exams = [], 
    isLoading, 
    error 
  } = useExams();
  
  const deleteExamMutation = useDeleteExam();
  const updateStatusMutation = useUpdateExamStatus();

  const handleEdit = (exam: ExamResponse) => {
    navigate(`/dashboard/exams/${exam.id}/edit`);
  };

  const handleView = (exam: ExamResponse) => {
    navigate(`/dashboard/exams/${exam.id}`);
  };

  const handleCreate = () => {
    navigate('/dashboard/exams/new');
  };

  const handleDeleteClick = (id: string) => {
    setExamToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (examToDelete) {
      await deleteExamMutation.mutateAsync(examToDelete);
      setShowDeleteModal(false);
      setExamToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setExamToDelete(null);
  };

  const handleStatusChange = (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => {
    updateStatusMutation.mutate({ id, status });
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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Create New Exam
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ExamsTable
          data={exams}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onViewDetails={handleView}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this exam? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                disabled={deleteExamMutation.isPending}
              >
                {deleteExamMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDashboard;
