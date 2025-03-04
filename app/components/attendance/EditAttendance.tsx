import { useNavigate, useParams } from 'react-router';
import { useAttendanceRecord, useUpdateAttendance } from '~/hooks/useAttendanceQueries';
import { AttendanceForm } from './AttendanceForm';
import {
  type CreateAttendanceInput,
  type UpdateAttendanceInput 
} from '~/types/attendance';

export function EditAttendance() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: currentAttendance, isLoading: fetchLoading } = useAttendanceRecord(id || '');
  const updateAttendanceMutation = useUpdateAttendance();

  const handleSubmit = (data: CreateAttendanceInput | UpdateAttendanceInput) => {
    if (!id) return;
    
    updateAttendanceMutation.mutate({ 
      id, 
      data: data as UpdateAttendanceInput 
    }, {
      onSuccess: () => {
        navigate('/dashboard/attendance');
      },
      onError: (error) => {
        console.error('Failed to update attendance record:', error);
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard/attendance');
  };

  if (fetchLoading || !currentAttendance) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-gray-500">Loading attendance record...</div>
    </div>;
  }

  const formData = {
    userType: currentAttendance.user.type,
    userId: currentAttendance.user.id,
    date: currentAttendance.date.split('T')[0],
    status: currentAttendance.status,
    reason: currentAttendance.reason || '',
    classId: currentAttendance.class?.id || '',
    checkInTime: currentAttendance.checkInTime || '',
    checkOutTime: currentAttendance.checkOutTime || ''
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Attendance Record</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the attendance record for {currentAttendance.user.name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6">
          <AttendanceForm
            initialData={formData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateAttendanceMutation.isPending}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
