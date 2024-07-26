import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  AttendanceStatus, 
  AttendanceType, 
  type CreateAttendanceInput, 
  type UpdateAttendanceInput 
} from '~/types/attendance';
import { ClassSelector } from '../common/ClassSelector';
import { TeacherSelector } from '../common/TeacherSelector';
import { StudentSelector } from '../common/StudentSelector';
import { StaffSelector } from '../common/StaffSelector';
import { TextArea } from '../common/form/inputs/TextArea';
import { DateInput } from '../common/form/inputs/DateInput';
import { SelectInput } from '../common/form/inputs/SelectInput';

interface AttendanceFormProps {
  initialData?: Partial<CreateAttendanceInput>;
  onSubmit: (data: CreateAttendanceInput | UpdateAttendanceInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function AttendanceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false
}: AttendanceFormProps) {
  const [formData, setFormData] = useState<CreateAttendanceInput>({
    userType: initialData?.userType || AttendanceType.STUDENT,
    userId: initialData?.userId || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    status: initialData?.status || AttendanceStatus.PRESENT,
    reason: initialData?.reason || '',
    classId: initialData?.classId || '',
    checkInTime: initialData?.checkInTime || '',
    checkOutTime: initialData?.checkOutTime || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (key: keyof CreateAttendanceInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'userType') {
      setFormData(prev => ({
        ...prev,
        userId: '',
        classId: (value === AttendanceType.TEACHER || value === AttendanceType.STAFF) ? '' : prev.classId
      }));
    }

    if (key === 'classId' && formData.userType === AttendanceType.STUDENT) {
      setFormData(prev => ({
        ...prev,
        userId: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare submission data, excluding classId for Teacher/Staff
    const submissionData: CreateAttendanceInput | UpdateAttendanceInput = {
      userType: formData.userType,
      userId: formData.userId,
      date: formData.date,
      status: formData.status,
      ...(formData.reason && { reason: formData.reason }),
      ...(formData.userType === AttendanceType.STUDENT && formData.classId && { classId: formData.classId }),
      ...(formData.checkInTime && { checkInTime: formData.checkInTime }),
      ...(formData.checkOutTime && { checkOutTime: formData.checkOutTime })
    };

    onSubmit(submissionData);
  };

  const isStudent = formData.userType === AttendanceType.STUDENT;
  const isTeacher = formData.userType === AttendanceType.TEACHER;
  const isStaff = formData.userType === AttendanceType.STAFF;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput<typeof AttendanceType>
            label="User Type"
            value={formData.userType}
            onChange={(value) => handleChange('userType', value)}
            options={AttendanceType}
            placeholder="Select User Type"
            required
          />

          {isStudent && (
            <ClassSelector 
              value={formData.classId || ''}
              onChange={(value) => handleChange('classId', value)}
              required
            />
          )}

          {isStudent && (
            <StudentSelector
              value={formData.userId}
              onChange={(value) => handleChange('userId', value)}
              classId={formData.classId}
              required
            />
          )}

          {isTeacher && (
            <TeacherSelector
              value={formData.userId}
              onChange={(value) => handleChange('userId', value)}
              required
            />
          )}

          {isStaff && (
            <StaffSelector
              value={formData.userId}
              onChange={(value) => handleChange('userId', value)}
              required
            />
          )}

          <DateInput 
            label='Date'
            value={formData.date || ''}
            onChange={(value) => handleChange('date', value)}
            required
          />

          <SelectInput<typeof AttendanceStatus>
            label="Status"
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
            options={AttendanceStatus}
            placeholder="Select Status"
            required
          />

          {(formData.status === AttendanceStatus.ABSENT || formData.status === AttendanceStatus.LATE || formData.status === AttendanceStatus.LEAVE) && (
            <div className="md:col-span-2">
              <TextArea 
                label='Reason'
                value={formData.reason || ''}
                onChange={(value) => handleChange('reason', value)}
                placeholder={`Reason for being ${formData.status.toLowerCase()}`}
                rows={3}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check In Time (Optional)
            </label>
            <input
              type="time"
              value={formData.checkInTime || ''}
              onChange={(e) => handleChange('checkInTime', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Check Out Time (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check Out Time (Optional)
            </label>
            <input
              type="time"
              value={formData.checkOutTime || ''}
              onChange={(e) => handleChange('checkOutTime', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
}
