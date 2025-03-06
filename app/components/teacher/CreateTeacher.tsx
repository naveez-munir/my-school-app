import { useCreateTeacher } from '~/hooks/useTeacherQueries';
import { TeacherForm } from './TeacherForm';
import type { CreateTeacherDto } from '~/types/teacher';
import { useNavigate } from 'react-router';

export function CreateTeacher() {
  const navigate = useNavigate();
  const createTeacherMutation = useCreateTeacher();

  const handleSubmit = async (data: CreateTeacherDto) => {
    try {
      await createTeacherMutation.mutateAsync(data);
      navigate('/dashboard/teachers');
    } catch (error) {
      console.error('Failed to create teacher:', error);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Teacher</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new teacher profile with their personal and professional information.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <TeacherForm
            onSubmit={handleSubmit}
            isLoading={createTeacherMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
