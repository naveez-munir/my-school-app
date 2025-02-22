import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { 
  createClass, 
  updateClass, 
  fetchClassById 
} from '~/store/features/classSlice';
import { fetchTeachers } from '~/store/features/teacherSlice';
import { fetchSubjects } from '~/store/features/subjectSlice';
import { ClassForm } from './ClassForm';
import type { CreateClassDto } from '~/types/class';
import { useNavigate, useParams } from 'react-router';

export function CreateEditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentClass, loading: classLoading } = useAppSelector((state) => state.classes);
  const { teachers, loading: teachersLoading } = useAppSelector((state) => state.teachers);
  const { subjects, loading: subjectsLoading } = useAppSelector((state) => state.subjects);
  useEffect(() => {
    // Load teachers and subjects for dropdowns
    dispatch(fetchTeachers());
    dispatch(fetchSubjects());

    // If editing, fetch class details
    if (id) {
      dispatch(fetchClassById(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (data: CreateClassDto) => {
    try {
      if (id) {
        await dispatch(updateClass({ id, data })).unwrap();
      } else {
        await dispatch(createClass(data)).unwrap();
      }
      navigate('/dashboard/classes');
    } catch (error) {
      console.error('Failed to save class:', error);
    }
  };

  if (teachersLoading || subjectsLoading || (id && classLoading)) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Class' : 'Create New Class'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {id ? 'Update class information' : 'Add a new class to the system'}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <ClassForm
            initialData={currentClass || undefined}
            onSubmit={handleSubmit}
            teachers={teachers}
            subjects={subjects}
            isLoading={classLoading}
          />
        </div>
      </div>
    </div>
  );
}
