import type { Class } from '~/types/attendance';

interface MonthlyReportHeaderProps {
  month: number;
  year: number;
  userType?: string;
  classInfo?: Class;
  averageAttendance: number;
}

export function MonthlyReportHeader({ 
  month, 
  year, 
  userType, 
  classInfo, 
  averageAttendance 
}: MonthlyReportHeaderProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = monthNames[month - 1] || 'Unknown';
  const displayUserType = userType || 'All Users';

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Monthly Report - {monthName} {year}
          </h2>
          <p className="text-gray-600 mt-1">{displayUserType} Attendance</p>
          {classInfo && (
            <p className="text-sm text-gray-500 mt-1">
              Class: {classInfo.className} - Section {classInfo.section}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Average Attendance</div>
          <div className="text-5xl font-bold text-gray-900">
            {averageAttendance.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}

