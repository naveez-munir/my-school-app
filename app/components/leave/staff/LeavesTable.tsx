import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type FilterFn,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { 
  type LeaveResponse, 
  LeaveStatus, 
  LeaveType, 
  EmployeeType
} from '~/types/staffLeave';
import { LeaveTypeLabels, LeaveStatusLabels, EmployeeTypeLabels } from './LeaveDetailModal';

interface TableMetaType {
  onView: (leave: LeaveResponse) => void;
  onEdit: (leave: LeaveResponse) => void;
  onCancel: (id: string) => void;
  onApprove: (leave: LeaveResponse) => void;
  onReject: (leave: LeaveResponse) => void;
}

interface LeavesTableProps {
  data: LeaveResponse[];
  onView: (leave: LeaveResponse) => void;
  onEdit: (leave: LeaveResponse) => void;
  onCancel: (id: string) => void;
  onApprove: (leave: LeaveResponse) => void;
  onReject: (leave: LeaveResponse) => void;
}

const fuzzyFilter: FilterFn<LeaveResponse> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<LeaveResponse>();

export function LeavesTable({ 
  data, 
  onView,
  onEdit,
  onCancel,
  onApprove,
  onReject
}: LeavesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

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

  const columns = useMemo(() => [
    columnHelper.accessor('employeeName', {
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
          {info.getValue() || 'N/A'}
        </div>
      ),
    }),
    columnHelper.accessor('employeeType', {
      header: 'Type',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {EmployeeTypeLabels[info.getValue()]}
        </div>
      ),
    }),
    columnHelper.accessor('leaveType', {
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
          {LeaveTypeLabels[info.getValue()]}
        </div>
      ),
    }),
    columnHelper.accessor('startDate', {
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
          {formatDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: 'To',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('numberOfDays', {
      header: 'Days',
      cell: (info) => (
        <div className="text-sm text-center font-medium text-gray-900">
          {info.getValue()}
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
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
            {LeaveStatusLabels[status]}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        const leave = info.row.original;
        
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onView(leave)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
            
            {leave.status === LeaveStatus.PENDING && (
              <>
                <button
                  onClick={() => (info.table.options.meta as TableMetaType).onEdit(leave)}
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => (info.table.options.meta as TableMetaType).onApprove(leave)}
                  className="text-green-600 hover:text-green-900 cursor-pointer"
                  title="Approve"
                >
                  <Check className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => (info.table.options.meta as TableMetaType).onReject(leave)}
                  className="text-red-600 hover:text-red-900 cursor-pointer"
                  title="Reject"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => (info.table.options.meta as TableMetaType).onCancel(id)}
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
    }),
  ], []);

  const tableData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onView,
      onEdit,
      onCancel,
      onApprove,
      onReject
    } as TableMetaType,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Search Leave Requests"
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(value)}
            placeholder="Search by employee name, type..."
          />
          <div className="flex items-end">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
            >
              {[10, 20, 30, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    scope="col"
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                      ${header.id.includes('id') ? 'text-right' : 'text-left'}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className={`px-6 py-4 whitespace-nowrap
                      ${cell.column.id.includes('id') ? 'text-right' : 'text-left'}`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No leave requests found.
          </div>
        )}

        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total)
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
