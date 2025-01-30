import { createColumnHelper } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { StudentResponse, StudentsTableProps, TableMetaType } from '~/types/student';
import { ClassSelector } from '~/components/common/ClassSelector';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';
import { SortableColumnHeader } from '~/components/common/table/TableHelpers';

const columnHelper = createColumnHelper<StudentResponse>();

export function StudentsTable({
  data,
  onView,
  onDelete
}: StudentsTableProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');

  const filteredData = useMemo(() => {
    if (!selectedClass) return data;
    return data.filter(student => student.classId === selectedClass);
  }, [data, selectedClass]);

  const columns = useMemo(() => [
  columnHelper.accessor('name', {
    header: ({ column }) => <SortableColumnHeader column={column} title="Student Name" />,
    cell: (info) => (
      <div className="flex items-center space-x-3">
        {info.row.original.photoUrl ? (
          <img
            src={info.row.original.photoUrl}
            alt={info.getValue()}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {info.getValue().split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}
        <div className="font-medium text-gray-900">
          {info.getValue()}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('rollNumber', {
    header: ({ column }) => <SortableColumnHeader column={column} title="Roll No" />,
    cell: (info) => (
      <div className="text-gray-500">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('className', {
    header: ({ column }) => <SortableColumnHeader column={column} title="Class" />,
    cell: (info) => (
      <div className="text-gray-500">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('guardianName', {
    header: ({ column }) => <SortableColumnHeader column={column} title="Guardian" />,
    cell: (info) => (
      <div className="text-gray-500">
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: "Status",
    cell: (info) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {info.getValue() ? 'Active' : 'Inactive'}
      </span>
    ),
  }),
  columnHelper.accessor('id', {
    header: () => <div className="text-right">Actions</div>,
    cell: (info) => {
      const meta = info.table.options.meta as TableMetaType;
      return (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => meta.onView(info.row.original)}
            className="text-blue-600 hover:text-blue-900 cursor-pointer"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          {meta.onDelete && (
            <button
              onClick={() => meta.onDelete?.(info.row.original)}
              className="text-red-600 hover:text-red-900 cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      );
    },
  }),
  ], []);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <ClassSelector
          value={selectedClass}
          onChange={setSelectedClass}
          label="Filter by Class"
          placeholder="All classes"
          className="w-full"
        />
      </div>

      <GenericDataTable
        data={filteredData}
        columns={columns}
        initialPageSize={20}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        emptyStateMessage="No students found."
        searchPlaceholder="Search all columns..."
        meta={{
          onView,
          onDelete,
        } as TableMetaType}
      />
    </div>
  );
}
