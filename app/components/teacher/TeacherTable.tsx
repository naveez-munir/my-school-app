import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { TeacherResponse } from '~/types/teacher';
import { GenericDataTable } from '../common/table/GenericDataTable';
import { SortableColumnHeader, createActionsColumn, type ActionButton } from '../common/table/TableHelpers';
import { getEmploymentStatusColor } from '~/utils/employeeStatusColor';
import { Edit, Trash2 } from 'lucide-react';

interface TeacherTableProps {
  data: TeacherResponse[];
  onEdit?: (teacher: TeacherResponse) => void;
  onDelete?: (teacher: TeacherResponse) => void;
}


export function createTeacherColumns(onEdit?: (teacher: TeacherResponse) => void, onDelete?: (teacher: TeacherResponse) => void): ColumnDef<TeacherResponse, any>[] {
  const columnHelper = createColumnHelper<TeacherResponse>();
  const actions: ActionButton<TeacherResponse>[] = [];

  if (onEdit) {
    actions.push({
      label: 'Edit',
      icon: Edit,
      onClick: (item) => onEdit(item),
      color: 'blue'
    });
  }

  if (onDelete) {
    actions.push({
      label: 'Delete',
      icon: Trash2,
      onClick: (item) => onDelete(item),
      color: 'red'
    });
  }
  
  return [
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Teacher Name" />,
      cell: (info) => (
        <div className="flex items-center space-x-3">
          {info.row.original.photoUrl ? (
            <img
              src={info.row.original.photoUrl}
              alt={info.getValue()}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {info.getValue().split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
          <div className="text-sm font-medium text-gray-900">
            {info.getValue()}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('cniNumber', {
      header: ({ column }) => <SortableColumnHeader column={column} title="CNI Number" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Phone" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('assignedClassName', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Assigned Class" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('employmentStatus', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Status" />,
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getEmploymentStatusColor(info.getValue())}`}>
          {info.getValue()}
        </span>
      ),
    }),
    ...(actions.length > 0 ? [columnHelper.accessor('id', createActionsColumn<TeacherResponse>(actions))] : []),
  ];
}

export function TeacherTable({
  data,
  onEdit,
  onDelete
}: TeacherTableProps) {
  const columns = createTeacherColumns(onEdit, onDelete);

  const handleDelete = onDelete ? (id: string) => {
    const teacher = data.find(t => t.id === id);
    if (teacher) {
      onDelete(teacher);
    }
  } : undefined;

  return (
    <GenericDataTable<TeacherResponse>
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={handleDelete}
      emptyStateMessage="No teachers found."
      searchPlaceholder="Search teachers..."
      idField="id"
    />
  );
}
