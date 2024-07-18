import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { formatCurrency } from '~/utils/currencyUtils';
import {
  type Payment,
  PaymentStatus,
  PaymentStatusLabels,
  PaymentTypeLabels,
  PaymentModeLabels,
  PaymentForLabels
} from '~/types/payment.types';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface TableMetaType {
  onView: (payment: Payment) => void;
}

interface PaymentsTableProps {
  data: Payment[];
  onView: (payment: Payment) => void;
}

const columnHelper = createColumnHelper<Payment>();

export function PaymentsTable({
  data,
  onView,
}: PaymentsTableProps) {
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
      cell: (info) => {
        const payment = info.row.original;
        return (
          <div className="text-sm text-gray-900">
            <div className="font-medium">
              {payment.displayName || PaymentForLabels[info.getValue()]}
            </div>
            {payment.displaySubtext && (
              <div className="text-xs text-gray-500 mt-0.5">
                {payment.displaySubtext}
              </div>
            )}
          </div>
        );
      },
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
          {formatUserFriendlyDate(info.getValue())}
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
          <div className="flex justify-end">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onView(payment)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
        );
      },
    }),
  ], []);

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      emptyStateMessage="No payments found."
      searchPlaceholder="Search by any field..."
      meta={{ onView } as TableMetaType}
    />
  );
}
