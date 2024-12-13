import { AlertTriangle, XCircle } from 'lucide-react';
import type { TimetableConflict } from '~/types/timetable';

interface ConflictBannerProps {
  conflicts: TimetableConflict[];
}

// Using 0-6 format (Sunday=0, Saturday=6) to match backend and JavaScript Date standard
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  const errors = conflicts.filter(c => c.severity === 'ERROR');
  const warnings = conflicts.filter(c => c.severity === 'WARNING');

  return (
    <div className="space-y-3">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900">
                {errors.length} Error{errors.length > 1 ? 's' : ''} Found
              </h3>
              <p className="text-xs text-red-700 mt-1">
                These conflicts must be resolved before publishing the timetable.
              </p>
              <ul className="mt-3 space-y-2">
                {errors.map((conflict, index) => (
                  <li key={index} className="text-sm text-red-800">
                    <span className="font-semibold">
                      {DAY_NAMES[conflict.dayOfWeek]} Period {conflict.periodNumber}:
                    </span>{' '}
                    {conflict.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900">
                {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-yellow-700 mt-1">
                These are potential issues that should be reviewed.
              </p>
              <ul className="mt-3 space-y-2">
                {warnings.map((conflict, index) => (
                  <li key={index} className="text-sm text-yellow-800">
                    <span className="font-semibold">
                      {DAY_NAMES[conflict.dayOfWeek]} Period {conflict.periodNumber}:
                    </span>{' '}
                    {conflict.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

