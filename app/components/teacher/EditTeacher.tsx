import { useTeacher, useUpdateTeacher } from '~/hooks/useTeacherQueries';
import { TeacherForm } from './TeacherForm';
import type { CreateTeacherDto } from '~/types/teacher';
import { useNavigate, useParams } from 'react-router';

export function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // React Query hooks
  const { data: currentTeacher, isLoading: fetchLoading } = useTeacher(id || '');
  const updateTeacherMutation = useUpdateTeacher();

  const handleSubmit = async (data: CreateTeacherDto) => {
    try {
      if (id) {
        await updateTeacherMutation.mutateAsync({ id, data });
        navigate('/dashboard/teachers');
      }
    } catch (error) {
      console.error('Failed to update teacher:', error);
    }
  };

  if (fetchLoading || !currentTeacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Teacher</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update teacher information and credentials.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <TeacherForm
            initialData={currentTeacher}
            onSubmit={handleSubmit}
            isLoading={updateTeacherMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
