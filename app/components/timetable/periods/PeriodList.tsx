import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader, createActionsColumn } from '~/components/common/table/TableHelpers';
import { Modal } from '~/components/common/Modal';
import { usePeriods, useDeletePeriod, useActivatePeriod, useDeactivatePeriod } from '~/hooks/usePeriodQueries';
import { PeriodForm } from './PeriodForm';
import { Clock, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAdmin } from '~/utils/auth';
import type { Period } from '~/types/timetable';

const columnHelper = createColumnHelper<Period>();

function createPeriodColumns(
  onEdit?: (period: Period) => void,
  onDelete?: (period: Period) => void,
  onToggleStatus?: (period: Period) => void
) {
  const columns = [
    columnHelper.accessor('periodNumber', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Period #" />
      ),
      cell: (info) => (
        <span className="font-semibold text-gray-900">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('periodName', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Period Name" />
      ),
      cell: (info) => (
        <span className="text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('startTime', {
      header: 'Start Time',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('endTime', {
      header: 'End Time',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('durationMinutes', {
      header: 'Duration',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()} min</span>
      ),
    }),
    columnHelper.accessor('periodType', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        const colors = {
          TEACHING: 'bg-blue-100 text-blue-800',
          BREAK: 'bg-green-100 text-green-800',
          LUNCH: 'bg-orange-100 text-orange-800',
          ASSEMBLY: 'bg-purple-100 text-purple-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
            {type}
          </span>
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
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
          const period = info.row.original;
          return (
            <div className="flex justify-end space-x-2">
              {onToggleStatus && (
                <button
                  onClick={() => onToggleStatus(period)}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    period.isActive ? 'text-red-600' : 'text-green-600'
                  }`}
                  title={period.isActive ? 'Deactivate' : 'Activate'}
                >
                  {period.isActive ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(period)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(period)}
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

export function PeriodList() {
  const [editModal, setEditModal] = useState<{ isOpen: boolean; period?: Period }>({
    isOpen: false
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; periodId?: string; periodName?: string }>({
    isOpen: false
  });

  const { data: periods = [], isLoading } = usePeriods();
  const deletePeriodMutation = useDeletePeriod();
  const activatePeriodMutation = useActivatePeriod();
  const deactivatePeriodMutation = useDeactivatePeriod();

  const navigate = useNavigate();
  const userIsAdmin = isAdmin();

  const handleEdit = (period: Period) => {
    setEditModal({ isOpen: true, period });
  };

  const handleDeleteClick = (period: Period) => {
    setDeleteModal({
      isOpen: true,
      periodId: period.id,
      periodName: period.periodName
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.periodId) {
      deletePeriodMutation.mutate(deleteModal.periodId, {
        onSuccess: () => {
          toast.success('Period deleted successfully');
          setDeleteModal({ isOpen: false });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to delete period');
        }
      });
    }
  };

  const handleToggleStatus = (period: Period) => {
    const mutation = period.isActive ? deactivatePeriodMutation : activatePeriodMutation;
    mutation.mutate(period.id, {
      onSuccess: () => {
        toast.success(`Period ${period.isActive ? 'deactivated' : 'activated'} successfully`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to update period status');
      }
    });
  };

  const columns = createPeriodColumns(
    userIsAdmin ? handleEdit : undefined,
    userIsAdmin ? handleDeleteClick : undefined,
    userIsAdmin ? handleToggleStatus : undefined
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              Period Management
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Configure school periods and break times
          </p>
        </div>

        {userIsAdmin && (
          <button
            onClick={() => setEditModal({ isOpen: true })}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Period
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading periods...</div>
        ) : (
          <GenericDataTable<Period>
            data={periods}
            columns={columns}
            emptyStateMessage="No periods found. Create your first period to get started."
            searchPlaceholder="Search periods..."
            idField="id"
          />
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false })}
        title={editModal.period ? 'Edit Period' : 'Create Period'}
        size="lg"
        closeOnOutsideClick={false}
      >
        <PeriodForm
          period={editModal.period}
          onSuccess={() => setEditModal({ isOpen: false })}
          onCancel={() => setEditModal({ isOpen: false })}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Delete Period"
        size="sm"
        closeOnOutsideClick={false}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.periodName}</strong>?
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
              disabled={deletePeriodMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {deletePeriodMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

