import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { ClassResponse } from '~/types/class';
import { GenericDataTable } from '../common/table/GenericDataTable';
import { SortableColumnHeader, createActionsColumn, type ActionButton } from '../common/table/TableHelpers';

interface ClassesTableProps {
  data: ClassResponse[];
  onEdit: (classItem: ClassResponse) => void;
  onDelete: (id: string) => void;
}

export function createClassColumns(): ColumnDef<ClassResponse, any>[] {
  const columnHelper = createColumnHelper<ClassResponse>();
  const actions: ActionButton<ClassResponse>[] = [
    {
      label: 'Edit',
      onClick: (item, _, meta) => meta.onEdit?.(item),
      color: 'blue'
    },
    {
      label: 'Delete',
      onClick: (_, id, meta) => meta.onDelete?.(id),
      color: 'red'
    }
  ];
  
  return [
    columnHelper.accessor('className', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Class Name" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('classSection', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Section" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('classGradeLevel', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Grade Level" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('teacherName', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Teacher" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('tempTeacherName', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Temporary Teacher" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('subjectCount', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Subjects" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('id', createActionsColumn<ClassResponse>(actions)),
  ];
}

export function ClassesTable({ 
  data, 
  onEdit,
  onDelete 
}: ClassesTableProps) {
  const columns = createClassColumns();

  return (
    <GenericDataTable<ClassResponse>
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyStateMessage="No classes found."
      searchPlaceholder="Search classes..."
      idField="id"
    />
  );
}
