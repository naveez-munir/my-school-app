import { createColumnHelper } from '@tanstack/react-table';
import type { StudentDiscount } from '~/types/studentFee';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Edit, RefreshCw, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { formatCurrency } from '~/utils/currencyUtils';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

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

const columnHelper = createColumnHelper<StudentDiscount>();

export function StudentDiscountTable({
  discounts,
  onEdit,
  onToggleStatus,
  onRemove,
  onSync,
}: StudentDiscountTableProps) {
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
        return formatCurrency(discountValue);
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
      cell: (info) => formatUserFriendlyDate(info.getValue()),
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
        return value ? formatUserFriendlyDate(value as string) : 'No End Date';
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

  return (
    <GenericDataTable
      data={discounts}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
      emptyStateMessage="No discounts found."
      searchPlaceholder="Search by type, amount, etc."
      meta={{
        onEdit,
        onToggleStatus,
        onRemove,
        onSync,
      } as TableMetaType}
    />
  );
}
