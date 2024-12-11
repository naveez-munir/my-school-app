import { useMemo } from 'react';
import { ScheduleGrid } from './ScheduleGrid';
import { Calendar, BookOpen, Users, Clock, GraduationCap } from 'lucide-react';

interface StudentScheduleViewProps {
  schedule: any[];
  studentName?: string;
  className?: string;
  academicYear?: string;
  isLoading?: boolean;
}

export function StudentScheduleView({
  schedule,
  studentName,
  className,
  academicYear,
  isLoading
}: StudentScheduleViewProps) {
  const scheduleSlots = useMemo(() => {
    if (!schedule || schedule.length === 0) return [];
    return schedule.filter((slot: any) => !slot.isBreak);
  }, [schedule]);

  const stats = useMemo(() => {
    if (!scheduleSlots || scheduleSlots.length === 0) {
      return {
        totalSubjects: 0,
        totalTeachers: 0,
        totalPeriods: 0,
        activeDays: 0,
        dailyBreakdown: {},
        timeRange: { start: '', end: '' },
        subjectDistribution: {}
      };
    }

    const uniqueSubjects = new Set(scheduleSlots.map((s: any) => s.subjectName)).size;
    const uniqueTeachers = new Set(scheduleSlots.map((s: any) => s.teacherName)).size;
    const totalPeriods = scheduleSlots.length;
    const activeDays = new Set(scheduleSlots.map((s: any) => s.dayOfWeek)).size;

    // Daily breakdown
    const dailyBreakdown = scheduleSlots.reduce((acc: any, slot: any) => {
      const day = slot.dayName || `Day ${slot.dayOfWeek}`;
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    // Time range
    const times = scheduleSlots
      .filter((s: any) => s.startTime && s.endTime)
      .map((s: any) => ({ start: s.startTime, end: s.endTime }));

    const timeRange = times.length > 0 ? {
      start: times.reduce((min: string, t: any) => t.start < min ? t.start : min, times[0].start),
      end: times.reduce((max: string, t: any) => t.end > max ? t.end : max, times[0].end)
    } : { start: '', end: '' };

    // Subject distribution
    const subjectDistribution = scheduleSlots.reduce((acc: any, slot: any) => {
      const subject = slot.subjectName || 'Unknown';
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSubjects: uniqueSubjects,
      totalTeachers: uniqueTeachers,
      totalPeriods,
      activeDays,
      dailyBreakdown,
      timeRange,
      subjectDistribution
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
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">My Class Schedule</h2>
        </div>
        {studentName && (
          <p className="text-sm text-gray-600 mb-4">
            {studentName}
            {className && ` • ${className}`}
            {academicYear && ` • ${academicYear}`}
          </p>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Subjects</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalSubjects}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Teachers</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.totalTeachers}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Periods/Week</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stats.totalPeriods}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Active Days</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{stats.activeDays}</p>
          </div>
        </div>

        {/* Daily Breakdown */}
        {Object.keys(stats.dailyBreakdown).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 uppercase mb-2">Daily Breakdown</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.dailyBreakdown).map(([day, count]) => (
                <div key={day} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium text-gray-700">{day}:</span>{' '}
                  <span className="text-gray-600">{count} periods</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Range */}
        {stats.timeRange.start && stats.timeRange.end && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 uppercase mb-2">School Hours</p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{stats.timeRange.start} - {stats.timeRange.end}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subject Distribution */}
      {Object.keys(stats.subjectDistribution).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Subject Distribution</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(stats.subjectDistribution)
              .sort(([, a]: any, [, b]: any) => b - a)
              .map(([subject, count]) => (
                <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{subject}</span>
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
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
        showTeacher={true}
        showClass={false}
        emptyMessage="No classes scheduled. Please contact your administrator."
      />

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Schedule Updates</p>
            <p className="text-blue-800">
              Check regularly for any changes or substitutions. Teacher absences will be marked
              with a replacement teacher notification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
