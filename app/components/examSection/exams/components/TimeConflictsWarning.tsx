import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubjectName } from '~/utils/examValidation';

interface TimeConflictsWarningProps {
  conflicts: Array<{
    subject1: string;
    subject2: string;
    date: string;
    time1: string;
    time2: string;
  }>;
}

const TimeConflictsWarning: React.FC<TimeConflictsWarningProps> = ({ conflicts }) => {
  // Fetch subjects for displaying names
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await fetch('/subjects');
      return response.json();
    }
  });

  // Group conflicts by date for clearer display
  const conflictsByDate = conflicts.reduce((acc, conflict) => {
    if (!acc[conflict.date]) acc[conflict.date] = [];
    acc[conflict.date].push(conflict);
    return acc;
  }, {} as Record<string, typeof conflicts>);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md mx-6 mt-6">
      <h3 className="text-red-700 font-medium mb-2">
        {conflicts.length} Time {conflicts.length === 1 ? 'Conflict' : 'Conflicts'} Detected
      </h3>
      
      {Object.entries(conflictsByDate).map(([date, dateConflicts]) => (
        <div key={date} className="mb-3">
          <h4 className="font-medium">Conflicts on {new Date(date).toLocaleDateString()}:</h4>
          <ul className="list-disc pl-5 text-red-600">
            {dateConflicts.map((conflict, index) => (
              <li key={index} className="mb-2">
                <div>
                  <strong>Subject 1:</strong> {getSubjectName(conflict.subject1, subjects)} ({conflict.time1})
                </div>
                <div>
                  <strong>Subject 2:</strong> {getSubjectName(conflict.subject2, subjects)} ({conflict.time2})
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      
      <p className="text-sm text-red-700 mt-2">
        Please adjust the exam times to resolve these conflicts before submitting.
      </p>
    </div>
  );
};

export default TimeConflictsWarning;
