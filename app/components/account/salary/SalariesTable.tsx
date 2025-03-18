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
import { 
  type SalaryResponse, 
  EmployeeType, 
  SalaryStatus, 
  SalaryStatusLabels 
} from '~/types/salary.types';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, FileText, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';

interface TableMetaType {
  onView: (salary: SalaryResponse) => void;
  onEdit: (salary: SalaryResponse) => void;
  onApprove: (id: string) => void;
  onPayment: (id: string) => void;
  onCancel: (id: string) => void;
  onGenerateSlip: (id: string) => void;
}

interface SalariesTableProps {
  data: SalaryResponse[];
  onView: (salary: SalaryResponse) => void;
  onEdit: (salary: SalaryResponse) => void;
  onApprove: (id: string) => void;
  onPayment: (id: string) => void;
  onCancel: (id: string) => void;
  onGenerateSlip: (id: string) => void;
}

const fuzzyFilter: FilterFn<SalaryResponse> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<SalaryResponse>();

export function SalariesTable({ 
  data, 
  onView,
  onEdit,
  onApprove,
  onPayment,
  onCancel,
  onGenerateSlip
}: SalariesTableProps) {
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

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
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
    columnHelper.accessor(row => `${getMonthName(row.month)} ${row.year}`, {
      id: 'period',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Period</span>
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
    columnHelper.accessor('grossSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Gross Salary</span>
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
    columnHelper.accessor('netSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Net Salary</span>
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
        let bgColor, textColor;
        
        switch (status) {
          case SalaryStatus.PAID:
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            break;
          case SalaryStatus.APPROVED:
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            break;
          case SalaryStatus.PROCESSED:
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            break;
          case SalaryStatus.CANCELLED:
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            break;
          default:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
        }
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
            {SalaryStatusLabels[status as SalaryStatus]}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        const salary = info.row.original;
        const status = salary.status as SalaryStatus;
        
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onView(salary)}
              className="text-indigo-600 hover:text-indigo-900 p-1"
              title="View Details"
            >
              <FileText className="h-4 w-4" />
            </button>
            
            {status === SalaryStatus.PENDING && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onEdit(salary)}
                className="text-blue-600 hover:text-blue-900 p-1"
                title="Edit"
              >
                Edit
              </button>
            )}
            
            {(status === SalaryStatus.PENDING || status === SalaryStatus.PROCESSED) && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onApprove(id)}
                className="text-green-600 hover:text-green-900 p-1"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            
            {status === SalaryStatus.APPROVED && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onPayment(id)}
                className="text-purple-600 hover:text-purple-900 p-1"
                title="Process Payment"
              >
                <CreditCard className="h-4 w-4" />
              </button>
            )}
            
            {(status === SalaryStatus.PENDING || status === SalaryStatus.PROCESSED) && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onCancel(id)}
                className="text-red-600 hover:text-red-900 p-1"
                title="Cancel"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onGenerateSlip(id)}
              className="text-gray-600 hover:text-gray-900 p-1"
              title="Generate Salary Slip"
            >
              <FileText className="h-4 w-4" />
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
      onView,
      onEdit,
      onApprove,
      onPayment,
      onCancel,
      onGenerateSlip
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
            placeholder="Search by employee name, status, etc."
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
            No salaries found.
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
