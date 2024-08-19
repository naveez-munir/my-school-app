import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import type { ExamResultResponse } from '~/types/examResult';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { Eye } from 'lucide-react';

interface StudentResultsTableProps {
  data: ExamResultResponse[];
  onViewDetails: (id: string) => void;
}

export function createStudentResultColumns(
  onViewDetails: (id: string) => void
): ColumnDef<ExamResultResponse, any>[] {
  const columnHelper = createColumnHelper<ExamResultResponse>();
  
  return [
    columnHelper.accessor('exam.type', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Exam Type" />,
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('exam.academicYear', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Academic Year" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('percentage', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Percentage" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue().toFixed(2)}%
        </div>
      ),
    }),
    columnHelper.accessor('grade', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Grade" />,
      cell: (info) => {
        const grade = info.getValue();
        let gradeClass = '';
        
        switch(grade) {
          case 'A+':
          case 'A':
            gradeClass = 'bg-green-100 text-green-800';
            break;
          case 'B+':
          case 'B':
            gradeClass = 'bg-blue-100 text-blue-800';
            break;
          case 'C+':
          case 'C':
            gradeClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'D':
            gradeClass = 'bg-orange-100 text-orange-800';
            break;
          case 'F':
            gradeClass = 'bg-red-100 text-red-800';
            break;
          default:
            gradeClass = 'bg-gray-100 text-gray-800';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${gradeClass}`}>
            {grade || '-'}
          </span>
        );
      },
    }),
    columnHelper.accessor('rank', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Rank" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue() ? `#${info.getValue()}` : 'N/A'}
        </div>
      ),
    }),
    columnHelper.accessor('totalMarks', {
      header: ({ column }) => <SortableColumnHeader column={column} title="Total Marks" />,
      cell: (info) => (
        <div className="text-sm text-gray-500">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => (
        <div className="flex justify-end space-x-2">
          <button
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
            onClick={() => onViewDetails(info.row.original.id)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];
}

export default function StudentResultsTable({ 
  data, 
  onViewDetails 
}: StudentResultsTableProps) {
  const columns = createStudentResultColumns(onViewDetails);

  return (
    <GenericDataTable<ExamResultResponse>
      data={data}
      columns={columns}
      emptyStateMessage="No exam results found."
      searchPlaceholder="Search results..."
      idField="id"
    />
  );
}
