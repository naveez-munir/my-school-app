import { useState } from "react";
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { FeePayment } from '~/types/studentFee';
import { formatCurrency } from '~/types/studentFee';
import { ReceiptIcon, CheckCircle, XCircle } from "lucide-react";

interface PaymentHistoryTableProps {
  payments: FeePayment[];
  onViewReceipt: (paymentId: string) => void;
}

const columnHelper = createColumnHelper<FeePayment>();

export function PaymentHistoryTable({ 
  payments,
  onViewReceipt,
}: PaymentHistoryTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = [
    columnHelper.accessor('paymentDate', {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor('paymentMode', {
      header: "Mode",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('amount', {
      header: "Amount",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
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
    }),
    columnHelper.accessor('_id', {
      header: "Actions",
      cell: (info) => (
        <button
          onClick={() => onViewReceipt(info.getValue())}
          className="text-blue-600 hover:text-blue-900"
          title="View Receipt"
        >
          <ReceiptIcon className="h-4 w-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: payments,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (payments.length === 0) {
    return (
      <div className="bg-gray-50 p-4 text-center text-gray-500 rounded-md">
        No payment history available.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
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
      
      {table.getPageCount() > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
