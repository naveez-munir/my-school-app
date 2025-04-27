import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { DailyDiaryResponse } from '~/types/dailyDiary';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';

interface DailyDiaryTableProps {
  data: DailyDiaryResponse[];
  globalFilter: string;
  onView: (diary: DailyDiaryResponse) => void;
  onEdit?: (diary: DailyDiaryResponse) => void;
  onDelete: (id: string) => void;
}

export function DailyDiaryTable({ 
  data, 
  globalFilter,
  onView,
  onEdit,
  onDelete
}: DailyDiaryTableProps) {
  const columnHelper = createColumnHelper<DailyDiaryResponse>();

  const columns: ColumnDef<DailyDiaryResponse, any>[] = [
    columnHelper.accessor('date', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Date" />,
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">
            {format(new Date(info.getValue()), 'MMM dd, yyyy')}
          </span>
        </div>
      ),
      sortingFn: 'datetime',
    }),
    columnHelper.accessor(row => row.classId.className, {
      id: 'classDisplay',
      header: ({ column }) => <SortableColumnHeader column={column} title="Class" />,
      cell: (info) => (
        <div className="text-sm text-gray-700">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Title" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('description', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Description" />,
      cell: (info) => (
        <div className="text-sm text-gray-600 truncate max-w-xs">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('attachments', {
      header: "Files",
      cell: (info) => {
        const attachments = info.getValue();
        return attachments?.length ? (
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-500">{attachments.length}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">None</span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        return (
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => onView(info.row.original)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              View
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(info.row.original)}
                className="text-blue-600 hover:text-blue-900 cursor-pointer"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(info.row.original.id)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
            >
              Delete
            </button>
          </div>
        );
      },
    })
  ];

  return (
    <GenericDataTable<DailyDiaryResponse>
      data={data}
      columns={columns}
      initialPageSize={10}
      emptyStateMessage="No diary entries found."
      searchPlaceholder="Search by title or description..."
      showSearchBox={false}
    />
  );
}
