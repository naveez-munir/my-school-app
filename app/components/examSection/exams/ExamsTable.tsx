import { createColumnHelper } from '@tanstack/react-table';
import type { ExamResponse } from '~/types/exam';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit, Trash2 } from 'lucide-react';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface ExamsTableProps {
  data: ExamResponse[];
  onEdit: (exam: ExamResponse) => void;
  onDelete: (id: string) => void;
  onViewDetails: (exam: ExamResponse) => void;
  onStatusChange?: (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => void;
  isAdmin?: boolean;
}

interface TableMetaType {
  onEdit: (exam: ExamResponse) => void;
  onDelete: (id: string) => void;
  onViewDetails: (exam: ExamResponse) => void;
  onStatusChange?: (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => void;
}

const columnHelper = createColumnHelper<ExamResponse>();

const ExamsTable: React.FC<ExamsTableProps> = ({
  data,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
  isAdmin = false
}) => {
  const columns = useMemo(() => [
    columnHelper.accessor(row => row.examType.name, {
      id: 'examType',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Exam Type</span>
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
    columnHelper.accessor(row => `${row.class.className} ${row.class.classSection}`, {
      id: 'class',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Class</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('academicYear', {
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
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor(row => row.startDate, {
      id: 'date',
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Exam Dates</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const row = info.row.original;
        const startDate = formatUserFriendlyDate(row.startDate);
        const endDate = formatUserFriendlyDate(row.endDate);
        return (
          <div className="text-sm text-gray-500">
            {startDate} to {endDate}
          </div>
        );
      },
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
        const value = info.getValue();
        let bgColor = 'bg-gray-100 text-gray-800';
        
        if (value === 'Scheduled') bgColor = 'bg-blue-100 text-blue-800';
        if (value === 'Ongoing') bgColor = 'bg-yellow-100 text-yellow-800';
        if (value === 'Completed') bgColor = 'bg-green-100 text-green-800';
        if (value === 'ResultDeclared') bgColor = 'bg-purple-100 text-purple-800';
        
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`}>
            {value}
          </span>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const exam = info.row.original;
        const showStatusDropdown = onStatusChange && exam.status !== 'ResultDeclared';
        
        // Define which status transitions are allowed
        const allowedTransitions = {
          'Scheduled': ['Ongoing'],
          'Ongoing': ['Completed'],
          'Completed': ['ResultDeclared']
        };
        
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onViewDetails(exam)}
              className="text-green-600 hover:text-green-900 cursor-pointer"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>

            {isAdmin && exam.status === 'Scheduled' && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onEdit(exam)}
                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}

            {isAdmin && exam.status === 'Scheduled' && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onDelete(info.getValue())}
                className="text-red-600 hover:text-red-900 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            {isAdmin && showStatusDropdown && allowedTransitions[exam.status as keyof typeof allowedTransitions]?.length > 0 && (
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer"
                onChange={(e) => onStatusChange(exam.id, e.target.value as any)}
                value=""
              >
                <option value="" disabled>Change Status</option>
                {allowedTransitions[exam.status as keyof typeof allowedTransitions]?.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      },
    }),
  ], [isAdmin, onStatusChange]);

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      initialPageSize={20}
      emptyStateMessage="No exams found."
      searchPlaceholder="Search all columns..."
      meta={{
        onEdit,
        onDelete,
        onViewDetails,
        onStatusChange,
      } as TableMetaType}
    />
  );
};

export default ExamsTable;
