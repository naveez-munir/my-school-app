import React, { useState } from 'react';
import type { AcademicYear, CreateAcademicYearDto, UpdateAcademicYearDto } from '~/types/academicYear';
import AcademicYearTable from './AcademicYearTable';
import AcademicYearForm from './AcademicYearForm';
import { Modal } from '~/components/common/Modal';
import { ConfirmationModal } from '~/components/common/ConfirmationModal';
import {
  useAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear
} from '~/hooks/useAcademicYearQueries';

const AcademicYearDashboard: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [academicYearToDelete, setAcademicYearToDelete] = useState<string | null>(null);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(null);

  const {
    data: academicYears = [],
    isLoading,
    error
  } = useAcademicYears();

  const createAcademicYearMutation = useCreateAcademicYear();
  const updateAcademicYearMutation = useUpdateAcademicYear();
  const deleteAcademicYearMutation = useDeleteAcademicYear();

  const handleAddNew = () => {
    setCurrentAcademicYear(null);
    setShowFormModal(true);
  };

  const handleEdit = (academicYear: AcademicYear) => {
    setCurrentAcademicYear(academicYear);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setAcademicYearToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (academicYearToDelete) {
      await deleteAcademicYearMutation.mutateAsync(academicYearToDelete);
      setShowDeleteModal(false);
      setAcademicYearToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAcademicYearToDelete(null);
  };

  const handleFormSubmit = async (data: CreateAcademicYearDto | UpdateAcademicYearDto) => {
    try {
      if (currentAcademicYear) {
        await updateAcademicYearMutation.mutateAsync({
          id: currentAcademicYear.id,
          data: data as UpdateAcademicYearDto
        });
      } else {
        await createAcademicYearMutation.mutateAsync(data as CreateAcademicYearDto);
      }
      setShowFormModal(false);
    } catch (error) {
      console.error('Error saving academic year:', error);
    }
  };

  const handleCancelForm = () => {
    setShowFormModal(false);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: {(error as Error).message}
      </div>
    );
  }

  const isSubmitting =
    createAcademicYearMutation.isPending ||
    updateAcademicYearMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Academic Year Management</h3>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Academic Year
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : (
        <AcademicYearTable
          data={academicYears}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <Modal
        isOpen={showFormModal}
        onClose={handleCancelForm}
        title={currentAcademicYear ? 'Edit Academic Year' : 'Add Academic Year'}
      >
        <AcademicYearForm
          initialData={currentAcademicYear ? {
            startDate: currentAcademicYear.startDate.split('T')[0],
            endDate: currentAcademicYear.endDate.split('T')[0],
            displayName: currentAcademicYear.displayName,
            isActive: currentAcademicYear.isActive,
            status: currentAcademicYear.status
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Academic Year"
        message="Are you sure you want to delete this academic year? This action cannot be undone."
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default AcademicYearDashboard;
