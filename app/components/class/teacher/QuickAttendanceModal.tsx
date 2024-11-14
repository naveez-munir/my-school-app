import { useState } from 'react';
import { X } from 'lucide-react';
import type { StudentResponse } from '~/types/student';
import { AttendanceStatus, AttendanceType } from '~/types/attendance';
import { useCreateAttendance } from '~/hooks/useAttendanceQueries';
import toast from 'react-hot-toast';
import { getErrorMessage } from '~/utils/error';

interface Props {
  student: StudentResponse;
  classId: string;
  onClose: () => void;
}

export function QuickAttendanceModal({ student, classId, onClose }: Props) {
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const createAttendanceMutation = useCreateAttendance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAttendanceMutation.mutate({
      userType: AttendanceType.STUDENT,
      userId: student.id,
      date,
      status,
      reason: reason || undefined,
      classId
    }, {
      onSuccess: () => {
        toast.success(`Attendance marked for ${student.name}`);
        onClose();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Mark Attendance
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-900">
              {student.name}
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={AttendanceStatus.PRESENT}>Present</option>
              <option value={AttendanceStatus.ABSENT}>Absent</option>
              <option value={AttendanceStatus.LATE}>Late</option>
              <option value={AttendanceStatus.LEAVE}>Leave</option>
            </select>
          </div>

          {(status === AttendanceStatus.ABSENT || status === AttendanceStatus.LEAVE) && (
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Enter reason..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAttendanceMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createAttendanceMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
