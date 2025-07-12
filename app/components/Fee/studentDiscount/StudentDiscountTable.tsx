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
import type { StudentDiscount } from '~/types/studentFee';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Edit, RefreshCw, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';

interface TableMetaType {
  onEdit: (discount: StudentDiscount) => void;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onSync: (id: string) => void;
}

interface StudentDiscountTableProps {
  discounts: StudentDiscount[];
  onEdit: (discount: StudentDiscount) => void;
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
  onSync: (id: string) => void;
}

const fuzzyFilter: FilterFn<StudentDiscount> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId);
  if (typeof value === 'string') {
    return value.toLowerCase().includes(filterValue.toLowerCase());
  }
  if (value !== null && value !== undefined) {
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  }
  return false;
};

const columnHelper = createColumnHelper<StudentDiscount>();

export function StudentDiscountTable({ 
  discounts, 
  onEdit,
  onToggleStatus,
  onRemove,
  onSync,
}: StudentDiscountTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'startDate', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => [
    columnHelper.accessor('discountType', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Discount Type</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const discountType = info.getValue();
        const formattedType = discountType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        return formattedType;
      },
    }),
    columnHelper.accessor(row => {
      const { discountValueType, discountValue } = row;
      if (discountValueType === 'PERCENTAGE') {
        return `${discountValue}%`;
      } else {
        return `${discountValue.toLocaleString()} PKR`;
      }
    }, {
      id: 'discountValue',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Amount</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => info.getValue(),
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
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
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
      cell: (info) => {
        const value = info.getValue();
        return value ? new Date(value as string).toLocaleDateString() : 'No End Date';
      },
    }),
    columnHelper.accessor(row => {
      const now = new Date();
      const startDate = new Date(row.startDate);
      const endDate = row.endDate ? new Date(row.endDate) : null;
      
      if (!row.isActive) {
        return 'Inactive';
      }
      
      if (startDate > now) {
        return 'Scheduled';
      }
      
      if (endDate && endDate < now) {
        return 'Expired';
      }
      
      return 'Active';
    }, {
      id: 'status',
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
        const status = info.getValue() as string;
        let statusClass = '';
        
        switch (status) {
          case 'Active':
            statusClass = 'bg-green-100 text-green-800';
            break;
          case 'Inactive':
            statusClass = 'bg-gray-100 text-gray-800';
            break;
          case 'Scheduled':
            statusClass = 'bg-blue-100 text-blue-800';
            break;
          case 'Expired':
            statusClass = 'bg-yellow-100 text-yellow-800';
            break;
        }
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('_id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const discount = info.row.original;
        const isActive = discount.isActive;
        
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onEdit(discount)}
              className="text-blue-600 hover:text-blue-900 p-1 rounded"
              title="Edit Discount"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onToggleStatus(info.getValue())}
              className={`${isActive ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'} p-1 rounded`}
              title={isActive ? "Deactivate Discount" : "Activate Discount"}
            >
              {isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onSync(info.getValue())}
              className="text-purple-600 hover:text-purple-900 p-1 rounded"
              title="Sync with Fees"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onRemove(info.getValue())}
              className="text-red-600 hover:text-red-900 p-1 rounded"
              title="Remove Discount"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }),
  ], []);

  const tableData = useMemo(() => discounts, [discounts]);

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
      onToggleStatus,
      onRemove,
      onSync,
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
            placeholder="Search by type, amount, etc."
          />
          <div className="flex items-end">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
            >
              {[5, 10, 20, 50].map(pageSize => (
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
            No discounts found.
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
