import { format } from 'date-fns';
import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import type { AttendanceRecord } from '~/types/attendance';
import { AttendanceStatus } from '~/types/attendance';
import { GenericDataTable } from '../common/table/GenericDataTable';

interface AttendanceRecordsTableProps {
  records: AttendanceRecord[];
}

const columnHelper = createColumnHelper<AttendanceRecord>();

const getStatusBadge = (status: AttendanceStatus) => {
  const statusConfig = {
    [AttendanceStatus.PRESENT]: {
      label: 'Present',
      icon: '✓',
    },
    [AttendanceStatus.ABSENT]: {
      label: 'Absent',
      icon: '✗',
    },
    [AttendanceStatus.LATE]: {
      label: 'Late',
      icon: '⏰',
    },
    [AttendanceStatus.LEAVE]: {
      label: 'Leave',
      icon: '📅',
    },
  };

  const config = statusConfig[status] || statusConfig[AttendanceStatus.PRESENT];

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

const getDayOfWeek = (dateString: string) => {
  try {
    return format(new Date(dateString), 'EEEE');
  } catch {
    return '—';
  }
};

const formatDateDisplay = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch {
    return '—';
  }
};

export function AttendanceRecordsTable({ records }: AttendanceRecordsTableProps) {
  const columns = useMemo(() => [
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {formatDateDisplay(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor('date', {
      id: 'day',
      header: 'Day',
      cell: (info) => (
        <div className="text-sm text-gray-600">{getDayOfWeek(info.getValue())}</div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => getStatusBadge(info.getValue()),
    }),
    columnHelper.accessor('checkInTime', {
      header: 'Check-In Time',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue() || '—'}
        </div>
      ),
    }),
    columnHelper.accessor('checkOutTime', {
      header: 'Check-Out Time',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue() || '—'}
        </div>
      ),
    }),
    columnHelper.accessor('reason', {
      header: 'Reason',
      cell: (info) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {info.getValue() || '—'}
        </div>
      ),
    }),
  ], []);

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <p className="text-gray-600">No attendance records found</p>
        <p className="text-gray-400 text-sm mt-1">
          Records will appear here once attendance is marked
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
        <p className="text-sm text-gray-600 mt-1">
          Detailed attendance history ({records.length} record{records.length !== 1 ? 's' : ''})
        </p>
      </div>

      <GenericDataTable
        data={records}
        columns={columns}
        showSearchBox={false}
        emptyStateMessage="No attendance records found."
      />
    </div>
  );
}

