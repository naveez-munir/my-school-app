import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import type { DailyReportItem } from '~/types/attendance';
import { GenericDataTable } from '../common/table/GenericDataTable';

interface MonthlyDailyBreakdownTableProps {
  dailyReport: { [key: number]: DailyReportItem };
  month: number;
  year: number;
}

type DailyReportRow = DailyReportItem & { day: number };

const columnHelper = createColumnHelper<DailyReportRow>();

export function MonthlyDailyBreakdownTable({
  dailyReport,
  month,
  year
}: MonthlyDailyBreakdownTableProps) {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthName = monthNames[month - 1] || 'Unknown';

  const tableData = useMemo(() => {
    return Object.keys(dailyReport)
      .map(Number)
      .sort((a, b) => a - b)
      .map((day) => ({
        ...dailyReport[day],
        day,
      }));
  }, [dailyReport]);

  const columns = useMemo(() => [
    columnHelper.accessor('day', {
      header: 'Date',
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {monthName} {info.getValue()}, {year}
        </div>
      ),
    }),
    columnHelper.accessor('present', {
      header: 'Present',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('absent', {
      header: 'Absent',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('late', {
      header: 'Late',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('present', {
      id: 'attendancePercentage',
      header: 'Attendance %',
      cell: (info) => {
        const total = info.row.original.total;
        const present = info.getValue();
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
        return (
          <div className="text-sm text-gray-900">
            {percentage}%
          </div>
        );
      },
    }),
  ], [monthName, year]);

  if (tableData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">📅</div>
        <p className="text-gray-600">No daily attendance data available</p>
        <p className="text-gray-400 text-sm mt-1">Daily breakdown will appear here once attendance is recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Breakdown</h3>
      </div>

      <GenericDataTable
        data={tableData}
        columns={columns}
        showSearchBox={false}
        emptyStateMessage="No daily attendance data available."
      />
    </div>
  );
}

