import { useTeacher, useUpdateTeacher } from '~/hooks/useTeacherQueries';
import { TeacherForm } from './TeacherForm';
import type { CreateTeacherDto } from '~/types/teacher';
import { useNavigate, useParams } from 'react-router';
import { cleanTeacherData } from '~/utils/cleanFormData';
import { useQueryClient } from '@tanstack/react-query';

export function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // React Query hooks
  const { data: currentTeacher, isLoading: fetchLoading } = useTeacher(id || '');
  const updateTeacherMutation = useUpdateTeacher();

  const handleSubmit = async (data: CreateTeacherDto) => {
    try {
      if (id) {
        const cleanedData = cleanTeacherData(data);
        await updateTeacherMutation.mutateAsync({ id, data: cleanedData });
        queryClient.invalidateQueries({ queryKey: ['classes'] });
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              {currentTeacher.photoUrl ? (
                <img 
                  src={currentTeacher.photoUrl} 
                  alt={`${currentTeacher.firstName} ${currentTeacher.lastName}`}
                  className="h-24 w-24 object-cover rounded-full border-4 border-white shadow"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow">
                  <span className="text-2xl font-medium text-gray-600">
                    {currentTeacher.firstName?.[0]}{currentTeacher.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{currentTeacher.firstName} {currentTeacher.lastName}</h2>
              <div className="mt-2 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <span className="text-sm text-gray-900">{currentTeacher.cniNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      currentTeacher.employmentStatus === 'Active' ? 'bg-green-100 text-green-800' : 
                      currentTeacher.employmentStatus === 'OnLeave' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentTeacher.employmentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  {currentTeacher.email && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <span className="text-sm text-gray-900">{currentTeacher.email}</span>
                    </div>
                  )}
                  {currentTeacher.phone && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <span className="text-sm text-gray-900">{currentTeacher.phone}</span>
                    </div>
                  )}
                </div>
                
                {currentTeacher.classTeacherOf && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">Class Teacher:</span>
                    <span className="text-sm font-medium text-blue-700">
                      {currentTeacher.classTeacherOf.className}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
