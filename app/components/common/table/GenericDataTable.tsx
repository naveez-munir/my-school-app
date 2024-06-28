import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type FilterFn,
  type SortingState,
  type ColumnDef,
  type PaginationState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Generic types for the table
export interface TableMetaType<T> {
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  [key: string]: any;
}

export interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  showSearchBox?: boolean;
  idField?: keyof T;
  meta?: Record<string, any>;
}

// Generic fuzzy filter function
export const fuzzyFilter: FilterFn<any> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

export function GenericDataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  initialPageSize = 20,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  emptyStateMessage = "No items found.",
  searchPlaceholder = "Search all columns...",
  showSearchBox = true,
  idField,
  meta: customMeta,
}: GenericTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
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
    meta: customMeta || {
      onEdit,
      onDelete,
    } as TableMetaType<T>,
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search and page size controls */}
      <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {showSearchBox && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  table.setPageIndex(0); // Reset to first page when searching
                }}
                placeholder={searchPlaceholder}
                className="mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm text-gray-500"
              />
            </div>
          )}
          <div className="flex items-end">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm text-gray-500 cursor-pointer"
            >
              {pageSizeOptions.map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      scope="col"
                      className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 text-xs lg:text-sm font-medium text-gray-500 capitalize tracking-wider
                        ${header.id.includes('id') || header.id.includes('_id') ? 'text-right' : 'text-left'}`}
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
                      className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-4 text-xs lg:text-sm whitespace-nowrap
                        ${cell.column.id.includes('id') || cell.column.id.includes('_id') ? 'text-right' : 'text-left'}`}
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
            <div className="text-center py-6 sm:py-8 text-sm text-gray-500">
              {emptyStateMessage}
            </div>
          )}
        </div>

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:justify-start items-center w-full sm:w-auto">
              <div>
                <span className="text-xs sm:text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total)
                </span>
              </div>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 border text-gray-500 rounded text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 border text-gray-500 rounded text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
