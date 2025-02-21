// components/student/StudentDetailPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { fetchStudentById } from '~/store/features/studentSlice';
import { useNavigate } from 'react-router';

interface StudentDetailPageProps {
  id: string;
}

export function StudentDetailPage({ id }: StudentDetailPageProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentStudent, loading } = useAppSelector(state => state.students);

  useEffect(() => {
    dispatch(fetchStudentById(id));
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentStudent) {
    return <div>Student not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Student Details
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View complete student information
          </p>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/dashboard/students')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/dashboard/students/${id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Detailed student information sections */}
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Basic Info Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          {/* Add your detail fields here */}
        </div>

        {/* Guardian Info Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Guardian Information</h2>
          {/* Add guardian details here */}
        </div>

        {/* Documents Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Documents & Photo</h2>
          {/* Add documents and photo display here */}
        </div>
      </div>
    </div>
  );
}
