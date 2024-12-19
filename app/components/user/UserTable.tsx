import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Pencil, Ban, CheckCircle, KeyRound, Trash2 } from 'lucide-react';
import type { User } from '~/types/user';
import { GenericDataTable } from '../common/table/GenericDataTable';
import { SortableColumnHeader } from '../common/table/TableHelpers';
import { UserRoleBadge } from './UserRoleBadge';

interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onResetPassword: (user: User) => void;
}

export function createUserColumns(
  onEdit: (user: User) => void,
  onDelete: (id: string) => void,
  onToggleStatus: (id: string) => void,
  onResetPassword: (user: User) => void
): ColumnDef<User, any>[] {
  const columnHelper = createColumnHelper<User>();

  return [
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Name" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Email" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '—'}
        </div>
      ),
    }),
    columnHelper.accessor('cnic', {
      header: ({ column }) => <SortableColumnHeader column={column} title="CNIC" />,
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Role" />,
      cell: (info) => (
        <UserRoleBadge role={info.getValue()} />
      ),
    }),
    columnHelper.accessor('isActive', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Status" />,
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    }),
    columnHelper.accessor('_id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => onEdit(user)}
              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
              title="Edit user"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onToggleStatus(user._id)}
              className={`p-1 ${
                user.isActive
                  ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50'
                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
              } rounded`}
              title={user.isActive ? 'Deactivate user' : 'Activate user'}
            >
              {user.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
            </button>
            <button
              onClick={() => onResetPassword(user)}
              className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
              title="Reset password"
            >
              <KeyRound size={16} />
            </button>
            <button
              onClick={() => onDelete(user._id)}
              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
              title="Delete user"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    }),
  ];
}

export function UserTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword
}: UserTableProps) {
  const columns = createUserColumns(onEdit, onDelete, onToggleStatus, onResetPassword);

  return (
    <GenericDataTable<User>
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyStateMessage="No users found. Create your first user to get started."
      searchPlaceholder="Search by name, email, or CNIC..."
      idField="_id"
    />
  );
}
