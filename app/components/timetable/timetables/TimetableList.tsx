import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';
import { ConfirmationModal } from '~/components/common/ConfirmationModal';
import { useTimetables, useDeleteTimetable, useUpdateTimetableStatus, useAutoGenerateTimetable } from '~/hooks/useTimetableQueries';
import { Calendar, Plus, Edit, Trash2, Eye, CheckCircle, Archive, Sparkles, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAdmin } from '~/utils/auth';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { useNavigate } from 'react-router';
import type { Timetable, AutoGenerateTimetableDto } from '~/types/timetable';
import { AutoGenerateModal } from './AutoGenerateModal';
import { TimetablePrint } from './TimetablePrint';

const columnHelper = createColumnHelper<Timetable>();

function createTimetableColumns(
  onView?: (timetable: Timetable) => void,
  onEdit?: (timetable: Timetable) => void,
  onDelete?: (timetable: Timetable) => void,
  onPublish?: (timetable: Timetable) => void,
  onArchive?: (timetable: Timetable) => void,
  onPrint?: (timetable: Timetable) => void
) {
  const columns = [
    columnHelper.accessor('displayName', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Timetable Name" />
      ),
      cell: (info) => (
        <span className="font-semibold text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('className', {
      header: ({ column }) => (
        <SortableColumnHeader column={column} title="Class" />
      ),
      cell: (info) => (
        <span className="text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('academicYear', {
      header: 'Academic Year',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('effectiveFrom', {
      header: 'Effective From',
      cell: (info) => (
        <span className="text-gray-700">
          {formatUserFriendlyDate(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const statusColors = {
          DRAFT: 'bg-gray-100 text-gray-800',
          ACTIVE: 'bg-green-100 text-green-800',
          ARCHIVED: 'bg-yellow-100 text-yellow-800',
          INACTIVE: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('generationType', {
      header: 'Type',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() === 'MANUAL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {info.getValue() === 'MANUAL' ? 'Manual' : 'Auto'}
        </span>
      ),
    }),
    columnHelper.accessor('schedule', {
      header: 'Slots',
      cell: (info) => (
        <span className="text-gray-700">{info.getValue()?.length || 0}</span>
      ),
    }),
  ];

  if (onView || onEdit || onDelete || onPublish || onArchive || onPrint) {
    columns.push(
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => {
          const timetable = info.row.original;
          return (
            <div className="flex justify-end space-x-2">
              {onView && (
                <button
                  onClick={() => onView(timetable)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              {onEdit && timetable.status === 'DRAFT' && (
                <button
                  onClick={() => onEdit(timetable)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onPublish && timetable.status === 'DRAFT' && (
                <button
                  onClick={() => onPublish(timetable)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                  title="Publish"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              {onArchive && timetable.status === 'ACTIVE' && (
                <button
                  onClick={() => onArchive(timetable)}
                  className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                  title="Archive"
                >
                  <Archive className="h-4 w-4" />
                </button>
              )}
              {onDelete && timetable.status === 'DRAFT' && (
                <button
                  onClick={() => onDelete(timetable)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              {onPrint && (
                <button
                  onClick={() => onPrint(timetable)}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                  title="Print Timetable"
                >
                  <Printer className="h-4 w-4" />
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

export function TimetableList() {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    timetableId?: string;
    timetableName?: string
  }>({
    isOpen: false
  });
  const [autoGenerateModal, setAutoGenerateModal] = useState(false);
  const [timetableToPrint, setTimetableToPrint] = useState<Timetable | null>(null);

  const { data: timetables = [], isLoading } = useTimetables();
  const deleteTimetableMutation = useDeleteTimetable();
  const updateStatusMutation = useUpdateTimetableStatus();
  const autoGenerateMutation = useAutoGenerateTimetable();

  const userIsAdmin = isAdmin();

  const handleView = (timetable: Timetable) => {
    navigate(`/dashboard/timetable/timetables/${timetable.id}`);
  };

  const handleEdit = (timetable: Timetable) => {
    navigate(`/dashboard/timetable/timetables/${timetable.id}`);
  };

  const handleDeleteClick = (timetable: Timetable) => {
    setDeleteModal({
      isOpen: true,
      timetableId: timetable.id,
      timetableName: timetable.displayName
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.timetableId) {
      deleteTimetableMutation.mutate(deleteModal.timetableId, {
        onSuccess: () => {
          toast.success('Timetable deleted successfully');
          setDeleteModal({ isOpen: false });
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to delete timetable');
        }
      });
    }
  };

  const handlePublish = (timetable: Timetable) => {
    updateStatusMutation.mutate(
      { id: timetable.id, status: 'ACTIVE' },
      {
        onSuccess: () => {
          toast.success('Timetable published successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to publish timetable');
        }
      }
    );
  };

  const handleArchive = (timetable: Timetable) => {
    updateStatusMutation.mutate(
      { id: timetable.id, status: 'ARCHIVED' },
      {
        onSuccess: () => {
          toast.success('Timetable archived successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to archive timetable');
        }
      }
    );
  };

  const handleAutoGenerate = (data: AutoGenerateTimetableDto) => {
    autoGenerateMutation.mutate(data, {
      onSuccess: (result) => {
        toast.success('Timetable generated successfully!');
        setAutoGenerateModal(false);
        navigate(`/dashboard/timetable/timetables/${result.id}`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to generate timetable');
      }
    });
  };

  const handlePrint = (timetable: Timetable) => {
    setTimetableToPrint(timetable);
    setTimeout(() => {
      window.print();
      setTimetableToPrint(null);
    }, 100);
  };

  const columns = createTimetableColumns(
    handleView,
    userIsAdmin ? handleEdit : undefined,
    userIsAdmin ? handleDeleteClick : undefined,
    userIsAdmin ? handlePublish : undefined,
    userIsAdmin ? handleArchive : undefined,
    handlePrint
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-gray-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
              Timetables
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage class timetables and schedules
          </p>
        </div>

        {userIsAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => setAutoGenerateModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Auto-Generate
            </button>
            <button
              onClick={() => navigate('/dashboard/timetable/timetables/new')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Manually
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading timetables...</div>
        ) : (
          <GenericDataTable<Timetable>
            data={timetables}
            columns={columns}
            emptyStateMessage="No timetables found. Create your first timetable to get started."
            searchPlaceholder="Search timetables..."
            idField="id"
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Timetable"
        message={`Are you sure you want to delete "${deleteModal.timetableName}"? This action cannot be undone.`}
        isLoading={deleteTimetableMutation.isPending}
      />

      <AutoGenerateModal
        isOpen={autoGenerateModal}
        onClose={() => setAutoGenerateModal(false)}
        onGenerate={handleAutoGenerate}
        isLoading={autoGenerateMutation.isPending}
      />

      {timetableToPrint && <TimetablePrint timetable={timetableToPrint} />}
    </div>
  );
}

