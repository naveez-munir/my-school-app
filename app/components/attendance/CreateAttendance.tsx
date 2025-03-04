import { useNavigate } from 'react-router';
import { useCreateAttendance } from '~/hooks/useAttendanceQueries';
import { AttendanceForm } from './AttendanceForm';
import { type CreateAttendanceInput, type UpdateAttendanceInput } from '~/types/attendance';

export function CreateAttendance() {
  const navigate = useNavigate();
  const createAttendanceMutation = useCreateAttendance();

  const handleSubmit = (data: CreateAttendanceInput | UpdateAttendanceInput) => {
    createAttendanceMutation.mutate(data as CreateAttendanceInput, {
      onSuccess: () => {
        navigate('/dashboard/attendance');
      },
      onError: (error) => {
        console.error('Failed to create attendance record:', error);
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/attendance');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Attendance Record</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new attendance record for a student or teacher
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <AttendanceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createAttendanceMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
