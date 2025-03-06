import { useNavigate, useParams } from 'react-router';
import { useClass } from '~/hooks/useClassQueries';

export function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    data: currentClass, 
    isLoading, 
    error 
  } = useClass(id || '');

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          No class found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            View detailed information about the class
          </p>
        </div>
        <button
          onClick={() => navigate(`/dashboard/classes/${id}/edit`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Edit Class
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Class Name</label>
                <p className="mt-1 text-sm text-gray-900">{currentClass.className}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Section</label>
                <p className="mt-1 text-sm text-gray-900">{currentClass.classSection || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Grade Level</label>
                <p className="mt-1 text-sm text-gray-900">{currentClass.classGradeLevel || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Teachers</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Main Teacher</label>
                <p className="mt-1 text-sm text-gray-900">{currentClass.classTeacher?.firstName || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Temporary Teacher</label>
                <p className="mt-1 text-sm text-gray-900">{currentClass.classTempTeacher?.firstName || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-lg shadow overflow-hidden md:col-span-2">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subjects</h3>
            {currentClass.classSubjects && currentClass.classSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentClass.classSubjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <p className="font-medium text-gray-900">{subject.subjectName}</p>
                    {subject.subjectCode && (
                      <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No subjects assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
