import { useState } from 'react';
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
import { ChevronDown, ChevronUp, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { DailyDiaryResponse } from '~/types/dailyDiary';

interface DailyDiaryTableProps {
  data: DailyDiaryResponse[];
  globalFilter: string;
  onView: (diary: DailyDiaryResponse) => void;
  onEdit: (diary: DailyDiaryResponse) => void;
  onDelete: (id: string) => void;
}

interface TableMetaType {
  onView: (diary: DailyDiaryResponse) => void;
  onEdit: (diary: DailyDiaryResponse) => void;
  onDelete: (id: string) => void;
}

const fuzzyFilter: FilterFn<DailyDiaryResponse> = (row, columnId, filterValue: string) => {
  // Check if filter value is empty
  if (!filterValue || filterValue.trim() === '') return true;
  
  // Handle special case for searching by title or description
  if (columnId === 'title') {
    const title = String(row.getValue('title')).toLowerCase();
    const description = String(row.original.description).toLowerCase();
    const searchTerm = filterValue.toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
  }
  
  // For other columns - standard text search
  const value = row.getValue(columnId);
  if (value === null || value === undefined) return false;
  return String(value).toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<DailyDiaryResponse>();

const getColumns = () => [
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
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </span>
      </div>
    ),
    sortingFn: 'datetime',
  }),
  columnHelper.accessor(row => row.classId.className, {
    id: 'classDisplay',
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
      <div className="text-sm text-gray-700">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('title', {
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
        <span>Title</span>
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
  columnHelper.accessor('description', {
    header: ({ column }) => (
      <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
        <span>Description</span>
        {column.getIsSorted() === 'asc' ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : column.getIsSorted() === 'desc' ? (
          <ChevronDown className="ml-1 h-4 w-4" />
        ) : null}
      </div>
    ),
    cell: (info) => (
      <div className="text-sm text-gray-600 truncate max-w-xs">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('attachments', {
    header: "Files",
    cell: (info) => {
      const attachments = info.getValue();
      return attachments?.length ? (
        <div className="flex items-center">
          <FileText className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-500">{attachments.length}</span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">None</span>
      );
    },
  }),
  columnHelper.accessor('id', {
    header: () => <div className="text-right">Actions</div>,
    cell: (info) => (
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => (info.table.options.meta as TableMetaType).onView(info.row.original)}
          className="text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          View
        </button>
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

export function DailyDiaryTable({ 
  data, 
  globalFilter,
  onView,
  onEdit,
  onDelete
}: DailyDiaryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true } // Default sort by date descending
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns: getColumns(),
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onView,
      onEdit,
      onDelete,
    } as TableMetaType,
  });

  return (
    <div>
      <div className="overflow-x-auto">
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
            No diary entries found.
          </div>
        )}
      </div>

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
  );
}
