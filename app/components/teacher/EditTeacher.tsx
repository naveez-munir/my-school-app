import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { fetchTeacherById, updateTeacher } from '~/store/features/teacherSlice';
import { TeacherForm } from './TeacherForm';
import type { CreateTeacherDto } from '~/types/teacher';
import { useNavigate, useParams } from 'react-router';

export function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTeacher, loading } = useAppSelector((state) => state.teachers);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherById(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (data: CreateTeacherDto) => {
    try {
      if (id) {
        await dispatch(updateTeacher({ id, data })).unwrap();
        navigate('/dashboard/teachers');
      }
    } catch (error) {
      console.error('Failed to update teacher:', error);
    }
  };

  if (!currentTeacher) {
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
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
