import { useMemo } from 'react';
import { useLeavePolicy } from '~/hooks/useTenantSettings';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';

interface ScheduleSlot {
  dayOfWeek: number;
  dayName?: string;
  periodNumber: number;
  periodName?: string;
  startTime?: string;
  endTime?: string;
  subjectId: string;
  subjectName?: string;
  teacherId: string;
  teacherName?: string;
  room?: string;
  className?: string;
}

interface ScheduleGridProps {
  schedule: ScheduleSlot[];
  title?: string;
  showTeacher?: boolean;
  showClass?: boolean;
  emptyMessage?: string;
}

const ALL_DAYS = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

export function ScheduleGrid({
  schedule,
  title,
  showTeacher = false,
  showClass = false,
  emptyMessage = 'No schedule available'
}: ScheduleGridProps) {
  const { data: leavePolicy } = useLeavePolicy();

  const weeklyOffDays = leavePolicy?.weeklyOffDays || [0, 6];
  const workingDays = useMemo(() => {
    return ALL_DAYS.filter(day => !weeklyOffDays.includes(day.value));
  }, [weeklyOffDays]);

  const groupedSchedule = useMemo(() => {
    const grouped: Record<number, ScheduleSlot[]> = {};

    workingDays.forEach(day => {
      grouped[day.value] = schedule
        .filter(slot => slot.dayOfWeek === day.value)
        .sort((a, b) => a.periodNumber - b.periodNumber);
    });

    return grouped;
  }, [schedule, workingDays]);

  const allPeriods = useMemo(() => {
    const periods = new Set<number>();
    schedule.forEach(slot => periods.add(slot.periodNumber));
    return Array.from(periods).sort((a, b) => a - b);
  }, [schedule]);

  const currentDay = new Date().getDay();

  if (schedule.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Period
                </th>
                {workingDays.map(day => (
                  <th
                    key={day.value}
                    className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                      day.value === currentDay
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className="hidden sm:block">{day.label}</div>
                    <div className="sm:hidden">{day.short}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allPeriods.map(periodNumber => {
                const sampleSlot = schedule.find(s => s.periodNumber === periodNumber);
                return (
                  <tr key={periodNumber}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                      <div className="flex flex-col">
                        <span>{sampleSlot?.periodName || `Period ${periodNumber}`}</span>
                        {sampleSlot?.startTime && (
                          <span className="text-xs text-gray-500">
                            {sampleSlot.startTime} - {sampleSlot.endTime}
                          </span>
                        )}
                      </div>
                    </td>
                    {workingDays.map(day => {
                      const slot = groupedSchedule[day.value]?.find(
                        s => s.periodNumber === periodNumber
                      );

                      return (
                        <td
                          key={`${day.value}-${periodNumber}`}
                          className={`px-3 py-3 text-sm ${
                            day.value === currentDay ? 'bg-blue-50' : ''
                          }`}
                        >
                          {slot ? (
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900 flex items-start gap-1">
                                <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{slot.subjectName}</span>
                              </div>

                              {showTeacher && slot.teacherName && (
                                <div className="text-gray-600 flex items-center gap-1 text-xs">
                                  <User className="h-3 w-3 text-gray-400" />
                                  <span className="truncate">{slot.teacherName}</span>
                                </div>
                              )}

                              {showClass && slot.className && (
                                <div className="text-gray-600 flex items-center gap-1 text-xs">
                                  <BookOpen className="h-3 w-3 text-gray-400" />
                                  <span className="truncate">{slot.className}</span>
                                </div>
                              )}

                              {slot.room && (
                                <div className="text-gray-500 flex items-center gap-1 text-xs">
                                  <MapPin className="h-3 w-3 text-gray-400" />
                                  <span>{slot.room}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-300 text-xs">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Total Periods: {allPeriods.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
