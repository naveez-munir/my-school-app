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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TextInput } from '../common/form/inputs/TextInput';
import { format } from 'date-fns';
import { AttendanceStatus, AttendanceType, type AttendanceRecord } from '~/types/attendance';

interface TableMetaType {
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
  onViewDetails: (record: AttendanceRecord) => void;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (id: string) => void;
  onViewDetails: (record: AttendanceRecord) => void;
  userType?: AttendanceType;
}

const fuzzyFilter: FilterFn<AttendanceRecord> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const getStatusClass = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.PRESENT: 
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800';
    case AttendanceStatus.ABSENT: 
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800';
    case AttendanceStatus.LATE: 
      return 'inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800';
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
  userType 
}: AttendanceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Define columns based on common fields and user type
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
          <div className="text-sm font-medium text-gray-900">
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
            <div className="text-sm text-gray-500">
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
          <div className="text-sm text-gray-500">
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
      
      columnHelper.accessor('id', {
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => (
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => onViewDetails(info.row.original)}
              className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
            >
              View
            </button>
            <button
              onClick={() => onEdit(info.row.original)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(info.getValue())}
              className="text-red-600 hover:text-red-900 cursor-pointer"
            >
              Delete
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
            <div className="text-sm text-gray-500">
              {info.getValue()}
            </div>
          ),
        }),
        ...baseColumns.slice(1) // Rest of columns
      ];
    }
    
    return baseColumns;
  }, [onViewDetails, onEdit, onDelete, userType]);

  const tableData = useMemo(() => {
    // Filter data by user type if provided
    if (userType) {
      return data.filter(record => record.user.type === userType);
    }
    return data;
  }, [data, userType]);

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
      onEdit,
      onDelete,
      onViewDetails,
    } as TableMetaType,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Search"
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(value)}
            placeholder="Search all columns..."
          />
          <div className="flex items-end">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
            >
              {[5, 10, 20, 30, 50].map(pageSize => (
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
                      ${cell.column.id.includes('id') && cell.column.id !== 'userId' ? 'text-right' : 'text-left'}`}
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
            No attendance records found.
          </div>
        )}

        {table.getRowModel().rows.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
