import { useNavigate } from 'react-router';
import { useCreateDiaryEntry } from '~/hooks/useDailyDiaryQueries';
import { DailyDiaryForm } from './DailyDiaryForm';
import type { CreateDailyDiaryRequest } from '~/types/dailyDiary';

export function CreateDailyDiary() {
  const navigate = useNavigate();
  const createDiaryMutation = useCreateDiaryEntry();

  const handleSubmit = async (data: CreateDailyDiaryRequest) => {
    try {
      await createDiaryMutation.mutateAsync(data);
      navigate('/dashboard/daily-diary');
    } catch (error) {
      console.error('Failed to create diary entry:', error);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Diary Entry</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new daily diary entry for your class
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <DailyDiaryForm
            onSubmit={handleSubmit}
            isLoading={createDiaryMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
