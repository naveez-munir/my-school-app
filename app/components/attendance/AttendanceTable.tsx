import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { AttendanceStatus, AttendanceType, type AttendanceRecord } from '~/types/attendance';
import { GenericDataTable } from '../common/table/GenericDataTable';

interface TableMetaType {
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
  onViewDetails: (record: AttendanceRecord) => void;
  onCheckout: (id: string) => void;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
  onViewDetails: (record: AttendanceRecord) => void;
  onCheckout: (id: string) => void;
  userType?: AttendanceType;
}

const getStatusClass = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
    case AttendanceStatus.ABSENT:
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800';
    case AttendanceStatus.LATE:
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800';
    case AttendanceStatus.LEAVE:
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800';
    default:
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800';
  }
};

const columnHelper = createColumnHelper<AttendanceRecord>();

export function AttendanceTable({
  data,
  onEdit,
  onDelete,
  onViewDetails,
  onCheckout,
  userType
}: AttendanceTableProps) {
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor(row => row.user.name, {
        id: 'userName',
        header: ({ column }) => (
          <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
            <span>Name</span>
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        ),
        cell: (info) => (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),

      // Only show class for students if not filtering by user type or specifically showing students
      ...((!userType || userType === AttendanceType.STUDENT) ? [
        columnHelper.accessor(row => row.class?.className, {
          id: 'className',
          header: ({ column }) => (
            <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
              <span>Class</span>
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-1 h-4 w-4" />
              ) : null}
            </div>
          ),
          cell: (info) => (
            <div className="text-gray-500">
              {info.getValue() || '—'}
            </div>
          ),
        })
      ] : []),

      columnHelper.accessor('date', {
        header: ({ column }) => (
          <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
            <span>Date</span>
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        ),
        cell: (info) => (
          <div className="text-gray-500">
            {format(new Date(info.getValue()), 'MMM dd, yyyy')}
          </div>
        ),
      }),
      
      columnHelper.accessor('status', {
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
        cell: (info) => (
          <span className={getStatusClass(info.getValue())}>
            {info.getValue()}
          </span>
        ),
      }),

      columnHelper.accessor('checkInTime', {
        header: () => <span>Check In</span>,
        cell: (info) => (
          <div className="text-gray-500">
            {info.getValue() || '—'}
          </div>
        ),
      }),

      columnHelper.accessor('checkOutTime', {
        header: () => <span>Check Out</span>,
        cell: (info) => {
          const record = info.row.original;
          const checkOutTime = info.getValue();
          const canCheckout = (record.status === AttendanceStatus.PRESENT || record.status === AttendanceStatus.LATE)
                             && record.checkInTime && !checkOutTime;

          return (
            <div className="text-gray-500">
              {checkOutTime || (canCheckout ? (
                <button
                  onClick={() => onCheckout(record.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                  title="Check Out"
                >
                  <LogOut className="h-3 w-3" />
                  Check Out
                </button>
              ) : '—')}
            </div>
          );
        },
      }),
      
      columnHelper.accessor('id', {
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => onViewDetails(info.row.original)}
              className="text-indigo-600 hover:text-indigo-900 cursor-pointer p-1"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(info.row.original)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer p-1"
              title="Edit"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(info.getValue())}
              className="text-red-600 hover:text-red-900 cursor-pointer p-1"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ),
      }),
    ];
    
    // If we're not filtering by type, include the user type column
    if (!userType) {
      return [
        ...baseColumns.slice(0, 1), // Username
        columnHelper.accessor(row => row.user.type, {
          id: 'userType',
          header: ({ column }) => (
            <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
              <span>Type</span>
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="ml-1 h-4 w-4" />
              ) : null}
            </div>
          ),
          cell: (info) => (
            <div className="text-gray-500">
              {info.getValue()}
            </div>
          ),
        }),
        ...baseColumns.slice(1) // Rest of columns
      ];
    }
    
    return baseColumns;
  }, [onViewDetails, onEdit, onDelete, onCheckout, userType]);

  const tableData = useMemo(() => {
    if (userType) {
      return data.filter(record => record.user.type === userType);
    }
    return data;
  }, [data, userType]);

  return (
    <GenericDataTable
      data={tableData}
      columns={columns}
      emptyStateMessage="No attendance records found matching your search."
      searchPlaceholder="Search all columns..."
      meta={{
        onEdit,
        onDelete,
        onViewDetails,
        onCheckout,
      } as TableMetaType}
    />
  );
}
