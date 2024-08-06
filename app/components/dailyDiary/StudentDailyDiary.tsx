import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useStudent } from '~/hooks/useStudentQueries';
import { useDiaryEntriesForStudent } from '~/hooks/useDailyDiaryQueries';
import type { DailyDiaryResponse, DiaryQueryParams } from '~/types/dailyDiary';
import { DailyDiaryListSkeleton } from './DailyDiaryListSkeleton';
import { StudentDiaryTableWrapper } from './StudentDiaryTableWrapper';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';

interface StudentDailyDiaryDashboardProps {
  studentId?: string;
}

export function StudentDailyDiaryDashboard({ studentId: propStudentId }: StudentDailyDiaryDashboardProps = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = propStudentId || id || '';
  const [dateRange, setDateRange] = useState<DiaryQueryParams>({
    startDate: '',
    endDate: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const {
    data: student,
    isLoading: isLoadingStudent
  } = useStudent(studentId);

  const queryParams: DiaryQueryParams = {
    ...(dateRange.startDate && { startDate: dateRange.startDate }),
    ...(dateRange.endDate && { endDate: dateRange.endDate }),
  };

  const {
    data: diaryEntries = [],
    isLoading: isLoadingDiary,
    error
  } = useDiaryEntriesForStudent(student?._id || '', queryParams);

  const handleView = (diary: DailyDiaryResponse) => {
    const diaryId = (diary as any)._id || diary.id;
    navigate(`/dashboard/daily-diary/${diaryId}`);
  };

  const isLoading = isLoadingStudent || isLoadingDiary;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-responsive-xl font-bold tracking-tight text-gray-700">My Daily Diary</h1>
          {student && (
            <p className="text-xs sm:text-sm text-gray-500">
              Diary entries for {student.firstName} {student.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow">
        <div className="space-y-3 sm:space-y-4">
          {/* Row 1: Search - Full Width */}
          <div>
            <TextInput
              label="Search"
              value={globalFilter}
              onChange={setGlobalFilter}
              placeholder="Search entries..."
            />
          </div>

          {/* Row 2: Date Inputs - 2 Columns */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <DateInput
              label="Start Date"
              value={dateRange.startDate || ''}
              onChange={(value) => setDateRange(prev => ({ ...prev, startDate: value }))}
            />
            <DateInput
              label="End Date"
              value={dateRange.endDate || ''}
              onChange={(value) => setDateRange(prev => ({ ...prev, endDate: value }))}
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
