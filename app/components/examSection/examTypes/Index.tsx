import React, { useState } from 'react';
import type { ExamType, CreateExamTypeDto, UpdateExamTypeDto } from '~/types/examType';
import ExamTypesTable from './ExamTypesTable';
import ExamTypeForm from './ExamTypeForm';
import { 
  useExamTypes, 
  useCreateExamType, 
  useUpdateExamType, 
  useDeleteExamType, 
  useToggleExamTypeStatus 
} from '~/hooks/useExamTypeQueries';

const ExamTypeDashboard: React.FC = () => {
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [examTypeToDelete, setExamTypeToDelete] = useState<string | null>(null);
  const [currentExamType, setCurrentExamType] = useState<ExamType | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);
  
  // React Query hooks
  const { 
    data: examTypes = [], 
    isLoading, 
    error 
  } = useExamTypes(activeOnly);
  
  const createExamTypeMutation = useCreateExamType();
  const updateExamTypeMutation = useUpdateExamType();
  const deleteExamTypeMutation = useDeleteExamType();
  const toggleStatusMutation = useToggleExamTypeStatus();

  const handleAddNew = () => {
    setCurrentExamType(null);
    setShowFormModal(true);
  };

  const handleEdit = (examType: ExamType) => {
    setCurrentExamType(examType);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setExamTypeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const confirmDelete = async () => {
    if (examTypeToDelete) {
      await deleteExamTypeMutation.mutateAsync(examTypeToDelete);
      setShowDeleteModal(false);
      setExamTypeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setExamTypeToDelete(null);
  };

  const handleFormSubmit = async (data: CreateExamTypeDto | UpdateExamTypeDto) => {
    try {
      if (currentExamType) {
        await updateExamTypeMutation.mutateAsync({ 
          id: currentExamType._id, 
          data: data as UpdateExamTypeDto 
        });
      } else {
        await createExamTypeMutation.mutateAsync(data as CreateExamTypeDto);
      }
      setShowFormModal(false);
    } catch (error) {
      console.error('Error saving exam type:', error);
    }
  };

  const handleCancelForm = () => {
    setShowFormModal(false);
  };

  const toggleActiveFilter = () => {
    setActiveOnly(!activeOnly);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {(error as Error).message}
      </div>
    );
  }

  const isSubmitting = 
    createExamTypeMutation.isPending || 
    updateExamTypeMutation.isPending;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800">Exam Types</h1>
        <div className="flex space-x-4">
          <button
            onClick={toggleActiveFilter}
            className={`text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 rounded-md ${
              activeOnly
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {activeOnly ? 'Showing Active Only' : 'Show All'}
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 rounded-md"
          >
            Add New Exam Type
          </button>
        </div>
      </div>

      {isLoading && examTypes.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ExamTypesTable
          data={examTypes}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this exam type? This action cannot be undone.
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
                disabled={deleteExamTypeMutation.isPending}
              >
                {deleteExamTypeMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentExamType ? 'Edit Exam Type' : 'Add New Exam Type'}
            </h3>
            <ExamTypeForm
              initialData={currentExamType ? {
                name: currentExamType.name,
                weightAge: currentExamType.weightAge,
                isActive: currentExamType.isActive
              } : undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTypeDashboard;
