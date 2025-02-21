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
import type { StudentResponse } from '~/types/student';

interface StudentsTableProps {
  data: StudentResponse[];
  onEdit: (student: StudentResponse) => void;
  onDelete: (id: string) => void;
}

interface TableMetaType {
  onEdit: (student: StudentResponse) => void;
  onDelete: (id: string) => void;
}

const fuzzyFilter: FilterFn<StudentResponse> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  return value.toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<StudentResponse>();

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
        <span>Student Name</span>
        {column.getIsSorted() === 'asc' ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <ChevronDown className="ml-1 h-4 w-4" />
        ) : null}
      </div>
    ),
    cell: (info) => (
      <div className="flex items-center space-x-3">
        {info.row.original.photoUrl && (
          <img 
            src={info.row.original.photoUrl} 
            alt={info.getValue()}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('rollNumber', {
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
        <span>Roll No</span>
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
  columnHelper.accessor('className', {
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
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('guardianName', {
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
        <span>Guardian</span>
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
  columnHelper.accessor('status', {
    header: "Status",
    cell: (info) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {info.getValue() ? 'Active' : 'Inactive'}
      </span>
    ),
  }),
  columnHelper.accessor('id', {
    header: () => <div className="text-right">Actions</div>,
    cell: (info) => (
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => (info.table.options.meta as TableMetaType).onEdit(info.row.original)}
          className="text-blue-600 hover:text-blue-900 cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => (info.table.options.meta as TableMetaType).onDelete(info.getValue())}
          className="text-red-600 hover:text-red-900 cursor-pointer"
        >
          Delete
        </button>
      </div>
    ),
  }),
];

export function StudentsTable({ 
  data, 
  onEdit,
  onDelete 
}: StudentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

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
      onDelete,
    } as TableMetaType,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
            />
          </div>
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
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
          {/* Table Body */}
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

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found.
          </div>
        )}

        {/* Pagination */}
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
