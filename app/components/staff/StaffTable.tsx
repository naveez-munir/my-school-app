import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { StaffListResponse } from '~/types/staff';
import { GenericDataTable } from '../common/table/GenericDataTable';
import { SortableColumnHeader, createActionsColumn, type ActionButton } from '../common/table/TableHelpers';
import { getEmploymentStatusColor } from '~/utils/employeeStatusColor';
import { Edit, Trash2 } from 'lucide-react';

interface StaffTableProps {
  data: StaffListResponse[];
  onEdit: (staff: StaffListResponse) => void;
  onDelete: (id: string) => void;
}

export function createStaffColumns(): ColumnDef<StaffListResponse, any>[] {
  const columnHelper = createColumnHelper<StaffListResponse>();
  const actions: ActionButton<StaffListResponse>[] = [
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
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Name" />,
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
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('designation', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Designation" />,
      cell: (info) => (
        <div className="text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('department', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Department" />,
      cell: (info) => (
        <div className="text-gray-900">
          {info.getValue() || '—'}
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Phone" />,
      cell: (info) => (
        <div className="text-gray-500">
          {info.getValue() || '—'}
        </div>
      ),
    }),
    columnHelper.accessor('employmentStatus', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Status" />,
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${getEmploymentStatusColor(status)}`}>
            {status === 'OnLeave' ? 'On Leave' : status}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', createActionsColumn<StaffListResponse>(actions)),
  ];
}

export function StaffTable({ 
  data, 
  onEdit,
  onDelete 
}: StaffTableProps) {
  const columns = createStaffColumns();

  return (
    <GenericDataTable<StaffListResponse>
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyStateMessage="No staff members found."
      searchPlaceholder="Search by name, designation, department..."
      idField="id"
    />
  );
}
