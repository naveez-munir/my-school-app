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
import type { FeeStructure, PopulatedFeeStructure } from '~/types/studentFee';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { useClasses } from '~/hooks/useClassQueries';

interface TableMetaType {
  onEdit: (structure: FeeStructure | PopulatedFeeStructure) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onClone: (structure: FeeStructure | PopulatedFeeStructure) => void;
}

interface FeeStructuresTableProps {
  data: (FeeStructure | PopulatedFeeStructure)[];
  onEdit: (structure: FeeStructure | PopulatedFeeStructure) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onClone: (structure: FeeStructure | PopulatedFeeStructure) => void;
}

// Helper function to check if a structure is populated
const isPopulatedStructure = (
  structure: FeeStructure | PopulatedFeeStructure
): structure is PopulatedFeeStructure => {
  return structure.feeComponents.length > 0 && 
    typeof structure.feeComponents[0].feeCategory === 'object';
};

const fuzzyFilter: FilterFn<FeeStructure | PopulatedFeeStructure> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<FeeStructure | PopulatedFeeStructure>();

export function FeeStructuresTable({ 
  data, 
  onEdit,
  onDelete,
  onToggleStatus,
  onClone
}: FeeStructuresTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: classes = [], isLoading: loading } = useClasses();
  const getClassName = (id: string) => {
    const matchingClass = classes.find(c => c.id === id);
    return matchingClass ? matchingClass.className : 'Unknown';
  }

  const columns = useMemo(() => [
    columnHelper.accessor('academicYear', {
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
    columnHelper.accessor(row => {
      if (isPopulatedStructure(row) && typeof row.className === 'string') {
        return row.className;
      }
      return getClassName(row.classId);
    }, {
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
        <div className="text-sm text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor(row => {
      return row.feeComponents?.length || 0;
    }, {
      id: 'componentCount',
      header: 'Components',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()} items
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Created Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor('_id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => (info.table.options.meta as TableMetaType).onToggleStatus(info.getValue())}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
            title={info.row.original.isActive ? "Deactivate" : "Activate"}
          >
            {info.row.original.isActive ? 
              <ToggleRight className="h-5 w-5 text-green-600" /> : 
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            }
          </button>
          <button
            onClick={() => (info.table.options.meta as TableMetaType).onClone(info.row.original)}
            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
            title="Clone Structure"
          >
            <Copy className="h-5 w-5" />
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
      onEdit,
      onDelete,
      onToggleStatus,
      onClone
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
            placeholder="Search..."
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
                      ${header.id.includes('_id') ? 'text-right' : 'text-left'}`}
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
                      ${cell.column.id.includes('_id') ? 'text-right' : 'text-left'}`}
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
            No fee structures found.
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
