import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type FilterFn,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Eye, Trash2, Medal } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import type { ExamResultSummary } from '~/types/examResult';

interface TableMetaType {
  onView: (result: ExamResultSummary) => void;
  onDelete: (id: string) => void;
  onGenerateRanks?: (examId: string) => void;
}

interface ExamResultsTableProps {
  data: ExamResultSummary[];
  onView: (result: ExamResultSummary) => void;
  onDelete: (id: string) => void;
  onGenerateRanks?: (examId: string) => void;
  isClassView?: boolean;
}

const fuzzyFilter: FilterFn<ExamResultSummary> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<ExamResultSummary>();

export function ExamResultsTable({ 
  data, 
  onView,
  onDelete,
  onGenerateRanks,
  isClassView = false
}: ExamResultsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Group by examId to determine if ranks can be generated
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
    ...(isClassView ? [
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
    ] : [
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
    ]),
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

  const tableData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onView,
      onDelete,
      onGenerateRanks
    } as TableMetaType,
  });

  // Get unique exam for rank generation button
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
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Search Results"
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(value)}
            placeholder={`Search ${isClassView ? 'students' : 'exams'}...`}
          />
          <div className="flex items-end justify-between">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
            >
              {[10, 20, 30, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            
            {isClassView && uniqueExam && onGenerateRanks && (
              <button
                onClick={() => onGenerateRanks(uniqueExam.id)}
                className="ml-4 flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                <Medal className="mr-2 h-4 w-4" />
                Generate Ranks
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    scope="col"
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                      ${header.id.includes('id') ? 'text-right' : 'text-left'}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className={`px-6 py-4 whitespace-nowrap
                      ${cell.column.id.includes('id') ? 'text-right' : 'text-left'}`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No exam results found.
          </div>
        )}

        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total)
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
