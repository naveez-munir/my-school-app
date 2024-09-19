import { useCreateTeacher } from '~/hooks/useTeacherQueries';
import { TeacherForm } from './TeacherForm';
import type { CreateTeacherDto } from '~/types/teacher';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getErrorMessage } from '~/utils/error';

export function CreateTeacher() {
  const navigate = useNavigate();
  const createTeacherMutation = useCreateTeacher();
  const queryClient = useQueryClient();

  const handleSubmit = (data: CreateTeacherDto) => {
    const submissionData = { ...data };
    if (submissionData.classTeacherOf === '') {
      delete submissionData.classTeacherOf;
    }

    createTeacherMutation.mutate(
      submissionData,
      {
        onSuccess: () => {
          toast.success('Teacher created successfully');
          queryClient.invalidateQueries({ queryKey: ['classes'] });
          navigate('/dashboard/teachers');
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        }
      }
    );
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
