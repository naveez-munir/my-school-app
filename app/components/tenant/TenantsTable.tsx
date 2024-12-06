import { createColumnHelper } from '@tanstack/react-table';
import { Edit, Trash2, Users, GraduationCap, Briefcase } from 'lucide-react';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import type { Tenant, TenantsTableProps } from '~/types/tenant';

const columnHelper = createColumnHelper<Tenant>();

export const TenantsTable = ({ data, onEdit, onDelete }: TenantsTableProps) => {
  const columns = [
    columnHelper.accessor('name', {
      header: 'Tenant Name',
      cell: (info) => (
        <div className="flex items-center space-x-3">
          <div className="text-sm font-medium text-gray-900">
            {info.getValue()}
          </div>
        </div>
      ),
    }),

    columnHelper.accessor('databaseName', {
      header: 'Database Name',
      cell: (info) => (
        <div className="text-sm text-gray-700 font-mono">
          {info.getValue()}
        </div>
      ),
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </span>
        );
      },
    }),

    columnHelper.accessor('maxStudents', {
      header: 'Student Limit',
      cell: (info) => (
        <div className="flex items-center space-x-1 text-sm text-gray-700">
          <Users size={14} className="text-blue-500" />
          <span>{info.getValue()}</span>
        </div>
      ),
    }),

    columnHelper.accessor('maxTeachers', {
      header: 'Teacher Limit',
      cell: (info) => (
        <div className="flex items-center space-x-1 text-sm text-gray-700">
          <GraduationCap size={14} className="text-green-500" />
          <span>{info.getValue()}</span>
        </div>
      ),
    }),

    columnHelper.accessor('maxStaff', {
      header: 'Staff Limit',
      cell: (info) => (
        <div className="flex items-center space-x-1 text-sm text-gray-700">
          <Briefcase size={14} className="text-purple-500" />
          <span>{info.getValue()}</span>
        </div>
      ),
    }),

    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row, table }) => {
        const tenant = row.original;
        const meta = table.options.meta as any;

        return (
          <div className="flex items-center space-x-2">
            {meta?.onEdit && (
              <button
                onClick={() => meta.onEdit(tenant)}
                className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                title="View/Edit tenant"
              >
                <Edit size={16} />
              </button>
            )}
            {meta?.onDelete && (
              <button
                onClick={() => meta.onDelete(tenant._id)}
                className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                title="Delete tenant"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        );
      },
    }),
  ];

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyStateMessage="No tenants found."
      searchPlaceholder="Search tenants by name or database..."
      idField="_id"
      initialPageSize={10}
    />
  );
};