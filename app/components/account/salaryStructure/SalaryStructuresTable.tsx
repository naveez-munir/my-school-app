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
import { type SalaryStructureResponse, EmployeeType, EmployeeCategory, EmployeeCategoryLabels } from '~/types/salaryStructure';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';

interface TableMetaType {
  onEdit: (structure: SalaryStructureResponse) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

interface SalaryStructuresTableProps {
  data: SalaryStructureResponse[];
  onEdit: (structure: SalaryStructureResponse) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const fuzzyFilter: FilterFn<SalaryStructureResponse> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<SalaryStructureResponse>();

export function SalaryStructuresTable({ 
  data, 
  onEdit,
  onDelete,
  onToggleStatus,
}: SalaryStructuresTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const columns = useMemo(() => [
    columnHelper.accessor(row => row.employeeName || 'Unknown', {
      id: 'employeeName',
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
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('employeeType', {
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
        <div className="text-sm text-gray-900">
          {info.getValue() === EmployeeType.TEACHER ? 'Teacher' : 'Staff'}
        </div>
      ),
    }),
    columnHelper.accessor('employeeCategory', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Category</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {EmployeeCategoryLabels[info.getValue() as EmployeeCategory]}
        </div>
      ),
    }),
    columnHelper.accessor('basicSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Basic Salary</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('effectiveFrom', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Effective From</span>
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
    columnHelper.accessor('effectiveTo', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Effective To</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <div className="text-sm text-gray-500">
            {value ? new Date(value).toLocaleDateString() : 'Ongoing'}
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onToggleStatus(id)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              title={info.row.original.isActive ? "Deactivate" : "Activate"}
            >
              {info.row.original.isActive ? 
                <ToggleRight className="h-5 w-5 text-green-600" /> : 
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              }
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onEdit(info.row.original)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onDelete(id)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
            >
              Delete
            </button>
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
      onEdit,
      onDelete,
      onToggleStatus,
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
            No salary structures found.
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
