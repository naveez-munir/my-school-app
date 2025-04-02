import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useClass } from '~/hooks/useClassQueries';
import { useSubjects } from '~/hooks/useSubjectQueries';
import { useTeachers } from '~/hooks/useTeacherQueries';
import { useCreateClass, useUpdateClass } from '~/hooks/useClassQueries';
import { ClassForm } from './ClassForm';
import { TeacherAssignmentSection } from './TeacherAssignmentSection';
import type { Class, CreateClassDto } from '~/types/class';
import toast from "react-hot-toast";

type TabType = 'basic-info' | 'teacher-assignment';

export function CreateEditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('basic-info');

  const { data: currentClass, isLoading: classLoading, refetch: refetchClass } = useClass(id || '');
  
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
            toast.success("Class updated successfully");
            if (!id) {
              navigate('/dashboard/classes');
            } else if (activeTab === 'basic-info') {
              setActiveTab('teacher-assignment');
            }
            refetchClass();
          },
          onError: (error) => {
            handleError(error);
          }
        }
      );
    } else {
      createClassMutation.mutate(
        data, 
        {
          onSuccess: () => {
            toast.success("Class created successfully");
            navigate('/dashboard/classes');
          },
          onError: (error) => {
            handleError(error);
          }
        }
      );
    }
  };

  const handleError = (err: any) => {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    toast.error(errorMessage);
  };

  const refreshClassData = () => {
    if (id) {
      refetchClass();
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
            ? 'Update class information and manage teacher assignments using the tabs below.' 
            : 'Create a new class with basic information. Teachers can be assigned after creation.'
          }
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('basic-info')}
              className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
                activeTab === 'basic-info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Basic Information
            </button>
            {id && (
              <button
                onClick={() => setActiveTab('teacher-assignment')}
                className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'teacher-assignment'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Teacher Assignment
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'basic-info' && (
            <ClassForm
              initialData={currentClass || undefined}
              onSubmit={handleSubmit}
              subjects={subjects}
              isLoading={createClassMutation.isPending || updateClassMutation.isPending}
              mode={id ? 'edit' : 'create'}
            />
          )}
          {activeTab === 'teacher-assignment' && id && currentClass && (
            <TeacherAssignmentSection
              classData={currentClass as Class}
              teachers={teachers}
              isLoading={classLoading}
              onRefresh={refreshClassData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
