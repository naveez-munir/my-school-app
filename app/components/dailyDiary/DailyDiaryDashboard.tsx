import { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { DailyDiaryTable } from './DailyDiaryTable';
import { ClassSelector } from '~/components/common/ClassSelector';
import { TextInput } from '~/components/common/form/inputs/TextInput';
import { DateInput } from '~/components/common/form/inputs/DateInput';
import { SelectInput } from '~/components/common/form/inputs/SelectInput';
import { useDiaryEntriesPaginated, useDeleteDiaryEntry } from '~/hooks/useDailyDiaryQueries';
import { useTeacherProfile } from '~/hooks/useTeacherQueries';
import { getUserRole } from '~/utils/auth';
import { UserRoleEnum } from '~/types/user';
import type { DailyDiaryResponse, DiaryQueryParams, DiaryStatus } from '~/types/dailyDiary';
import { DailyDiaryListSkeleton } from './DailyDiaryListSkeleton';
import DeletePrompt from '~/components/common/DeletePrompt';
import { Info } from 'lucide-react';

const STATUS_OPTIONS: Record<string, string> = {
  ALL: 'All Status',
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
};

export function DailyDiaryDashboard() {
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [dateRange, setDateRange] = useState<DiaryQueryParams>({
    startDate: '',
    endDate: ''
  });
  const [globalFilter, setGlobalFilter] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [diaryToDelete, setDiaryToDelete] = useState<string | null>(null);

  const queryParams: DiaryQueryParams = {
    ...(selectedClassId && { classId: selectedClassId }),
    ...(selectedStatus && selectedStatus !== 'ALL' && { status: selectedStatus as DiaryStatus }),
    ...(dateRange.startDate && { startDate: dateRange.startDate }),
    ...(dateRange.endDate && { endDate: dateRange.endDate }),
    page,
    limit: 10,
  };

  const {
    data: response,
    isLoading,
    error
  } = useDiaryEntriesPaginated(queryParams);

  const diaryEntries = response?.data || [];
  const meta = response?.meta;

  const userRole = getUserRole();
  const isTeacherRole = userRole?.role === UserRoleEnum.TEACHER;
  const { data: currentTeacher } = useTeacherProfile(isTeacherRole);
  const deleteDiaryMutation = useDeleteDiaryEntry();

  const isClassTeacher = !!currentTeacher?.classTeacherOf;

  const handleDelete = (id: string) => {
    setDiaryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (diaryToDelete) {
      deleteDiaryMutation.mutate(diaryToDelete, {
        onSuccess: () => {
          toast.success('Diary entry deleted successfully');
          setIsDeleteModalOpen(false);
          setDiaryToDelete(null);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to delete diary entry');
          setIsDeleteModalOpen(false);
          setDiaryToDelete(null);
        }
      });
    }
  };

  const handleEdit = (diary: DailyDiaryResponse) => {
    navigate(`/dashboard/daily-diary/${diary.id}/edit`);
  };

  const handleView = (diary: DailyDiaryResponse) => {
    navigate(`/dashboard/daily-diary/${diary.id}`);
  };

  const handleCreateNew = () => {
    navigate('/dashboard/daily-diary/new', {
      state: {
        classId: selectedClassId || currentTeacher?.classTeacherOf?._id,
        isClassTeacher: isClassTeacher
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-responsive-xl font-bold tracking-tight text-gray-700">Daily Diary</h1>
          <p className="text-xs lg:text-sm text-gray-500">
            Manage class diary entries, assignments, and activities
          </p>
        </div>
        {isClassTeacher ? (
          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Add New Entry
          </button>
        ) : (
          <div className="text-sm text-gray-500 italic">
            Only class teachers can create diary entries
          </div>
        )}
      </div>

      {!isClassTeacher && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> As a subject teacher, you can add homework and tasks to existing diary entries by viewing any diary and clicking "Add Task".
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg shadow">
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <TextInput
              label="Search"
              value={globalFilter}
              onChange={setGlobalFilter}
              placeholder="Search entries..."
            />

            <ClassSelector
              label="Filter by Class"
              value={selectedClassId}
              onChange={(classId) => { setSelectedClassId(classId); setPage(1); }}
              placeholder="All Classes"
            />

            <SelectInput
              label="Status"
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={(value) => { setSelectedStatus(value); setPage(1); }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <DateInput
              label="Start Date"
              value={dateRange.startDate || ''}
              onChange={(value) => { setDateRange(prev => ({ ...prev, startDate: value })); setPage(1); }}
            />

            <DateInput
              label="End Date"
              value={dateRange.endDate || ''}
              onChange={(value) => { setDateRange(prev => ({ ...prev, endDate: value })); setPage(1); }}
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
          <>
            <DailyDiaryTable
              data={diaryEntries}
              globalFilter={globalFilter}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {meta && meta.totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                  Page {meta.currentPage} of {meta.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!meta.hasPreviousPage}
                    className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!meta.hasNextPage}
                    className="px-3 py-1 border text-gray-500 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DeletePrompt
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDiaryToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName="diary entry"
      />
    </div>
  );
}
