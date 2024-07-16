import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, CreditCard, Edit, Trash2, FilePenLine } from 'lucide-react';
import { type Expense, ExpenseStatus, ExpenseStatusLabels, ExpenseTypeLabels, PaymentMethodLabels } from '~/types/expense.types';
import { formatCurrency } from '~/utils/currencyUtils';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface TableMetaType {
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onApprove: (expense: Expense) => void;
  onProcessPayment: (expense: Expense) => void;
}

interface ExpenseTableProps {
  data: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onApprove: (expense: Expense) => void;
  onProcessPayment: (expense: Expense) => void;
}

const columnHelper = createColumnHelper<Expense>();

export function ExpenseTable({
  data,
  onEdit,
  onDelete,
  onApprove,
  onProcessPayment
}: ExpenseTableProps) {
  const getStatusClass = (status: ExpenseStatus) => {
    switch (status) {
      case ExpenseStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ExpenseStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ExpenseStatus.PAID:
        return 'bg-blue-100 text-blue-800';
      case ExpenseStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor('description', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Description</span>
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
    columnHelper.accessor('expenseType', {
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
          {ExpenseTypeLabels[info.getValue()]}
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
    columnHelper.accessor('expenseDate', {
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
            {ExpenseStatusLabels[status]}
          </span>
        );
      },
    }),
    columnHelper.accessor('billNumber', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Bill Number</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('vendorDetails', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Vendor</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        const expense = info.row.original;
        
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-3">
            {expense.status === ExpenseStatus.PENDING && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onApprove(expense)}
                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                title="Approve/Reject"
              >
                <FilePenLine className="h-5 w-5" />
              </button>
            )}
            
            {expense.status === ExpenseStatus.APPROVED && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onProcessPayment(expense)}
                className="text-green-600 hover:text-green-900 cursor-pointer"
                title="Process Payment"
              >
                <CreditCard className="h-5 w-5" />
              </button>
            )}
            
            {expense.status === ExpenseStatus.PENDING && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onEdit(expense)}
                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                title="Edit"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            
            {expense.status === ExpenseStatus.PENDING && (
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

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No expenses found."
      searchPlaceholder="Search by description, vendor, bill number..."
      meta={{
        onEdit,
        onDelete,
        onApprove,
        onProcessPayment
      } as TableMetaType}
    />
  );
}
