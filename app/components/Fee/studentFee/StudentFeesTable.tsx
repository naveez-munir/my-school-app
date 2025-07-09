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
import type { StudentFee, PopulatedStudentFee, FeeStatus } from '~/types/studentFee';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, DollarSign, X, Eye } from 'lucide-react';
import { formatCurrency, getFeeStatusDisplayName, getFeeStatusClassName } from '~/types/studentFee';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import type { StudentResponse } from '~/types/student';
import type { ClassResponse } from '~/types/class';

// Use a type alias for fees that can be either populated or not
type AnyStudentFee = StudentFee | PopulatedStudentFee;

interface TableMetaType {
  onDiscount: (fee: AnyStudentFee) => void;
  onCancel: (id: string) => void;
}

interface StudentFeesTableProps {
  data: AnyStudentFee[];
  onDiscount: (fee: AnyStudentFee) => void;
  onCancel: (id: string) => void;
  students: StudentResponse[];
  classes: ClassResponse[];
}

const fuzzyFilter: FilterFn<AnyStudentFee> = (row, columnId, filterValue: string) => {
  if (columnId === 'studentId') {
    // Special handling for studentId which might be an object
    const student = row.original.studentId;
    if (typeof student === 'object' && student !== null) {
      const studentName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const rollNumber = student.rollNumber?.toLowerCase() || '';
      return studentName.includes(filterValue.toLowerCase()) || 
             rollNumber.includes(filterValue.toLowerCase());
    }
    return String(student).toLowerCase().includes(filterValue.toLowerCase());
  }
  
  const value = row.getValue(columnId);
  if (typeof value === 'string') {
    return value.toLowerCase().includes(filterValue.toLowerCase());
  }
  if (value !== null && value !== undefined) {
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  }
  return false;
};

const columnHelper = createColumnHelper<AnyStudentFee>();

export function StudentFeesTable({ 
  data, 
  onDiscount,
  onCancel,
  students,
  classes,
}: StudentFeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'dueDate', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const getStudentName = (studentId: any): string => {
    if (students) {
      const student =  students.filter((student) => student.id === studentId);
      return student[0]?.name || studentId;
    }
    return studentId;
  };
  
  const getStudentRollNumber = (studentId: any): string | null => {
    if (students) {
      const student =  students.filter((student) => student.id === studentId);
      return student[0]?.rollNumber;
    }
    return null;
  };
  
  const getClassName = (studentId: any): string | null => {
    if (classes.length> 0 && students.length > 0) {
      const student = students.filter((student) => student.id === studentId);
      const studentClass = classes.filter((classItem) => classItem.id === student[0]?.classId);
      if (studentClass.length > 0) {
        return studentClass[0].className;
      }
      return `Class ID: ${studentId.class}`;
    }
    return null;
  };
  
  const columns = useMemo(() => [
    columnHelper.accessor('studentId', {
      header: 'Student',
      cell: (info) => {
        const student = info.getValue();
        const studentName = getStudentName(student);
        const rollNumber = getStudentRollNumber(student);
        const className = getClassName(student);
        
        return (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {studentName}
            </div>
            {rollNumber && (
              <div className="text-xs text-gray-500">
                Roll #: {rollNumber}
              </div>
            )}
            {className && (
              <div className="text-xs text-gray-500">
                Class: {className}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('academicYear', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Year</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor(row => {
      const billType = row.billType;
      const month = row.billMonth;
      const quarter = row.quarter;
      
      if (billType === 'MONTHLY' && month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1] || `Month ${month}`;
      }
      
      if (billType === 'QUARTERLY' && quarter) {
        return `Q${quarter}`;
      }
      
      return billType;
    }, {
      id: 'period',
      header: 'Period',
      cell: (info) => info.getValue(),
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
        const status = info.getValue() as FeeStatus;
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${getFeeStatusClassName(status)}`}>
            {getFeeStatusDisplayName(status)}
          </span>
        );
      },
    }),
    columnHelper.accessor('dueDate', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Due Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('netAmount', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Net Amount</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('paidAmount', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Paid</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('dueAmount', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Due</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('_id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const fee = info.row.original;
        const canApplyDiscount = fee.status !== 'PAID' && fee.status !== 'CANCELLED';
        const canCancel = fee.status !== 'CANCELLED' && fee.status !== 'PAID';
        
        return (
          <div className="flex justify-end space-x-2">
            {canApplyDiscount && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onDiscount(fee)}
                className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                title="Apply Discount"
              >
                <DollarSign className="h-4 w-4" />
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onCancel(info.getValue())}
                className="text-red-600 hover:text-red-900 p-1 rounded"
                title="Cancel Fee"
              >
                <X className="h-4 w-4" />
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
      onDiscount,
      onCancel,
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
            placeholder="Search by student name, roll number, etc."
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
            No student fees found.
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
