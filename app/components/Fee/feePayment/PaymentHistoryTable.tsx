import { useMemo } from "react";
import type { ColumnDef } from '@tanstack/react-table';
import type { FeePayment } from '~/types/studentFee';
import { formatCurrency } from '~/types/studentFee';
import { ReceiptIcon, CheckCircle, XCircle } from "lucide-react";
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface PaymentHistoryTableProps {
  payments: FeePayment[];
  onViewReceipt: (paymentId: string) => void;
  hideReceipt?: boolean;
}

interface TableMetaType {
  onViewReceipt: (paymentId: string) => void;
}

export function PaymentHistoryTable({
  payments,
  onViewReceipt,
  hideReceipt = false,
}: PaymentHistoryTableProps) {
  const columns = useMemo<ColumnDef<FeePayment, any>[]>(() => {
    const baseColumns: ColumnDef<FeePayment, any>[] = [
      {
        accessorKey: 'paymentDate',
        header: "Date",
        cell: (info) => formatUserFriendlyDate(info.getValue() as string),
      },
      {
        accessorKey: 'paymentMode',
        header: "Mode",
        cell: (info) => info.getValue() as string,
      },
      {
        accessorKey: 'amount',
        header: "Amount",
        cell: (info) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: 'status',
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          if (status === 'SUCCESS') {
            return (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Success
              </span>
            );
          } else if (status === 'FAILED') {
            return (
              <span className="flex items-center text-red-600">
                <XCircle className="h-4 w-4 mr-1" />
                Failed
              </span>
            );
          }
          return status;
        },
      },
    ];

    if (!hideReceipt) {
      baseColumns.push({
        accessorKey: '_id',
        header: "Actions",
        cell: (info) => {
          const meta = info.table.options.meta as TableMetaType;
          return (
            <button
              onClick={() => meta.onViewReceipt(info.getValue() as string)}
              className="text-blue-600 hover:text-blue-900"
              title="View Receipt"
            >
              <ReceiptIcon className="h-4 w-4" />
            </button>
          );
        },
      });
    }

    return baseColumns;
  }, [hideReceipt]);

  if (payments.length === 0) {
    return (
      <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
        No payment history available.
      </div>
    );
  }

  return (
    <GenericDataTable<FeePayment>
      data={payments}
      columns={columns}
      initialPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      emptyStateMessage="No payment history available."
      showSearchBox={false}
      meta={{
        onViewReceipt,
      } as TableMetaType}
    />
  );
}
