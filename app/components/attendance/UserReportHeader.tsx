import type { User, AttendanceSummary } from '~/types/attendance';

interface UserReportHeaderProps {
  user: User;
  summary: AttendanceSummary;
}

export function UserReportHeader({ user, summary }: UserReportHeaderProps) {
  const attendancePercentage = summary.attendancePercentage || 0;

  const presentPercentage = summary.total > 0 ? (summary.present / summary.total) * 100 : 0;
  const absentPercentage = summary.total > 0 ? (summary.absent / summary.total) * 100 : 0;
  const latePercentage = summary.total > 0 ? (summary.late / summary.total) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600 mt-1">{user.type} • Attendance Report</p>
          {user.rollNumber && (
            <p className="text-gray-500 text-sm mt-1">Roll Number: {user.rollNumber}</p>
          )}
          {user.employeeId && (
            <p className="text-gray-500 text-sm mt-1">Employee ID: {user.employeeId}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Overall Attendance</div>
          <div className="text-5xl font-bold text-gray-900">{attendancePercentage.toFixed(0)}%</div>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="space-y-4">
        {/* Present Days */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Present Days</span>
            <span className="text-sm font-semibold text-gray-900">
              {summary.present}/{summary.total} ({presentPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${presentPercentage}%` }}
            />
          </div>
        </div>

        {/* Absent Days */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Absent Days</span>
            <span className="text-sm font-semibold text-gray-900">
              {summary.absent}/{summary.total} ({absentPercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${absentPercentage}%` }}
            />
          </div>
        </div>

        {/* Late Days */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Late Days</span>
            <span className="text-sm font-semibold text-gray-900">
              {summary.late}/{summary.total} ({latePercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${latePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

