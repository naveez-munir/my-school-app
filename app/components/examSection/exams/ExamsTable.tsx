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
import type { ExamResponse } from '~/types/exam';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TextInput } from '~/components/common/form/inputs/TextInput';

interface ExamsTableProps {
  data: ExamResponse[];
  onEdit: (exam: ExamResponse) => void;
  onDelete: (id: string) => void;
  onViewDetails: (exam: ExamResponse) => void;
  onStatusChange?: (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => void;
}

interface TableMetaType {
  onEdit: (exam: ExamResponse) => void;
  onDelete: (id: string) => void;
  onViewDetails: (exam: ExamResponse) => void;
  onStatusChange?: (id: string, status: 'Scheduled' | 'Ongoing' | 'Completed' | 'ResultDeclared') => void;
}

const fuzzyFilter: FilterFn<ExamResponse> = (row, columnId, filterValue: string) => {
  const value = row.getValue(columnId) as string;
  if (!value) return false;
  return value.toLowerCase().includes(filterValue.toLowerCase());
};

const columnHelper = createColumnHelper<ExamResponse>();

const ExamsTable: React.FC<ExamsTableProps> = ({ 
  data, 
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const columns = [
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
        const startDate = new Date(row.startDate).toLocaleDateString();
        const endDate = new Date(row.endDate).toLocaleDateString();
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
              className="text-green-600 hover:text-green-900 cursor-pointer text-sm"
            >
              View
            </button>
            
            {exam.status === 'Scheduled' && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onEdit(exam)}
                className="text-blue-600 hover:text-blue-900 cursor-pointer text-sm"
              >
                Edit
              </button>
            )}
            
            {exam.status === 'Scheduled' && (
              <button
                onClick={() => (info.table.options.meta as TableMetaType).onDelete(info.getValue())}
                className="text-red-600 hover:text-red-900 cursor-pointer text-sm"
              >
                Delete
              </button>
            )}
            
            {showStatusDropdown && allowedTransitions[exam.status as keyof typeof allowedTransitions]?.length > 0 && (
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1 cursor-pointer"
                onChange={(e) => onStatusChange(exam.id, e.target.value as any)}
                value=""
                defaultValue=""
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
  ];

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
      onEdit,
      onDelete,
      onViewDetails,
      onStatusChange
    } as TableMetaType,
  });

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            label="Search"
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(value)}
            placeholder="Search all columns..."
          />
          <div className="flex items-end">
            <select
              value={pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500 cursor-pointer"
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
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
            No exams found.
          </div>
        )}

        {table.getRowModel().rows.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default ExamsTable;
