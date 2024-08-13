import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { ExamResponse } from '~/types/exam';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';
import { formatUserFriendlyDate } from '~/utils/dateUtils';

interface StudentExamsTableProps {
  data: ExamResponse[];
  onViewDetails: (id: string) => void;
}

export function createStudentExamColumns(
  onViewDetails: (id: string) => void
): ColumnDef<ExamResponse, any>[] {
  const columnHelper = createColumnHelper<ExamResponse>();
  
  return [
    columnHelper.accessor('description', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Exam Name" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('examType.name', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Exam Type" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() || '-'}
        </div>
      ),
    }),
    columnHelper.accessor('startDate', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Start Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('endDate', {
      header: ({ column }) => <SortableColumnHeader column={column} title="End Date" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {formatUserFriendlyDate(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Status" />,
      cell: (info) => {
        const status = info.getValue();
        let statusClass = '';
        
        switch(status) {
          case 'Scheduled':
            statusClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'Ongoing':
            statusClass = 'bg-green-100 text-green-800';
            break;
          case 'Completed':
            statusClass = 'bg-blue-100 text-blue-800';
            break;
          case 'ResultDeclared':
            statusClass = 'bg-purple-100 text-purple-800';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => (
        <div className="flex justify-end space-x-2">
          <button 
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => onViewDetails(info.row.original.id)}
          >
            View Details
          </button>
        </div>
      ),
    }),
  ];
}

export default function StudentExamsTable({ 
  data, 
  onViewDetails 
}: StudentExamsTableProps) {
  const columns = createStudentExamColumns(onViewDetails);

  return (
    <GenericDataTable<ExamResponse>
      data={data}
      columns={columns}
      emptyStateMessage="No exams found."
      searchPlaceholder="Search exams..."
      idField="id"
    />
  );
}
