import { getTenantName } from '~/utils/auth';
import { formatUserFriendlyDate } from '~/utils/dateUtils';
import type { Timetable } from '~/types/timetable';

interface TimetablePrintProps {
  timetable: Timetable;
}

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export function TimetablePrint({ timetable }: TimetablePrintProps) {
  const schoolName = getTenantName() || 'School Name';

  const getSlot = (dayOfWeek: number, periodNumber: number) => {
    return timetable.schedule.find(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.periodNumber === periodNumber
    );
  };

  const allPeriodNumbers = Array.from(
    new Set(timetable.schedule.map((slot) => slot.periodNumber))
  ).sort((a, b) => a - b);

  const activeDays = DAYS.filter((day) =>
    timetable.schedule.some((slot) => slot.dayOfWeek === day.value)
  );

  return (
    <div className="hidden print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #timetable-print, #timetable-print * {
            visibility: visible !important;
          }
          #timetable-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div id="timetable-print" className="p-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{schoolName}</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Class Timetable</h2>
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-lg text-gray-800">{timetable.displayName}</p>
          </div>
        </div>

        {/* Timetable Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-semibold text-gray-700">Effective From: </span>
            <span className="text-gray-900">{formatUserFriendlyDate(timetable.effectiveFrom)}</span>
          </div>
          {timetable.effectiveTo && (
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-semibold text-gray-700">Effective To: </span>
              <span className="text-gray-900">{formatUserFriendlyDate(timetable.effectiveTo)}</span>
            </div>
          )}
        </div>

        {/* Timetable Grid */}
        <div className="mb-6">
          <table className="w-full border-collapse border-2 border-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-gray-800 px-3 py-3 text-left font-bold text-gray-900">
                  Day / Period
                </th>
                {allPeriodNumbers.map((periodNum) => {
                  const slot = timetable.schedule.find((s) => s.periodNumber === periodNum);
                  return (
                    <th
                      key={periodNum}
                      className="border-2 border-gray-800 px-2 py-3 text-center font-bold text-gray-900"
                    >
                      <div className="text-sm">Period {periodNum}</div>
                      {slot?.startTime && slot?.endTime && (
                        <div className="text-xs font-normal text-gray-600 mt-1">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {activeDays.map((day) => (
                <tr key={day.value} className="hover:bg-gray-50">
                  <td className="border-2 border-gray-800 px-3 py-4 font-semibold text-gray-900 bg-gray-100">
                    {day.label}
                  </td>
                  {allPeriodNumbers.map((periodNum) => {
                    const slot = getSlot(day.value, periodNum);
                    return (
                      <td
                        key={`${day.value}-${periodNum}`}
                        className={`border-2 border-gray-800 px-2 py-4 text-center ${
                          slot ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        {slot ? (
                          <div className="space-y-1">
                            <div className="font-semibold text-sm text-gray-900">
                              {slot.subjectName || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-700">
                              {slot.teacherName || 'N/A'}
                            </div>
                            {slot.room && (
                              <div className="text-xs text-gray-600">Room: {slot.room}</div>
                            )}
                            {slot.isBreak && (
                              <div className="text-xs font-medium text-orange-600">BREAK</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="print:fixed print:bottom-6 print:left-0 print:right-0 print:px-6">
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded mb-3">
            <p className="font-semibold text-gray-800 mb-1">Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>This timetable is subject to change based on school requirements</li>
              <li>Students must attend all scheduled classes</li>
              <li>Any changes will be communicated in advance</li>
            </ul>
          </div>
          <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-3">
            <p>This is a computer-generated timetable.</p>
            <p className="mt-1">Printed on: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

