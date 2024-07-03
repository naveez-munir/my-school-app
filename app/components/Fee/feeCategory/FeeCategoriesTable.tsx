import type { ColumnDef } from '@tanstack/react-table';
import type { FeeCategory } from '~/types/studentFee';
import { useMemo } from 'react';
import { ToggleLeft, ToggleRight, Edit, Trash2 } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';

interface TableMetaType {
  onEdit: (category: FeeCategory) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

interface FeeCategoriesTableProps {
  data: FeeCategory[];
  onEdit: (category: FeeCategory) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function FeeCategoriesTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus
}: FeeCategoriesTableProps) {
  const columns = useMemo<ColumnDef<FeeCategory, any>[]>(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableColumnHeader column={column} title="Category Name" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: 'frequency',
      header: ({ column }) => <SortableColumnHeader column={column} title="Frequency" />,
      cell: (info) => {
        const frequencyMap = {
          'ONE_TIME': 'ONE_TIME',
          'MONTHLY': 'Monthly',
          'QUARTERLY': 'Quarterly',
          'YEARLY': 'Yearly'
        };
        const frequency = info.getValue() as string;
        return (
          <div className="text-sm text-gray-500">
            {frequencyMap[frequency as keyof typeof frequencyMap] || frequency}
          </div>
        );
      },
    },
    {
      accessorKey: 'isRefundable',
      header: 'Refundable',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() ? 'Yes' : 'No'}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableColumnHeader column={column} title="Created Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: '_id',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const meta = info.table.options.meta as TableMetaType;
        const category = info.row.original;
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => meta.onToggleStatus(info.getValue() as string)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              title={category.isActive ? "Deactivate" : "Activate"}
            >
              {category.isActive ?
                <ToggleRight className="h-5 w-5 text-green-600" /> :
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              }
            </button>
            <button
              onClick={() => meta.onEdit(category)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => meta.onDelete(info.getValue() as string)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ], []);

  return (
    <GenericDataTable<FeeCategory>
      data={data}
      columns={columns}
      initialPageSize={20}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No fee categories found."
      searchPlaceholder="Search all columns..."
      idField="_id"
      meta={{
        onEdit,
        onDelete,
        onToggleStatus,
      } as TableMetaType}
    />
  );
}
