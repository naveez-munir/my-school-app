import type { ColumnDef } from '@tanstack/react-table';
import type { ExamType, ExamTypeTableMetaType } from '~/types/examType';
import { useMemo } from 'react';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';

interface ExamTypesTableProps {
  data: ExamType[];
  onEdit: (examType: ExamType) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const ExamTypesTable: React.FC<ExamTypesTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const columns = useMemo<ColumnDef<ExamType, any>[]>(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableColumnHeader column={column} title="Name" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: 'weightAge',
      header: ({ column }) => <SortableColumnHeader column={column} title="Weight Age" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() as number}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => <SortableColumnHeader column={column} title="Status" />,
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableColumnHeader column={column} title="Created Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue() as string, '-')}
        </div>
      ),
    },
    {
      accessorKey: '_id',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const meta = info.table.options.meta as ExamTypeTableMetaType;
        const examType = info.row.original;
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => meta.onEdit(examType)}
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
            <button
              onClick={() => meta.onToggleStatus(info.getValue() as string)}
              className={`${
                examType.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
              } cursor-pointer`}
              title={examType.isActive ? 'Deactivate' : 'Activate'}
            >
              {examType.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            </button>
          </div>
        );
      },
    },
  ], []);

  return (
    <GenericDataTable<ExamType>
      data={data}
      columns={columns}
      initialPageSize={20}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No exam types found."
      searchPlaceholder="Search all columns..."
      idField="_id"
      meta={{
        onEdit,
        onDelete,
        onToggleStatus,
      } as ExamTypeTableMetaType}
    />
  );
};

export default ExamTypesTable;

