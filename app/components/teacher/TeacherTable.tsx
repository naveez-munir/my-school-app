import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { TeacherResponse } from '~/types/teacher';
import { GenericDataTable } from '../common/table/GenericDataTable';
import { SortableColumnHeader, createActionsColumn, type ActionButton } from '../common/table/TableHelpers';

interface TeacherTableProps {
  data: TeacherResponse[];
  onEdit: (teacher: TeacherResponse) => void;
  onDelete: (id: string) => void;
}

const getEmploymentStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'OnLeave':
      return 'bg-yellow-100 text-yellow-800';
    case 'Resigned':
      return 'bg-gray-100 text-gray-800';
    case 'Terminated':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function createTeacherColumns(): ColumnDef<TeacherResponse, any>[] {
  const columnHelper = createColumnHelper<TeacherResponse>();
  const actions: ActionButton<TeacherResponse>[] = [
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
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Teacher Name" />,
      cell: (info) => (
        <div className="flex items-center space-x-3">
          {info.row.original.photoUrl && (
            <img 
              src={info.row.original.photoUrl} 
              alt={info.getValue()}
              className="h-8 w-8 rounded-full object-cover"
            />
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
    columnHelper.accessor('id', createActionsColumn<TeacherResponse>(actions)),
  ];
}

export function TeacherTable({ 
  data, 
  onEdit,
  onDelete 
}: TeacherTableProps) {
  const columns = createTeacherColumns();

  return (
    <GenericDataTable<TeacherResponse>
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyStateMessage="No teachers found."
      searchPlaceholder="Search teachers..."
      idField="id"
    />
  );
}
