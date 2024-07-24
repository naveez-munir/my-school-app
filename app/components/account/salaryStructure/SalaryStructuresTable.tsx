import { createColumnHelper } from '@tanstack/react-table';
import { type SalaryStructureResponse, EmployeeType, EmployeeCategory, EmployeeCategoryLabels } from '~/types/salaryStructure';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatCurrency } from '~/utils/currencyUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface TableMetaType {
  onEdit: (structure: SalaryStructureResponse) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

interface SalaryStructuresTableProps {
  data: SalaryStructureResponse[];
  onEdit: (structure: SalaryStructureResponse) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const columnHelper = createColumnHelper<SalaryStructureResponse>();

export function SalaryStructuresTable({
  data,
  onEdit,
  onDelete,
  onToggleStatus,
}: SalaryStructuresTableProps) {
  const columns = useMemo(() => [
    columnHelper.accessor(row => row.employeeName || 'Unknown', {
      id: 'employeeName',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Employee</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('employeeType', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Type</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {info.getValue() === EmployeeType.TEACHER ? 'Teacher' : 'Staff'}
        </div>
      ),
    }),
    columnHelper.accessor('employeeCategory', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Category</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {EmployeeCategoryLabels[info.getValue() as EmployeeCategory]}
        </div>
      ),
    }),
    columnHelper.accessor('basicSalary', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Basic Salary</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-900">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('effectiveFrom', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Effective From</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-xs sm:text-sm text-gray-500">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.accessor('effectiveTo', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Effective To</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const value = info.getValue();
        return (
          <div className="text-xs sm:text-sm text-gray-500">
            {value ? new Date(value).toLocaleDateString() : 'Ongoing'}
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onToggleStatus(id)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              title={info.row.original.isActive ? "Deactivate" : "Activate"}
            >
              {info.row.original.isActive ? 
                <ToggleRight className="h-5 w-5 text-green-600" /> : 
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              }
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onEdit(info.row.original)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onDelete(id)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
            >
              Delete
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
      initialPageSize={10}
      pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      emptyStateMessage="No salary structures found."
      searchPlaceholder="Search..."
      meta={{
        onEdit,
        onDelete,
        onToggleStatus,
      } as TableMetaType}
    />
  );
}
