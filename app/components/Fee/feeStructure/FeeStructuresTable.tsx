import type { ColumnDef } from '@tanstack/react-table';
import type { FeeStructure, PopulatedFeeStructure } from '~/types/studentFee';
import { useMemo } from 'react';
import { ToggleLeft, ToggleRight, Copy, Edit, Trash2 } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { useClasses } from '~/hooks/useClassQueries';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';

interface TableMetaType {
  onEdit: (structure: FeeStructure | PopulatedFeeStructure) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onClone: (structure: FeeStructure | PopulatedFeeStructure) => void;
  getClassName: (id: string) => string;
}

interface FeeStructuresTableProps {
  data: (FeeStructure | PopulatedFeeStructure)[];
  onEdit: (structure: FeeStructure | PopulatedFeeStructure) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onClone: (structure: FeeStructure | PopulatedFeeStructure) => void;
}

// Helper function to check if a structure is populated
const isPopulatedStructure = (
  structure: FeeStructure | PopulatedFeeStructure
): structure is PopulatedFeeStructure => {
  return structure.feeComponents.length > 0 &&
    typeof structure.feeComponents[0].feeCategory === 'object';
};

export function FeeStructuresTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  onClone
}: FeeStructuresTableProps) {
  const { data: classes = [] } = useClasses();

  const getClassName = (id: string) => {
    const matchingClass = classes.find(c => c.id === id);
    return matchingClass ? matchingClass.className : 'Unknown';
  };

  const columns = useMemo<ColumnDef<FeeStructure | PopulatedFeeStructure, any>[]>(() => [
    {
      accessorKey: 'academicYear',
      header: ({ column }) => <SortableColumnHeader column={column} title="Academic Year" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue() as string}
        </div>
      ),
    },
    {
      accessorFn: (row) => {
        if (isPopulatedStructure(row) && typeof row.className === 'string') {
          return row.className;
        }
        const meta = row as any;
        return meta.getClassName ? meta.getClassName(row.classId) : 'Unknown';
      },
      id: 'className',
      header: ({ column }) => <SortableColumnHeader column={column} title="Class" />,
      cell: (info) => {
        const meta = info.table.options.meta as TableMetaType;
        const row = info.row.original;
        const className = isPopulatedStructure(row) && typeof row.className === 'string'
          ? row.className
          : meta.getClassName(row.classId);
        return (
          <div className="text-sm text-gray-900">
            {className}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => {
        const description = (info.getValue() as string) || '';
        const truncated = description.length > 20
          ? description.substring(0, 20) + '...'
          : description;
        return (
          <div className="text-sm text-gray-500" title={description}>
            {truncated}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.feeComponents?.length || 0,
      id: 'componentCount',
      header: 'Components',
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() as number} items
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortableColumnHeader column={column} title="Created Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: '_id',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const meta = info.table.options.meta as TableMetaType;
        const structure = info.row.original;
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => meta.onToggleStatus(info.getValue() as string)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              title={structure.isActive ? "Deactivate" : "Activate"}
            >
              {structure.isActive ?
                <ToggleRight className="h-5 w-5 text-green-600" /> :
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              }
            </button>
            <button
              onClick={() => meta.onClone(structure)}
              className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
              title="Clone Structure"
            >
              <Copy className="h-5 w-5" />
            </button>
            <button
              onClick={() => meta.onEdit(structure)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => meta.onDelete(info.getValue() as string)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ], []);

  return (
    <GenericDataTable<FeeStructure | PopulatedFeeStructure>
      data={data}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No fee structures found."
      searchPlaceholder="Search..."
      idField="_id"
      meta={{
        onEdit,
        onDelete,
        onToggleStatus,
        onClone,
        getClassName,
      } as TableMetaType}
    />
  );
}
