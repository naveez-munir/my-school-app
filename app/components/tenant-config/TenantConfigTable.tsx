import { createColumnHelper } from '@tanstack/react-table';
import { Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import type { Tenant } from '~/types/tenant';

interface TenantConfigTableProps {
  data: Tenant[];
  onConfigEdit?: (tenant: Tenant) => void;
}

const columnHelper = createColumnHelper<Tenant>();

export const TenantConfigTable = ({ data, onConfigEdit }: TenantConfigTableProps) => {
  // Helper function to determine config status
  const getConfigStatus = (tenant: Tenant) => {
    const hasBasicSettings = tenant.settings?.branding?.schoolName || tenant.settings?.academic?.gradingSystem;
    const hasLeavePolicy = tenant.leavePolicy?.teacherLeaveSettings?.sickLeaveAllowance;

    if (hasBasicSettings && hasLeavePolicy) {
      return { status: 'Complete', color: 'text-green-600', icon: CheckCircle };
    } else if (hasBasicSettings || hasLeavePolicy) {
      return { status: 'Partial', color: 'text-yellow-600', icon: Clock };
    } else {
      return { status: 'Not Configured', color: 'text-red-600', icon: AlertCircle };
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Tenant Name',
      cell: (info) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {info.getValue()}
            </div>
            <div className="text-sm text-gray-500">
              {info.row.original.databaseName}
            </div>
          </div>
        </div>
      ),
    }),

    columnHelper.accessor('status', {
      header: 'Tenant Status',
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

    columnHelper.accessor((row) => row.settings?.branding?.schoolName || 'Not Set', {
      id: 'schoolName',
      header: 'School Name',
      cell: (info) => (
        <div className="text-sm text-gray-700">
          {info.getValue() === 'Not Set' ? (
            <span className="text-gray-400 italic">Not Set</span>
          ) : (
            info.getValue()
          )}
        </div>
      ),
    }),

    columnHelper.accessor(
      (row) => row.leavePolicy?.teacherLeaveSettings?.sickLeaveAllowance ? 'Configured' : 'Default',
      {
        id: 'leavePolicy',
        header: 'Leave Policy',
        cell: (info) => {
          const value = info.getValue();
          return (
            <span className={`text-sm ${
              value === 'Configured' ? 'text-green-700' : 'text-gray-500'
            }`}>
              {value}
            </span>
          );
        },
      }
    ),

    columnHelper.accessor(
      (row) => {
        const config = getConfigStatus(row);
        return config.status;
      },
      {
        id: 'configStatus',
        header: 'Config Status',
        cell: (info) => {
          const tenant = info.row.original;
          const config = getConfigStatus(tenant);
          const IconComponent = config.icon;

          return (
            <div className="flex items-center space-x-2">
              <IconComponent size={16} className={config.color} />
              <span className={`text-sm font-medium ${config.color}`}>
                {config.status}
              </span>
            </div>
          );
        },
      }
    ),

    columnHelper.accessor('updatedAt', {
      header: 'Last Updated',
      cell: (info) => {
        const date = new Date(info.getValue());
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let timeAgo;
        if (diffDays === 1) {
          timeAgo = 'Today';
        } else if (diffDays < 7) {
          timeAgo = `${diffDays} days ago`;
        } else if (diffDays < 30) {
          timeAgo = `${Math.ceil(diffDays / 7)} weeks ago`;
        } else {
          timeAgo = `${Math.ceil(diffDays / 30)} months ago`;
        }

        return (
          <div className="text-sm text-gray-700">
            {timeAgo}
          </div>
        );
      },
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
                title="Configure tenant settings"
              >
                <Settings size={16} />
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
      onEdit={onConfigEdit}
      emptyStateMessage="No tenants available for configuration."
      searchPlaceholder="Search tenants by name, school name, or status..."
      idField="_id"
      initialPageSize={15}
    />
  );
};