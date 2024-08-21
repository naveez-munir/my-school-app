import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import {
  type LeaveResponse,
  LeaveStatus,
} from '~/types/staffLeave';
import { LeaveTypeLabels, LeaveStatusLabels, EmployeeTypeLabels } from './LeaveDetailModal';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface TableMetaType {
  onView: (leave: LeaveResponse) => void;
  onEdit: (leave: LeaveResponse) => void;
  onCancel: (id: string) => void;
  onApprove: (leave: LeaveResponse) => void;
  onReject: (leave: LeaveResponse) => void;
  isAdmin: boolean;
}

interface LeavesTableProps {
  data: LeaveResponse[];
  onView: (leave: LeaveResponse) => void;
  onEdit: (leave: LeaveResponse) => void;
  onCancel: (id: string) => void;
  onApprove: (leave: LeaveResponse) => void;
  onReject: (leave: LeaveResponse) => void;
  isAdmin?: boolean;
}

const getStatusClass = (status: LeaveStatus) => {
  switch (status) {
    case LeaveStatus.APPROVED:
      return 'bg-green-100 text-green-800';
    case LeaveStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case LeaveStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    case LeaveStatus.CANCELLED:
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function LeavesTable({
  data,
  onView,
  onEdit,
  onCancel,
  onApprove,
  onReject,
  isAdmin = false
}: LeavesTableProps) {
  const columns = useMemo<ColumnDef<LeaveResponse>[]>(() => [
    {
      accessorKey: 'employeeName',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Employee</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue() as string || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'employeeType',
      header: 'Type',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {EmployeeTypeLabels[info.getValue() as keyof typeof EmployeeTypeLabels]}
        </div>
      ),
    },
    {
      accessorKey: 'leaveType',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Leave Type</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {LeaveTypeLabels[info.getValue() as keyof typeof LeaveTypeLabels]}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>From</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue() as string, '-')}
        </div>
      ),
    },
    {
      accessorKey: 'endDate',
      header: 'To',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue() as string, '-')}
        </div>
      ),
    },
    {
      accessorKey: 'numberOfDays',
      header: 'Days',
      cell: (info) => (
        <div className="text-sm text-center font-medium text-gray-900">
          {info.getValue() as number}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Status</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const status = info.getValue() as LeaveStatus;
        return (
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
            {LeaveStatusLabels[status]}
          </span>
        );
      },
    },
    {
      accessorKey: 'approverName',
      header: 'Approved By',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() as string || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'id',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue() as string;
        const leave = info.row.original;
        const meta = info.table.options.meta as TableMetaType;

        if (!id) return null;

        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => meta.onView(leave)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>

            {leave.status === LeaveStatus.PENDING && (
              <>
                <button
                  onClick={() => meta.onEdit(leave)}
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>

                {meta.isAdmin && (
                  <>
                    <button
                      onClick={() => meta.onApprove(leave)}
                      className="text-green-600 hover:text-green-900 cursor-pointer"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => meta.onReject(leave)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      title="Reject"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => meta.onCancel(id)}
                  className="text-gray-600 hover:text-gray-900 cursor-pointer"
                  title="Cancel"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ], [isAdmin]);

  return (
    <GenericDataTable<LeaveResponse>
      data={data}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      searchPlaceholder="Search by employee name, type..."
      emptyStateMessage="No leave requests found."
      meta={{
        onView,
        onEdit,
        onCancel,
        onApprove,
        onReject,
        isAdmin
      } as TableMetaType}
    />
  );
}
