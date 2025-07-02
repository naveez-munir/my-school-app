import { useState } from 'react';
import { useParams } from 'react-router';
import { useStudent } from '~/hooks/useStudentQueries';
import { useDiaryEntriesForStudent } from '~/hooks/useDailyDiaryQueries';
import type { DailyDiaryResponse, DiaryQueryParams } from '~/types/dailyDiary';
import { DailyDiaryListSkeleton } from './DailyDiaryListSkeleton';
import { StudentDiaryTableWrapper } from './StudentDiaryTableWrapper';

export function StudentDailyDiaryDashboard() {
  const { id } = useParams();
  const [dateRange, setDateRange] = useState<DiaryQueryParams>({
    startDate: '',
    endDate: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const { 
    data: student, 
    isLoading: isLoadingStudent 
  } = useStudent(id || '');

  const queryParams: DiaryQueryParams = {
    ...(dateRange.startDate && { startDate: dateRange.startDate }),
    ...(dateRange.endDate && { endDate: dateRange.endDate }),
  };

  const { 
    data: diaryEntries = [], 
    isLoading: isLoadingDiary, 
    error 
  } = useDiaryEntriesForStudent(student?._id || '', queryParams);

  // Event handlers
  const handleView = (diary: DailyDiaryResponse) => {
    // Navigate to view diary detail page if needed
    // This could be implemented to show a modal or navigate to a detail page
    console.log('Viewing diary entry:', diary.id);
  };

  // Student view only shows diary entries, no editing/deleting

  const isLoading = isLoadingStudent || isLoadingDiary;

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">My Daily Diary</h1>
          {student && (
            <p className="text-sm text-gray-500">
              Diary entries for {student.firstName} {student.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search entries..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <DailyDiaryListSkeleton />
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {(error as Error).message || "An error occurred while loading diary entries"}
          </div>
        ) : (
          <StudentDiaryTableWrapper
            data={diaryEntries}
            globalFilter={globalFilter}
            onView={handleView}
          />
        )}
      </div>
    </div>
  );
}
