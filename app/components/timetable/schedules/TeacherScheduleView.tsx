import { useMemo } from 'react';
import { ScheduleGrid } from './ScheduleGrid';
import { Calendar, Users, BookOpen, Clock } from 'lucide-react';

interface TeacherScheduleViewProps {
  schedule: any[];
  teacherName?: string;
  academicYear?: string;
  isLoading?: boolean;
}

export function TeacherScheduleView({
  schedule,
  teacherName,
  academicYear,
  isLoading
}: TeacherScheduleViewProps) {
  const scheduleSlots = useMemo(() => {
    if (!schedule || schedule.length === 0) return [];

    // Flatten the nested structure: schedule is an array of classes, each with slots
    return schedule.flatMap((classSchedule: any) =>
      (classSchedule.slots || []).map((slot: any) => ({
        ...slot,
        classId: classSchedule.classId,
        className: classSchedule.className
      }))
    );
  }, [schedule]);

  const stats = useMemo(() => {
    if (!scheduleSlots || scheduleSlots.length === 0) {
      return {
        uniqueClasses: 0,
        uniqueSubjects: 0,
        totalPeriods: 0,
        busiestDay: { day: '', count: 0 },
        dailyBreakdown: {},
        classDistribution: {},
        totalHours: 0
      };
    }

    const uniqueClasses = new Set(scheduleSlots.map((s: any) => s.className)).size;
    const uniqueSubjects = new Set(scheduleSlots.map((s: any) => s.subjectName)).size;
    const totalPeriods = scheduleSlots.length;

    // Daily breakdown
    const dailyBreakdown = scheduleSlots.reduce((acc: any, slot: any) => {
      const day = slot.dayName || `Day ${slot.dayOfWeek}`;
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    // Busiest day
    const busiestDay = Object.entries(dailyBreakdown).reduce(
      (max: any, [day, count]: any) => (count > max.count ? { day, count } : max),
      { day: '', count: 0 }
    );

    // Class distribution
    const classDistribution = scheduleSlots.reduce((acc: any, slot: any) => {
      const className = slot.className || 'Unknown';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});

    // Calculate total teaching hours
    const totalMinutes = scheduleSlots.reduce((total: number, slot: any) => {
      if (slot.startTime && slot.endTime) {
        const [startHour, startMin] = slot.startTime.split(':').map(Number);
        const [endHour, endMin] = slot.endTime.split(':').map(Number);
        const minutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
        return total + minutes;
      }
      return total;
    }, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return {
      uniqueClasses,
      uniqueSubjects,
      totalPeriods,
      busiestDay,
      dailyBreakdown,
      classDistribution,
      totalHours
    };
  }, [scheduleSlots]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header & Statistics */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <h2 className="text-responsive-lg font-bold text-gray-800">My Teaching Schedule</h2>
        </div>
        {teacherName && (
          <p className="text-xs lg:text-sm text-gray-600 mb-3 sm:mb-4">
            {teacherName}
            {academicYear && ` • ${academicYear}`}
          </p>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <div className="bg-blue-50 rounded-lg p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2 text-blue-600 mb-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-xs font-medium uppercase">Classes</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.uniqueClasses}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2 text-green-600 mb-1">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-xs font-medium uppercase">Subjects</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{stats.uniqueSubjects}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2 text-purple-600 mb-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-xs font-medium uppercase">Periods/Week</span>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">{stats.totalPeriods}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-2 sm:p-3 lg:p-4">
            <div className="flex items-center gap-1 sm:gap-2 text-orange-600 mb-1">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-xs font-medium uppercase">Busiest Day</span>
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-orange-900">
              {stats.busiestDay.day ? `${stats.busiestDay.day} (${stats.busiestDay.count})` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Daily Teaching Load */}
        {Object.keys(stats.dailyBreakdown).length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase mb-2">Daily Teaching Load</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Object.entries(stats.dailyBreakdown).map(([day, count]) => (
                <div key={day} className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  <span className="font-medium text-gray-700">{day}:</span>{' '}
                  <span className="text-gray-600">{count} periods</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Teaching Hours */}
        {stats.totalHours > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-[10px] sm:text-xs font-medium text-gray-600 uppercase mb-2">Total Teaching Hours</p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="font-semibold">{stats.totalHours} hours per week</span>
            </div>
          </div>
        )}
      </div>

      {/* Class Distribution */}
      {Object.keys(stats.classDistribution).length > 0 && (
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h3 className="text-responsive-base font-semibold text-gray-800">Class Distribution</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {Object.entries(stats.classDistribution)
              .sort(([, a]: any, [, b]: any) => b - a)
              .map(([className, count]) => (
                <div key={className} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{className}</span>
                  <span className="text-xs sm:text-sm text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full">
                    {count} {count === 1 ? 'period' : 'periods'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Schedule Grid */}
      <ScheduleGrid
        schedule={scheduleSlots}
        showTeacher={false}
        showClass={true}
        emptyMessage="No classes assigned. Please contact the administrator."
      />

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-yellow-900">
            <p className="font-semibold mb-1">Scheduling Notes</p>
            <p className="text-yellow-800">
              If you need to request a substitution due to absence, please use the Exception
              Management system. Any changes will be reflected here automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
