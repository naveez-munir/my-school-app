import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';
import { Modal } from '~/components/common/Modal';
import { useAllocations, useDeleteAllocation, useActivateAllocation, useDeactivateAllocation } from '~/hooks/useAllocationQueries';
import { AllocationForm } from './AllocationForm';
import { BookOpen, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAdmin } from '~/utils/auth';
import type { ClassSubjectAllocation } from '~/types/timetable';

const columnHelper = createColumnHelper<ClassSubjectAllocation>();

function createAllocationColumns(
  onEdit?: (allocation: ClassSubjectAllocation) => void,
  onDelete?: (allocation: ClassSubjectAllocation) => void,
  onToggleStatus?: (allocation: ClassSubjectAllocation) => void
) {
  const columns = [
    columnHelper.accessor('className', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Class" />
      ),
      cell: (info) => (
        <span className="font-semibold text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('subjectName', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Subject" />
      ),
      cell: (info) => (
        <span className="text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('teacherName', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Teacher" />
      ),
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('periodsPerWeek', {
      header: 'Periods/Week',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('isLabSubject', {
      header: 'Lab Subject',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {info.getValue() ? 'Yes' : 'No'}
        </span>
      ),
    }),
    columnHelper.accessor('consecutivePeriods', {
      header: 'Consecutive',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
        );
      },
    }),
  ];

  if (onEdit || onDelete || onToggleStatus) {
    columns.push(
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const allocation = info.row.original;
          return (
            <div className="flex justify-end space-x-2">
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(allocation)}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    allocation.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'
                  }`}
                  title={allocation.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                >
                  {allocation.status === 'ACTIVE' ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(allocation)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(allocation)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        },
      })
    );
  }

  return columns;
}

export function AllocationList() {
  const [editModal, setEditModal] = useState<{ isOpen: boolean; allocation?: ClassSubjectAllocation }>({
    isOpen: false
  });
  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    allocationId?: string; 
    allocationName?: string 
  }>({
    isOpen: false
  });

  const { data: allocations = [], isLoading } = useAllocations();
  const deleteAllocationMutation = useDeleteAllocation();
  const activateAllocationMutation = useActivateAllocation();
  const deactivateAllocationMutation = useDeactivateAllocation();

  const userIsAdmin = isAdmin();

  const handleEdit = (allocation: ClassSubjectAllocation) => {
    setEditModal({ isOpen: true, allocation });
  };

  const handleDeleteClick = (allocation: ClassSubjectAllocation) => {
    setDeleteModal({
      isOpen: true,
      allocationId: allocation.id,
      allocationName: `${allocation.className} - ${allocation.subjectName}`
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.allocationId) {
      deleteAllocationMutation.mutate(deleteModal.allocationId, {
        onSuccess: () => {
          toast.success('Allocation deleted successfully');
          setDeleteModal({ isOpen: false });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to delete allocation');
        }
      });
    }
  };

  const handleToggleStatus = (allocation: ClassSubjectAllocation) => {
    const mutation = allocation.status === 'ACTIVE' 
      ? deactivateAllocationMutation 
      : activateAllocationMutation;
    
    mutation.mutate(allocation.id, {
      onSuccess: () => {
        toast.success(`Allocation ${allocation.status === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update allocation status');
      }
    });
  };

  const columns = createAllocationColumns(
    userIsAdmin ? handleEdit : undefined,
    userIsAdmin ? handleDeleteClick : undefined,
    userIsAdmin ? handleToggleStatus : undefined
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              Class Subject Allocations
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Assign teachers to subjects for each class
          </p>
        </div>

        {userIsAdmin && (
          <button
            onClick={() => setEditModal({ isOpen: true })}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Allocation
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading allocations...</div>
        ) : (
          <GenericDataTable<ClassSubjectAllocation>
            data={allocations}
            columns={columns}
            emptyStateMessage="No allocations found. Create your first allocation to get started."
            searchPlaceholder="Search allocations..."
            idField="id"
          />
        )}
      </div>

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false })}
        title={editModal.allocation ? 'Edit Allocation' : 'Create Allocation'}
        size="lg"
        closeOnOutsideClick={false}
      >
        <AllocationForm
          allocation={editModal.allocation}
          onSuccess={() => setEditModal({ isOpen: false })}
          onCancel={() => setEditModal({ isOpen: false })}
        />
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Allocation"
        size="sm"
        closeOnOutsideClick={false}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.allocationName}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteModal({ isOpen: false })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleteAllocationMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {deleteAllocationMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

