import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';
import { type StudentLeaveResponse } from '~/types/studentLeave';
import { LeaveStatusBadge } from './LeaveStatusBadge';
import { useStudentName } from '~/utils/hooks/useStudentName';

export type LeaveTableConfig = {
  showStudent?: boolean;
  showReason?: boolean;
  showComments?: boolean;
  showCreatedAt?: boolean;
  showRequestedBy?: boolean;
  actions?: (row: StudentLeaveResponse) => React.ReactNode;
};

export function createLeaveColumns(config: LeaveTableConfig = {}): ColumnDef<StudentLeaveResponse, any>[] {
  const columnHelper = createColumnHelper<StudentLeaveResponse>();
  const columns: ColumnDef<StudentLeaveResponse, any>[] = [];
  
  // Add student column if needed
  if (config.showStudent) {
    columns.push(
      columnHelper.accessor('studentId', {
        header: ({ column }) => <SortableColumnHeader column={column} title="Student" />,
        cell: (info) => {
          const StudentNameCell = () => {
            const studentName = useStudentName(info.getValue());
            return (
              <div className="text-sm text-gray-900">
                {studentName || info.getValue()}
              </div>
            );
          };
          return <StudentNameCell />;
        },
      })
    );
  }
  
  // Common columns
  columns.push(
    columnHelper.accessor('leaveType', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Leave Type" />,
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue().replace('_', ' ')}
        </div>
      ),
    }),
    columnHelper.accessor('startDate', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Start Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: ({ column }) => <SortableColumnHeader column={column} title="End Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </div>
      ),
    }),
    columnHelper.accessor('numberOfDays', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Days" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Status" />,
      cell: (info) => <LeaveStatusBadge status={info.getValue()} />,
    })
  );
  
  // Optional columns
  if (config.showReason) {
    columns.push(
      columnHelper.accessor('reason', {
        header: ({ column }) => <SortableColumnHeader column={column} title="Reason" />,
        cell: (info) => (
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {info.getValue() || '-'}
          </div>
        ),
      })
    );
  }
  
  if (config.showComments) {
    columns.push(
      columnHelper.accessor('comments', {
        header: ({ column }) => <SortableColumnHeader column={column} title="Comments" />,
        cell: (info) => (
          <div className="text-sm text-gray-500">
            {info.getValue() || '-'}
          </div>
        ),
      })
    );
  }
  
  if (config.showRequestedBy) {
    columns.push(
      columnHelper.accessor('requestedByParent', {
        header: ({ column }) => <SortableColumnHeader column={column} title="Requested By" />,
        cell: (info) => (
          <div className="text-sm text-gray-500">
            {info.getValue()}
          </div>
        ),
      })
    );
  }
  
  if (config.showCreatedAt) {
    columns.push(
      columnHelper.accessor('createdAt', {
        header: ({ column }) => <SortableColumnHeader column={column} title="Created At" />,
        cell: (info) => (
          <div className="text-sm text-gray-500">
            {format(new Date(info.getValue()), 'MMM dd, yyyy')}
          </div>
        ),
      })
    );
  }
  
  // Actions column
  if (config.actions) {
    columns.push(
      columnHelper.display({
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => (
          <div className="flex justify-end space-x-2">
            {config.actions!(info.row.original)}
          </div>
        ),
      })
    );
  }
  
  return columns;
}

interface LeaveTableBaseProps {
  data: StudentLeaveResponse[];
  isLoading: boolean;
  error: any;
  config?: LeaveTableConfig;
  title: string;
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  headerContent?: React.ReactNode;
}

export function LeaveBaseTable({
  data,
  isLoading,
  error,
  config = {},
  title,
  emptyStateMessage = "No leave records found.",
  searchPlaceholder = "Search leave records...",
  headerContent,
}: LeaveTableBaseProps) {
  const columns = createLeaveColumns(config);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading leave data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading leave data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {headerContent}
      </div>
      
      <GenericDataTable<StudentLeaveResponse>
        data={data}
        columns={columns}
        initialPageSize={10}
        emptyStateMessage={emptyStateMessage}
        searchPlaceholder={searchPlaceholder}
      />
    </div>
  );
}
