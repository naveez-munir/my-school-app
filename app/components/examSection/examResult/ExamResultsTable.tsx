import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Trash2, Medal, Printer } from 'lucide-react';
import type { ExamResultSummary } from '~/types/examResult';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

interface TableMetaType {
  onView: (result: ExamResultSummary) => void;
  onDelete: (id: string) => void;
  onGenerateRanks?: (examId: string) => void;
  onPrint: (result: ExamResultSummary) => void;
}

interface ExamResultsTableProps {
  data: ExamResultSummary[];
  onView: (result: ExamResultSummary) => void;
  onDelete: (id: string) => void;
  onGenerateRanks?: (examId: string) => void;
  onPrint: (result: ExamResultSummary) => void;
  isClassView?: boolean;
}

const columnHelper = createColumnHelper<ExamResultSummary>();

export function ExamResultsTable({
  data,
  onView,
  onDelete,
  onGenerateRanks,
  onPrint,
  isClassView = false
}: ExamResultsTableProps) {
  const examGroups = useMemo(() => {
    if (!isClassView || !onGenerateRanks) return {};
    
    return data.reduce((acc, result) => {
      const examId = result.id.split('-')[0]; // Assuming the format allows this extraction
      if (!acc[examId]) {
        acc[examId] = {
          count: 0,
          name: result.examName
        };
      }
      acc[examId].count++;
      return acc;
    }, {} as Record<string, { count: number, name: string }>);
  }, [data, isClassView, onGenerateRanks]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600';
      case 'B+':
      case 'B':
        return 'text-blue-600';
      case 'C+':
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const columns = useMemo(() => [
    // Always show Student Name and Roll Number
    columnHelper.accessor('studentName', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Student Name</span>
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
    columnHelper.accessor('rollNumber', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Roll Number</span>
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
    // Show Exam Name and Type only in student view
    ...(!isClassView ? [
      columnHelper.accessor('examName', {
        header: ({ column }) => (
          <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
            <span>Exam Name</span>
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
      columnHelper.accessor('examType', {
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
          <div className="text-sm text-gray-500">
            {info.getValue()}
          </div>
        ),
      }),
    ] : []),
    columnHelper.accessor('totalMarks', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Total Marks</span>
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
    columnHelper.accessor('percentage', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Percentage</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue().toFixed(2)}%
        </div>
      ),
    }),
    columnHelper.accessor('grade', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Grade</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const grade = info.getValue();
        return (
          <div className={`text-sm font-bold ${getGradeColor(grade)}`}>
            {grade}
          </div>
        );
      },
    }),
    columnHelper.accessor('rank', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Rank</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => {
        const rank = info.getValue();
        if (!rank) return <div className="text-sm text-gray-400">-</div>;
        
        let rankClass = 'text-gray-600';
        let badgeClass = '';
        
        if (rank === 1) {
          rankClass = 'text-yellow-600 font-bold';
          badgeClass = 'bg-yellow-100';
        } else if (rank === 2) {
          rankClass = 'text-gray-500 font-bold';
          badgeClass = 'bg-gray-100';
        } else if (rank === 3) {
          rankClass = 'text-amber-600 font-bold';
          badgeClass = 'bg-amber-100';
        }
        
        return (
          <div className={`text-sm ${rankClass} inline-flex items-center ${badgeClass} px-2 py-0.5 rounded-full`}>
            {rank}
          </div>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const id = info.getValue();
        const result = info.row.original;
        
        if (!id) return null;
        
        return (
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => (info.table.options.meta as TableMetaType).onView(result)}
              className="text-blue-600 hover:text-blue-900 cursor-pointer"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>

            <button
              onClick={() => (info.table.options.meta as TableMetaType).onPrint(result)}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
              title="Print Result Card"
            >
              <Printer className="h-5 w-5" />
            </button>

            <button
              onClick={() => (info.table.options.meta as TableMetaType).onDelete(id)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        );
      },
    }),
  ], [isClassView]);

  const uniqueExam = useMemo(() => {
    if (!isClassView || !data.length || Object.keys(examGroups).length !== 1) return null;

    const examId = Object.keys(examGroups)[0];
    return {
      id: examId,
      name: examGroups[examId].name
    };
  }, [data, examGroups, isClassView]);

  return (
    <div className="space-y-4">
      {isClassView && uniqueExam && onGenerateRanks && (
        <div className="bg-white p-4 rounded-lg shadow flex justify-end">
          <button
            onClick={() => onGenerateRanks(uniqueExam.id)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <Medal className="mr-2 h-4 w-4" />
            Generate Ranks
          </button>
        </div>
      )}

      <GenericDataTable
        data={data}
        columns={columns}
        initialPageSize={10}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyStateMessage="No exam results found."
        searchPlaceholder={`Search ${isClassView ? 'students' : 'exams'}...`}
        meta={{
          onView,
          onDelete,
          onGenerateRanks,
          onPrint,
        } as TableMetaType}
      />
    </div>
  );
}
