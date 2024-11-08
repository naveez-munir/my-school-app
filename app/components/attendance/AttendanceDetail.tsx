import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { useAttendanceRecord, useDeleteAttendance, useUpdateAttendance } from '~/hooks/useAttendanceQueries';
import { format } from 'date-fns';
import { 
  Calendar, 
  ChevronLeft, 
  Edit2, 
  Trash2, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  School,
  LogIn,
  LogOut
} from 'lucide-react';
import { Modal } from '~/components/common/Modal';
import { AttendanceStatus, AttendanceType } from '~/types/attendance';
import { getErrorMessage } from '~/utils/error';

export function AttendanceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: attendance, isLoading, error } = useAttendanceRecord(id || '');
  const deleteAttendanceMutation = useDeleteAttendance();
  const updateAttendanceMutation = useUpdateAttendance();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/dashboard/attendance/${id}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!id) return;
    deleteAttendanceMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Attendance record deleted successfully');
        navigate('/dashboard/attendance');
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
        setIsDeleteModalOpen(false);
      }
    });
  };

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const confirmCheckout = () => {
    if (!id) return;
    const now = new Date();
    const checkOutTime = now.toTimeString().slice(0, 5);

    updateAttendanceMutation.mutate(
      {
        id,
        data: { checkOutTime }
      },
      {
        onSuccess: () => {
          toast.success('Checked out successfully');
          setIsCheckoutModalOpen(false);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          setIsCheckoutModalOpen(false);
        }
      }
    );
  };

  const handleBack = () => {
    navigate('/dashboard/attendance');
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case AttendanceStatus.ABSENT:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case AttendanceStatus.LATE:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case AttendanceStatus.LEAVE:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case AttendanceStatus.PRESENT:
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>
          {getStatusIcon(status)} Present
        </span>;
      case AttendanceStatus.ABSENT:
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>
          {getStatusIcon(status)} Absent
        </span>;
      case AttendanceStatus.LATE:
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          {getStatusIcon(status)} Late
        </span>;
      case AttendanceStatus.LEAVE:
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          {getStatusIcon(status)} Leave
        </span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !attendance) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {(error as Error)?.message || "Attendance record not found"}
        </div>
        <button 
          onClick={handleBack}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Attendance List
        </button>
      </div>
    );
  }

  const canCheckout = (attendance.status === AttendanceStatus.PRESENT || attendance.status === AttendanceStatus.LATE)
                     && attendance.checkInTime && !attendance.checkOutTime;

  return (
    <div className="py-6 px-4 space-y-6">
      {/* Header Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Attendance List
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Details</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            {canCheckout && (
              <button
                onClick={handleCheckout}
                className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Check Out
              </button>
            )}
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{attendance.user.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {attendance.user.type === AttendanceType.STUDENT && attendance.user.rollNumber && (
                    <span className="font-medium">Roll No: {attendance.user.rollNumber}</span>
                  )}
                  {(attendance.user.type === AttendanceType.TEACHER || attendance.user.type === AttendanceType.STAFF) && attendance.user.employeeId && (
                    <span className="font-medium">Employee ID: {attendance.user.employeeId}</span>
                  )}
                </p>
              </div>
            </div>
            {getStatusBadge(attendance.status)}
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Date */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(new Date(attendance.date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* User Type */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">User Type</p>
                  <p className="text-lg font-semibold text-gray-900">{attendance.user.type}</p>
                </div>
              </div>
            </div>

            {/* Class */}
            {attendance.class && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <School className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Class</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {attendance.class.className} - {attendance.class.section}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Check In Time */}
            {attendance.checkInTime && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <LogIn className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Check In Time</p>
                    <p className="text-lg font-semibold text-gray-900">{attendance.checkInTime}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Check Out Time */}
            {attendance.checkOutTime && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Check Out Time</p>
                    <p className="text-lg font-semibold text-gray-900">{attendance.checkOutTime}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reason Section */}
          {attendance.reason && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Reason</p>
                    <p className="text-base text-gray-900 leading-relaxed">
                      {attendance.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Record Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Created</p>
                <p className="text-sm text-gray-900 font-medium">
                  {format(new Date(attendance.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Last Updated</p>
                <p className="text-sm text-gray-900 font-medium">
                  {format(new Date(attendance.updatedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Attendance Record"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <div className="h-5 w-5 text-red-600">🗑️</div>
            <p className="text-sm text-red-800">
              This action cannot be undone. This will permanently delete the attendance record.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete attendance for <strong>{attendance.user.name}</strong> on{' '}
            <strong>{format(new Date(attendance.date), 'MMMM d, yyyy')}</strong>?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleteAttendanceMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
            >
              {deleteAttendanceMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Check Out"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to check out <strong>{attendance.user.name}</strong>?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmCheckout}
              disabled={updateAttendanceMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {updateAttendanceMutation.isPending ? 'Checking Out...' : 'Check Out'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

