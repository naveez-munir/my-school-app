import { createColumnHelper } from '@tanstack/react-table';
import type { StudentFee, PopulatedStudentFee, FeeStatus } from '~/types/studentFee';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, Tag, XCircle, Eye, DollarSign, CheckSquare, Square } from 'lucide-react';
import { formatCurrency, getFeeStatusDisplayName, getFeeStatusClassName } from '~/types/studentFee';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import { GenericDataTable } from '~/components/common/table/GenericDataTable';

// Use a type alias for fees that can be either populated or not
type AnyStudentFee = StudentFee | PopulatedStudentFee;

interface TableMetaType {
  onViewDetails: (fee: AnyStudentFee) => void;
  onDiscount: (fee: AnyStudentFee) => void;
  onCancel: (id: string) => void;
  onPay: (fee: AnyStudentFee) => void;
  readOnly?: boolean;
}

interface StudentFeesTableProps {
  data: AnyStudentFee[];
  onViewDetails: (fee: AnyStudentFee) => void;
  onDiscount: (fee: AnyStudentFee) => void;
  onCancel: (id: string) => void;
  onPay: (fee: AnyStudentFee) => void;
  selectedFees?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  readOnly?: boolean;
  hideStudentColumn?: boolean;
}

const columnHelper = createColumnHelper<AnyStudentFee>();

export function StudentFeesTable({
  data,
  onViewDetails,
  onDiscount,
  onCancel,
  onPay,
  selectedFees = new Set(),
  onSelectionChange,
  readOnly = false,
  hideStudentColumn = false,
}: StudentFeesTableProps) {
  const getStudentName = (studentId: any): string => {
    if (typeof studentId === 'object' && studentId !== null) {
      return `${studentId.firstName} ${studentId.lastName}`;
    }
    return `Student ID: ${studentId}`;
  };

  const getStudentRollNumber = (studentId: any): string | null => {
    if (typeof studentId === 'object' && studentId !== null) {
      return studentId.rollNumber || null;
    }
    return null;
  };

  const getClassName = (studentId: any): string | null => {
    if (typeof studentId === 'object' && studentId !== null && studentId.class) {
      if (typeof studentId.class === 'object' && studentId.class !== null) {
        return studentId.class.className;
      }
    }
    return null;
  };
  
  const columns = useMemo(() => {
    const handleSelectFee = (feeId: string) => {
      if (!onSelectionChange) return;
      const newSelected = new Set(selectedFees);
      if (newSelected.has(feeId)) {
        newSelected.delete(feeId);
      } else {
        newSelected.add(feeId);
      }
      onSelectionChange(newSelected);
    };

    const handleSelectAll = () => {
      if (!onSelectionChange) return;
      if (selectedFees.size === data.length) {
        onSelectionChange(new Set());
      } else {
        onSelectionChange(new Set(data.map(fee => fee._id)));
      }
    };

    return [
    ...(onSelectionChange ? [columnHelper.display({
      id: 'select',
      header: () => (
        <button
          onClick={handleSelectAll}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {selectedFees.size === data.length && data.length > 0 ? (
            <CheckSquare className="h-5 w-5 text-blue-600" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </button>
      ),
      cell: (info) => {
        const feeId = info.row.original._id;
        const isSelected = selectedFees.has(feeId);
        const canSelect = info.row.original.dueAmount > 0 && info.row.original.status !== 'CANCELLED';

        if (!canSelect) return null;

        return (
          <button
            onClick={() => handleSelectFee(feeId)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isSelected ? (
              <CheckSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
          </button>
        );
      },
    })] : []),
    ...(!hideStudentColumn ? [columnHelper.accessor('studentId', {
      header: 'Student',
      cell: (info) => {
        const student = info.getValue();
        const studentName = getStudentName(student);
        const rollNumber = getStudentRollNumber(student);
        const className = getClassName(student);

        return (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {studentName}
            </div>
            {rollNumber && (
              <div className="text-xs text-gray-500">
                Roll #: {rollNumber}
              </div>
            )}
            {className && (
              <div className="text-xs text-gray-500">
                Class: {className}
              </div>
            )}
          </div>
        );
      },
    })] : []),
    columnHelper.accessor('academicYear', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Year</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor(row => {
      const billType = row.billType;
      const month = row.billMonth;
      const quarter = row.quarter;
      
      if (billType === 'MONTHLY' && month) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1] || `Month ${month}`;
      }
      
      if (billType === 'QUARTERLY' && quarter) {
        return `Q${quarter}`;
      }
      
      return billType;
    }, {
      id: 'period',
      header: 'Period',
      cell: (info) => info.getValue(),
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
        const status = info.getValue() as FeeStatus;
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${getFeeStatusClassName(status)}`}>
            {getFeeStatusDisplayName(status)}
          </span>
        );
      },
    }),
    columnHelper.accessor('dueDate', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Due Date</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatUserFriendlyDate(info.getValue()),
    }),
    columnHelper.accessor('netAmount', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Net Amount</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('paidAmount', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Paid</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('dueAmount', {
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer" onClick={() => column.toggleSorting()}>
          <span>Due</span>
          {column.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : null}
        </div>
      ),
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('_id', {
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const fee = info.row.original;
        const meta = info.table.options.meta as TableMetaType;
        const isReadOnly = meta.readOnly;
        const canApplyDiscount = !isReadOnly && fee.status !== 'PAID' && fee.status !== 'CANCELLED';
        const canCancel = !isReadOnly && fee.status !== 'CANCELLED' && fee.status !== 'PAID';
        const canPay = !isReadOnly && fee.dueAmount > 0 && fee.status !== 'CANCELLED';

        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => meta.onViewDetails(fee)}
              className="text-green-600 hover:text-green-900 p-1 rounded"
              title="View Details"
            >
              <Eye className="h-5 w-5" />
            </button>
            {canPay && (
              <button
                onClick={() => meta.onPay(fee)}
                className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                title="Collect Payment"
              >
                <DollarSign className="h-5 w-5" />
              </button>
            )}
            {canApplyDiscount && (
              <button
                onClick={() => meta.onDiscount(fee)}
                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                title="Apply Discount"
              >
                <Tag className="h-5 w-5" />
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => meta.onCancel(info.getValue())}
                className="text-red-600 hover:text-red-900 p-1 rounded"
                title="Cancel Fee"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
        );
      },
    }),
  ];
  }, [data, selectedFees, onSelectionChange, hideStudentColumn]);

  return (
    <GenericDataTable
      data={data}
      columns={columns}
      initialPageSize={10}
      pageSizeOptions={[10, 20, 30, 50, 100]}
      emptyStateMessage="No student fees found."
      searchPlaceholder="Search by student name, roll number, etc."
      meta={{
        onViewDetails,
        onDiscount,
        onCancel,
        onPay,
        readOnly,
      } as TableMetaType}
    />
  );
}
