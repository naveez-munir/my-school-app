import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { Subject, SubjectsTableProps } from '~/types/subject';
import { GenericDataTable } from '../common/table/GenericDataTable';
import { SortableColumnHeader, createActionsColumn, type ActionButton } from '../common/table/TableHelpers';
import { Edit, Trash2 } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

export function createSubjectColumns(): ColumnDef<Subject, any>[] {
  const columnHelper = createColumnHelper<Subject>();
  const actions: ActionButton<Subject>[] = [
    {
      label: 'Edit',
      icon: Edit,
      onClick: (item, _, meta) => meta.onEdit?.(item),
      color: 'blue'
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (_, id, meta) => meta.onDelete?.(id),
      color: 'red'
    }
  ];
  
  return [
    columnHelper.accessor('subjectName', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Course Name" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('subjectCode', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Course Code" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Created Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('_id', createActionsColumn<Subject>(actions)),
  ];
}

export function SubjectsTable({ 
  data, 
  onEdit,
  onDelete 
}: Omit<SubjectsTableProps, 'pageCount' | 'onPaginationChange'>) {
  const columns = createSubjectColumns();

  return (
    <GenericDataTable<Subject>
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyStateMessage="No courses found."
      searchPlaceholder="Search courses..."
      idField="_id"
    />
  );
}
