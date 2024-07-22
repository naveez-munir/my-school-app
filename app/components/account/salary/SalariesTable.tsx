import { createColumnHelper } from '@tanstack/react-table';
import {
  type SalaryResponse,
  EmployeeType,
  SalaryStatus,
  SalaryStatusLabels
} from '~/types/salary.types';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Pencil, Printer, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '~/utils/currencyUtils';
import { isAdmin } from '~/utils/auth';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { months } from '~/utils/studentFeeData';

interface TableMetaType {
  onView: (salary: SalaryResponse) => void;
  onEdit?: (salary: SalaryResponse) => void;
  onApprove?: (id: string) => void;
  onPayment?: (id: string) => void;
  onCancel?: (id: string) => void;
  onGenerateSlip: (id: string) => void;
}

interface SalariesTableProps {
  data: SalaryResponse[];
  onView: (salary: SalaryResponse) => void;
  onEdit?: (salary: SalaryResponse) => void;
  onApprove?: (id: string) => void;
  onPayment?: (id: string) => void;
  onCancel?: (id: string) => void;
  onGenerateSlip: (id: string) => void;
  readOnly?: boolean;
}

const columnHelper = createColumnHelper<SalaryResponse>();

export function SalariesTable({
  data,
  onView,
  onEdit,
  onApprove,
  onPayment,
  onCancel,
  onGenerateSlip,
  readOnly = false
}: SalariesTableProps) {
  const getMonthName = (month: number) => {
    return months[month - 1];
  };

  const columns = useMemo(() => [
    columnHelper.accessor(row => row.employeeName || 'Unknown', {
      id: 'employeeName',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Employee</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('employeeType', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Type</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
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
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('basicSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Basic Salary</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('grossSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Gross Salary</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('netSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Net Salary</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm font-medium text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Status</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
          <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
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
        
        const meta = info.table.options.meta as TableMetaType;

        return (
          <div className="flex justify-end gap-1.5 sm:gap-2">
            <button
              onClick={() => meta.onView(salary)}
              className="text-indigo-600 hover:text-indigo-900 p-0.5 sm:p-1 lg:p-1.5"
              title="View Details"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </button>

            {!readOnly && meta.onEdit && status === SalaryStatus.PENDING && (
              <button
                onClick={() => meta.onEdit!(salary)}
                className="text-blue-600 hover:text-blue-900 p-0.5 sm:p-1 lg:p-1.5"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </button>
            )}

            {!readOnly && meta.onApprove && isAdmin() && (status === SalaryStatus.PENDING || status === SalaryStatus.PROCESSED) && (
              <button
                onClick={() => meta.onApprove!(id)}
                className="text-green-600 hover:text-green-900 p-0.5 sm:p-1 lg:p-1.5"
                title="Approve"
              >
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </button>
            )}

            {!readOnly && meta.onPayment && isAdmin() && status === SalaryStatus.APPROVED && (
              <button
                onClick={() => meta.onPayment!(id)}
                className="text-purple-600 hover:text-purple-900 p-0.5 sm:p-1 lg:p-1.5"
                title="Process Payment"
              >
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </button>
            )}

            {!readOnly && meta.onCancel && isAdmin() && (status === SalaryStatus.PENDING || status === SalaryStatus.PROCESSED) && (
              <button
                onClick={() => meta.onCancel!(id)}
                className="text-red-600 hover:text-red-900 p-0.5 sm:p-1 lg:p-1.5"
                title="Cancel"
              >
                <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </button>
            )}

            <button
              onClick={() => (info.table.options.meta as TableMetaType).onGenerateSlip(id)}
              className="text-gray-600 hover:text-gray-900 p-0.5 sm:p-1 lg:p-1.5"
              title="Generate Salary Slip"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            </button>
          </div>
        );
      },
    }),
  ], [readOnly]);

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No salaries found."
      searchPlaceholder="Search by employee name, status, etc."
      meta={{
        onView,
        onEdit,
        onApprove,
        onPayment,
        onCancel,
        onGenerateSlip
      } as TableMetaType}
    />
  );
}
