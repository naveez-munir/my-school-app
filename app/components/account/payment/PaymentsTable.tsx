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
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Ban } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { 
  type Payment, 
  PaymentStatus, 
  PaymentStatusLabels, 
  PaymentTypeLabels, 
  PaymentModeLabels, 
  PaymentForLabels 
} from '~/types/payment.types';

interface TableMetaType {
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (payment: Payment, status: PaymentStatus) => void;
}

interface PaymentsTableProps {
  data: Payment[];
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (payment: Payment, status: PaymentStatus) => void;
}

const fuzzyFilter: FilterFn<Payment> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<Payment>();

export function PaymentsTable({ 
  data, 
  onView,
  onEdit,
  onDelete,
  onUpdateStatus
}: PaymentsTableProps) {
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

  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case PaymentStatus.REFUNDED:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor('paymentType', {
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
          {PaymentTypeLabels[info.getValue()]}
        </div>
      ),
    }),
    columnHelper.accessor('paymentFor', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Payment For</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {PaymentForLabels[info.getValue()]}
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
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
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('paymentMode', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Mode</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {PaymentModeLabels[info.getValue()]}
        </div>
      ),
    }),
    columnHelper.accessor('paymentDate', {
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
          {formatDate(info.getValue())}
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
            {PaymentStatusLabels[status]}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        const payment = info.row.original;
        
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onView(payment)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
            
            {payment.status === PaymentStatus.PENDING && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onEdit(payment)}
                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                title="Edit"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            
            {payment.status === PaymentStatus.COMPLETED && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onUpdateStatus(payment, PaymentStatus.REFUNDED)}
                className="text-purple-600 hover:text-purple-900 cursor-pointer"
                title="Mark as Refunded"
              >
                <Ban className="h-5 w-5" />
              </button>
            )}
            
            {(payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.FAILED) && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onDelete(id)}
                className="text-red-600 hover:text-red-900 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
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
      onDelete,
      onUpdateStatus
    } as TableMetaType,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Search Payments"
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(value)}
            placeholder="Search by any field..."
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
            No payments found.
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
