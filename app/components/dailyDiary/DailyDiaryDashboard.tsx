import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DailyDiaryTable } from './DailyDiaryTable';
import { ClassSelector } from '~/components/common/ClassSelector';
import { useDiaryEntries, useDeleteDiaryEntry } from '~/hooks/useDailyDiaryQueries';
import type { DailyDiaryResponse, DiaryQueryParams } from '~/types/dailyDiary';
import { DailyDiaryListSkeleton } from './DailyDiaryListSkeleton';

export function DailyDiaryDashboard() {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [dateRange, setDateRange] = useState<DiaryQueryParams>({
    startDate: '',
    endDate: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Query parameters for fetching data
  const queryParams: DiaryQueryParams = {
    ...(selectedClassId && { classId: selectedClassId }),
    ...(dateRange.startDate && { startDate: dateRange.startDate }),
    ...(dateRange.endDate && { endDate: dateRange.endDate }),
  };
  
  // React Query hooks
  const { 
    data: diaryEntries = [], 
    isLoading, 
    error 
  } = useDiaryEntries(queryParams);
  
  const deleteDiaryMutation = useDeleteDiaryEntry();

  // Event handlers
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this diary entry?')) {
      deleteDiaryMutation.mutate(id);
    }
  };

  const handleEdit = (diary: DailyDiaryResponse) => {
    navigate(`/dashboard/daily-diary/${diary.id}/edit`);
  };

  const handleView = (diary: DailyDiaryResponse) => {
    navigate(`/dashboard/daily-diary/${diary.id}`);
  };

  const handleCreateNew = () => {
    navigate('/dashboard/daily-diary/new');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">Daily Diary</h1>
          <p className="text-sm text-gray-500">
            Manage class diary entries, assignments, and activities
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Add New Entry
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid gap-4 md:grid-cols-4">
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
            <ClassSelector
              label="Filter by Class"
              value={selectedClassId}
              onChange={(classId) => setSelectedClassId(classId)}
              placeholder="All Classes"
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
            {(error as Error).message || "An error occurred"}
          </div>
        ) : (
          <DailyDiaryTable
            data={diaryEntries}
            globalFilter={globalFilter}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
