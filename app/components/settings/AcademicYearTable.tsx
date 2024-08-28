import { createColumnHelper } from '@tanstack/react-table';
import type { AcademicYear } from '~/types/academicYear';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface AcademicYearTableProps {
  data: AcademicYear[];
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (id: string) => void;
}

interface AcademicYearTableMetaType {
  onEdit: (academicYear: AcademicYear) => void;
  onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<AcademicYear>();

const AcademicYearTable: React.FC<AcademicYearTableProps> = ({
  data,
  onEdit,
  onDelete
}) => {
  const columns = useMemo(() => [
    columnHelper.accessor('displayName', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Academic Year</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('startDate', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Start Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>End Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Status</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const status = info.getValue();
        const statusColor = status === 'Active' ? 'bg-green-100 text-green-800' :
                           status === 'Closed' ? 'bg-red-100 text-red-800' :
                           'bg-gray-100 text-gray-800';
        return (
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {status}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('isActive', {
      header: 'Active',
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <div className="text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isActive ? 'Yes' : 'No'}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const academicYear = info.row.original;
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as AcademicYearTableMetaType).onEdit(academicYear)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => (info.table.options.meta as AcademicYearTableMetaType).onDelete(info.getValue())}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }),
  ], []);

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      initialPageSize={20}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No academic years found"
      searchPlaceholder="Search all columns..."
      meta={{
        onEdit,
        onDelete
      } as AcademicYearTableMetaType}
    />
  );
};

export default AcademicYearTable;
