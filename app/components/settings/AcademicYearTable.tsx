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
import type { AcademicYear } from '~/types/academicYear';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface AcademicYearTableProps {
  data: AcademicYear[];
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (id: string) => void;
}

interface AcademicYearTableMetaType {
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (id: string) => void;
}

const fuzzyFilter: FilterFn<AcademicYear> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<AcademicYear>();

const AcademicYearTable: React.FC<AcademicYearTableProps> = ({
  data,
  onEdit,
  onDelete
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const columns = [
    columnHelper.accessor('displayName', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Academic Year</span>
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
    columnHelper.accessor('startDate', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Start Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>End Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
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
        const statusColor = status === 'Active' ? 'bg-green-100 text-green-800' :
                           status === 'Closed' ? 'bg-red-100 text-red-800' :
                           'bg-gray-100 text-gray-800';
        return (
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {status}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: 'Active',
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isActive ? 'Yes' : 'No'}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const academicYear = info.row.original;
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as AcademicYearTableMetaType).onEdit(academicYear)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => (info.table.options.meta as AcademicYearTableMetaType).onDelete(info.getValue())}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }),
  ];

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
      onEdit,
      onDelete
    } as AcademicYearTableMetaType,
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
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No academic years found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span>
              {' '}-{' '}
              <span className="font-medium">
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}
              </span>
              {' '}of{' '}
              <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>
              {' '}results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearTable;
