import { useNavigate, useParams } from 'react-router';
import { useClass } from '~/hooks/useClassQueries';
import { useSubjects } from '~/hooks/useSubjectQueries';
import { useTeachers } from '~/hooks/useTeacherQueries';
import { useCreateClass, useUpdateClass } from '~/hooks/useClassQueries';
import { ClassForm } from './ClassForm';
import { TeacherAssignmentSection } from './TeacherAssignmentSection';
import type { Class, CreateClassDto } from '~/types/class';

export function CreateEditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: currentClass, isLoading: classLoading } = useClass(id || '');
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  
  const createClassMutation = useCreateClass();
  const updateClassMutation = useUpdateClass();

  const handleSubmit = (data: CreateClassDto) => {
    if (id) {
      updateClassMutation.mutate(
        { id, data }, 
        {
          onSuccess: () => {
            navigate('/dashboard/classes');
          },
          onError: (error) => {
            console.error('Failed to update class:', error);
          }
        }
      );
    } else {
      createClassMutation.mutate(
        data, 
        {
          onSuccess: () => {
            navigate('/dashboard/classes');
          },
          onError: (error) => {
            console.error('Failed to create class:', error);
          }
        }
      );
    }
  };

  const isLoading = (id && classLoading) || (id && subjectsLoading) || (id && teachersLoading);

  if (isLoading) {
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
          {id 
            ? 'Update basic class information. Teacher assignments can be managed from the class details page.' 
            : 'Create a new class with basic information. Teachers can be assigned after creation.'
          }
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <ClassForm
            initialData={currentClass || undefined}
            onSubmit={handleSubmit}
            subjects={subjects}
            isLoading={createClassMutation.isPending || updateClassMutation.isPending}
            mode={id ? 'edit' : 'create'}
          />
          {id && 
            <TeacherAssignmentSection
              classData={currentClass as Class}
              teachers={teachers}
              isLoading={classLoading}
            />
          }
        </div>
      </div>
    </div>
  );
}
