import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { useDiaryEntry, useUpdateDiaryEntry } from '~/hooks/useDailyDiaryQueries';
import { DailyDiaryForm } from './DailyDiaryForm';
import type { UpdateDailyDiaryRequest } from '~/types/dailyDiary';

export function EditDailyDiary() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: currentDiary, isLoading: fetchLoading } = useDiaryEntry(id || '');
  const updateDiaryMutation = useUpdateDiaryEntry();

  const handleSubmit = async (data: UpdateDailyDiaryRequest) => {
    try {
      if (id) {
        await updateDiaryMutation.mutateAsync({ id, data });
        toast.success('Diary entry updated successfully');
        navigate('/dashboard/daily-diary');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update diary entry');
      console.error('Failed to update diary entry:', error);
    }
  };

  if (fetchLoading || !currentDiary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Diary Entry</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your daily diary entry
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <DailyDiaryForm
            initialData={currentDiary}
            onSubmit={handleSubmit}
            isLoading={updateDiaryMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
