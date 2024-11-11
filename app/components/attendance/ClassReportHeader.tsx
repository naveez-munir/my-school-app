import type { Class, AttendanceSummary, DateRange } from '~/types/attendance';
import { format } from 'date-fns';

interface ClassReportHeaderProps {
  classInfo: Class;
  summary: AttendanceSummary;
  dateRange?: DateRange;
  totalStudents?: number;
}

export function ClassReportHeader({ classInfo, summary, dateRange, totalStudents }: ClassReportHeaderProps) {
  const attendancePercentage = summary.presentPercentage || 0;
  
  const presentPercentage = summary.total > 0 ? (summary.present / summary.total) * 100 : 0;
  const absentPercentage = summary.total > 0 ? (summary.absent / summary.total) * 100 : 0;
  const latePercentage = summary.total > 0 ? (summary.late / summary.total) * 100 : 0;

  const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const dateRangeText = dateRange?.startDate && dateRange?.endDate
    ? `${formatDateDisplay(dateRange.startDate)} - ${formatDateDisplay(dateRange.endDate)}`
    : 'All Time';

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {classInfo.className} - Section {classInfo.section}
          </h2>
          <p className="text-gray-600 mt-1">Class Attendance Report</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📅 {dateRangeText}</span>
            {totalStudents && <span>👥 {totalStudents} Students</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Overall Attendance</div>
          <div className="text-5xl font-bold text-gray-900">{attendancePercentage.toFixed(0)}%</div>
        </div>
      </div>

      {/* Attendance Distribution */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Attendance Distribution</h3>
        <div className="space-y-3">
          {/* Present */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Present</span>
              <span className="text-sm font-semibold text-gray-900">
                {summary.present} ({presentPercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${presentPercentage}%` }}
              />
            </div>
          </div>

          {/* Absent */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Absent</span>
              <span className="text-sm font-semibold text-gray-900">
                {summary.absent} ({absentPercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${absentPercentage}%` }}
              />
            </div>
          </div>

          {/* Late */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Late</span>
              <span className="text-sm font-semibold text-gray-900">
                {summary.late} ({latePercentage.toFixed(0)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${latePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

