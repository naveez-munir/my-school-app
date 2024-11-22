import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

interface AttendanceSummaryCardProps {
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
  onViewDetails?: () => void;
  isLoading?: boolean;
}

export function AttendanceSummaryCard({
  present,
  absent,
  late,
  leave,
  total,
  onViewDetails,
  isLoading = false
}: AttendanceSummaryCardProps) {
  const presentPercentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Today's Attendance</h3>
        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
        </div>
      ) : (
        <>
          <div className="mb-3 sm:mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-green-600">{presentPercentage}%</span>
              <span className="text-xs sm:text-sm text-gray-500">attendance rate</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {present} ({total > 0 ? ((present / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <span className="text-sm font-semibold text-red-600">
                {absent} ({total > 0 ? ((absent / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Late</span>
              </div>
              <span className="text-sm font-semibold text-yellow-600">
                {late} ({total > 0 ? ((late / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">On Leave</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {leave} ({total > 0 ? ((leave / total) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>

          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="mt-4 w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details →
            </button>
          )}
        </>
      )}
    </div>
  );
}

