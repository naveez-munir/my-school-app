import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';
import { ConfirmationModal } from '~/components/common/ConfirmationModal';
import { useExceptions, useDeleteException, useApproveException } from '~/hooks/useExceptionQueries';
import { AlertCircle, Plus, Edit, Trash2, CheckCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAdmin } from '~/utils/auth';
import { useNavigate } from 'react-router';
import type { TimetableException } from '~/types/timetable';

const columnHelper = createColumnHelper<TimetableException>();

function createExceptionColumns(
  onEdit?: (exception: TimetableException) => void,
  onDelete?: (exception: TimetableException) => void,
  onApprove?: (exception: TimetableException) => void
) {
  const columns = [
    columnHelper.accessor('exceptionDate', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Date" />
      ),
      cell: (info) => (
        <span className="text-gray-900">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor('className', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Class" />
      ),
      cell: (info) => (
        <span className="font-semibold text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('periodNumber', {
      header: 'Period',
      cell: (info) => (
        <span className="text-gray-700">Period {info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('exceptionType', {
      header: 'Type',
      cell: (info) => {
        const type = info.getValue();
        const typeColors = {
          SUBSTITUTION: 'bg-blue-100 text-blue-800',
          CANCELLATION: 'bg-red-100 text-red-800',
          RESCHEDULE: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
            {type}
          </span>
        );
      },
    }),
    columnHelper.accessor('originalTeacherName', {
      header: 'Original Teacher',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('replacementTeacherName', {
      header: 'Replacement',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue() || '-'}</span>
      ),
    }),
    columnHelper.accessor('reason', {
      header: 'Reason',
      cell: (info) => (
        <span className="text-gray-600 text-sm truncate max-w-xs block">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('isApproved', {
      header: 'Status',
      cell: (info) => {
        const isApproved = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isApproved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isApproved ? 'Approved' : 'Pending'}
          </span>
        );
      },
    }),
  ];

  if (onEdit || onDelete || onApprove) {
    columns.push(
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const exception = info.row.original;
          return (
            <div className="flex justify-end space-x-2">
              {onApprove && !exception.isApproved && (
                <button
                  onClick={() => onApprove(exception)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Approve"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              {onEdit && !exception.isApproved && (
                <button
                  onClick={() => onEdit(exception)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onDelete && !exception.isApproved && (
                <button
                  onClick={() => onDelete(exception)}
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

interface ExceptionListProps {
  onCreateNew?: () => void;
  onEdit?: (exception: TimetableException) => void;
}

export function ExceptionList({ onCreateNew, onEdit }: ExceptionListProps) {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    exceptionId?: string;
    reason?: string;
  }>({
    isOpen: false
  });

  const { data: exceptions = [], isLoading } = useExceptions();
  const deleteExceptionMutation = useDeleteException();
  const approveExceptionMutation = useApproveException();

  const userIsAdmin = isAdmin();

  const handleDeleteClick = (exception: TimetableException) => {
    setDeleteModal({
      isOpen: true,
      exceptionId: exception.id,
      reason: exception.reason
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.exceptionId) {
      deleteExceptionMutation.mutate(deleteModal.exceptionId, {
        onSuccess: () => {
          toast.success('Exception deleted successfully');
          setDeleteModal({ isOpen: false });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to delete exception');
        }
      });
    }
  };

  const handleApprove = (exception: TimetableException) => {
    approveExceptionMutation.mutate(
      { id: exception.id },
      {
        onSuccess: () => {
          toast.success('Exception approved successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to approve exception');
        }
      }
    );
  };

  const columns = createExceptionColumns(
    userIsAdmin ? onEdit : undefined,
    userIsAdmin ? handleDeleteClick : undefined,
    userIsAdmin ? handleApprove : undefined
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              Exceptions & Substitutions
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage teacher absences and schedule changes
          </p>
        </div>

        {userIsAdmin && onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Exception
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading exceptions...</div>
        ) : (
          <GenericDataTable<TimetableException>
            data={exceptions}
            columns={columns}
            emptyStateMessage="No exceptions found. Create your first exception to manage schedule changes."
            searchPlaceholder="Search exceptions..."
            idField="id"
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Exception"
        message={`Are you sure you want to delete this exception? Reason: "${deleteModal.reason}"`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteExceptionMutation.isPending}
      />
    </div>
  );
}
